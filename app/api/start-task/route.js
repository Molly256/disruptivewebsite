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
    console.log('file load fail, fallback to DB', e.message)
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
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const vipLevel = Number(user.vipLevel) || 1
    const config = VIP_CONFIG[vipLevel] || VIP_CONFIG[1]
    const needed = config.tasksPerSet

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1
    const tasksInCurrentSet = user.tasksInCurrentSet || 0
    const userCurrentTaskNumber = tasksInCurrentSet + 1

    if (tasksInCurrentSet >= needed) {
      return NextResponse.json({ error: `Set ${currentSet} completed.` }, { status: 400 })
    }

    const completedCount = Number(user.taskCompleted || 0)
    const walletVal = round2(user.walletBalance || 0)
    if (completedCount === 0 && walletVal < 50) {
      return NextResponse.json({ error: 'New user balance below 50 unable to continue trading' }, { status: 400 })
    }

    let activeCheck = user.activeProducts
    if (typeof activeCheck === 'string') {
      try { activeCheck = JSON.parse(activeCheck) } catch { activeCheck = [] }
    }
    if (Array.isArray(activeCheck) && activeCheck.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

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
      if (!fileSet) return NextResponse.json({ error: `Admin hasn't configured VIP${vipLevel} Day${currentDay} Set${currentSet}` }, { status: 400 })
      fileSet = [...fileSet].sort((a,b)=> Number(a.taskOrder||a.id) - Number(b.taskOrder||b.id))
      if (fileSet.length!== needed) {
        return NextResponse.json({ error: `Set has ${fileSet.length} tasks but VIP${vipLevel} needs ${needed}. Ask admin to save ${needed} tasks.` }, { status: 400 })
      }
    }

    const normalProduct = fileSet.find(p => Number(p.taskOrder || p.id) === userCurrentTaskNumber)
    if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber} in set (have ${fileSet.length})` }, { status: 400 })

    const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
    const bonus = Number(normalProduct.bonusMultiplier) || 1
    const activeProfitRate = baseRate * bonus

    // FIXED: KEEP COMBO FIELDS
    const singleProduct = {
      id: userCurrentTaskNumber,
      taskOrder: userCurrentTaskNumber,
      productId: normalProduct.productId || normalProduct.id,
      name: normalProduct.name,
      price: round2(normalProduct.price || 0),
      image: normalProduct.image,
      rating: normalProduct.rating,
      profitPercent: normalProduct.profitPercent || (baseRate * 100),
      bonusMultiplier: bonus,
      isCombo: normalProduct.isCombo || false,
      comboMultiplier: normalProduct.comboMultiplier || 1,
      costMultiplier: normalProduct.costMultiplier || 1,
      profit: round2(parseFloat(normalProduct.price) * activeProfitRate)
    }

    const reserveAmount = round2(singleProduct.price + singleProduct.profit)
    const activeSnapshot = [{...singleProduct, reserveAmount }]

    const pPrice = singleProduct.price
    const newWallet = round2(Number(user.walletBalance) - pPrice)
    const newHold = round2(Number(user.holdAmount || 0) + pPrice)
    const progressLabel = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${needed}`

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
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
          userId,
          vipLevel: vipLevel,
          day: currentDay,
          setNumber: currentSet,
          progress: progressLabel,
          status: 'pending',
          products: activeSnapshot,
          taskCode: generateTaskCode()
        }
      })
      return await tx.user.findUnique({ where: { id: userId } })
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error('[START-TASK]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}