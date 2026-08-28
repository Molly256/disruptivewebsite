import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
  1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 45, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 50, totalSets: 3, profit: 0.015 },
  4: { tasksPerSet: 55, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 60, totalSets: 3, profit: 0.025 }
}

const loadSet = async (vip, day, set) => {
  try {
    const mod = await import(`@/data/vip${vip}/day${day}/vip${vip}Set${set}.js`)
    const key = `vip${vip}Set${set}`
    return mod[key] || Object.values(mod)[0] || null
  } catch (e) {
    const dbConfig = await prisma.taskSetConfig.findUnique({
      where: { vipLevel_day_setNum: { vipLevel: vip, day, setNum: set } }
    })
    if (dbConfig?.data?.length > 0) return dbConfig.data
    return null
  }
}

const generateTaskCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 10000000).toString().padStart(10, '0')
  return `${date}${rand}`
}

const round2 = (n) => {
  const v = Math.round(Number(n) * 100) / 100
  return Math.abs(v) < 0.005? 0 : v
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId missing' }, { status: 400 })

    // ALL LOGIC INSIDE TRANSACTION TO PREVENT DOUBLE TAP SKIP
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: String(userId) } })
      if (!user) throw new Error('User not found')

      const vipLevel = Number(user.vipLevel) || 1
      const config = VIP_CONFIG[vipLevel] || VIP_CONFIG[1]
      const needed = config.tasksPerSet

      const currentDay = user.currentDay || 1
      const currentSet = user.currentSet || 1
      const tasksInCurrentSet = user.tasksInCurrentSet || 0
      const userCurrentTaskNumber = tasksInCurrentSet + 1

      if (tasksInCurrentSet >= needed) {
        throw new Error(`Set ${currentSet} completed - Contact customer service`)
      }

      const completedCount = Number(user.taskCompleted || 0)
      const walletVal = round2(user.walletBalance || 0)
      if (completedCount === 0 && walletVal < 50) {
        throw new Error('New user balance below 50 unable to continue trading')
      }

      // CHECK INSIDE TX - THIS IS THE FIX FOR SKIP BUG
      let activeCheck = user.activeProducts
      if (typeof activeCheck === 'string') {
        try { activeCheck = JSON.parse(activeCheck) } catch { activeCheck = [] }
      }
      if (Array.isArray(activeCheck) && activeCheck.length > 0) {
        throw new Error('You have an active task. Submit it first.')
      }

      // Also check pending Task row inside tx
      const pending = await tx.task.findFirst({ where: { userId: String(userId), status: 'pending' } })
      if (pending) throw new Error('You have an active task. Submit it first.')

      let fileSet = null
      let cached = []
      try {
        cached = typeof user.currentTaskProducts === 'string'? JSON.parse(user.currentTaskProducts || '[]') : (user.currentTaskProducts || [])
      } catch { cached = [] }

      const cacheValid = cached.length === needed && Number(user.totalTasks) === needed

      if (cacheValid) {
        fileSet = cached
      } else {
        fileSet = await loadSet(vipLevel, currentDay, currentSet)
        if (!fileSet) throw new Error(`Admin hasn't configured VIP${vipLevel} Day${currentDay} Set${currentSet}`)
        fileSet = [...fileSet].sort((a,b)=> Number(a.taskOrder||a.id) - Number(b.taskOrder||b.id))
        if (fileSet.length!== needed) {
          throw new Error(`Set has ${fileSet.length} tasks but VIP${vipLevel} needs ${needed}. Ask admin to save ${needed} tasks.`)
        }
      }

      const normalProduct = fileSet.find(p => Number(p.taskOrder || p.id) === userCurrentTaskNumber)
      if (!normalProduct) throw new Error(`No product ${userCurrentTaskNumber} in set (have ${fileSet.length})`)

      const rawPrice = Number(normalProduct.price || 0)
      const costMult = Number(normalProduct.costMultiplier || 1)
      const realPrice = round2(rawPrice * costMult)

      const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
      const bonus = Number(normalProduct.bonusMultiplier) || 1
      const activeProfitRate = baseRate * bonus

      const singleProduct = {
        id: userCurrentTaskNumber,
        taskOrder: userCurrentTaskNumber,
        productId: normalProduct.productId || normalProduct.id,
        name: normalProduct.name,
        price: realPrice,
        rawPrice: rawPrice,
        image: normalProduct.image,
        rating: normalProduct.rating,
        profitPercent: normalProduct.profitPercent || (baseRate * 100),
        bonusMultiplier: bonus,
        isCombo: normalProduct.isCombo || false,
        comboMultiplier: normalProduct.comboMultiplier || 1,
        costMultiplier: costMult,
        profit: round2(realPrice * activeProfitRate)
      }

      const reserveAmount = round2(singleProduct.price + singleProduct.profit)
      const activeSnapshot = [{...singleProduct, reserveAmount }]

      const newWallet = round2(Number(user.walletBalance) - realPrice)
      const newHold = round2(realPrice)

      const progressLabel = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${needed}`

      await tx.user.update({
        where: { id: String(userId) },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: fileSet,
          activeProducts: activeSnapshot,
          totalTasks: needed
        }
      })
      await tx.task.create({
        data: {
          userId: String(userId),
          vipLevel: vipLevel,
          day: currentDay,
          setNumber: currentSet,
          progress: progressLabel,
          status: 'pending',
          products: activeSnapshot,
          taskCode: generateTaskCode()
        }
      })
      const updatedUser = await tx.user.findUnique({ where: { id: String(userId) } })
      return updatedUser
    })

    return NextResponse.json({ success: true, user: result })
  } catch (err) {
    console.error('[START-TASK]', err)
    const msg = err.message.includes('active task')? err.message : err.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}