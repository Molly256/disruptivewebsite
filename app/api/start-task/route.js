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
  const dbConfig = await prisma.taskSetConfig.findUnique({
    where: { vipLevel_day_setNum: { vipLevel: vip, day, setNum: set } }
  })
  if (dbConfig?.data?.length > 0) return dbConfig.data
  return null
}

const generateTaskCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 10000000).toString().padStart(10, '0')
  return `${date}${rand}`
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let currentProductsArray = []
    try {
      currentProductsArray = typeof user.currentTaskProducts === 'string'? JSON.parse(user.currentTaskProducts || '[]') : (user.currentTaskProducts || [])
    } catch { currentProductsArray = [] }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const needed = config.tasksPerSet // 40 for VIP1, 45 for VIP2 etc.

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1
    const tasksInCurrentSet = user.tasksInCurrentSet || 0
    const userCurrentTaskNumber = tasksInCurrentSet + 1

    if (tasksInCurrentSet >= needed) {
      return NextResponse.json({ error: `Set ${currentSet} completed.` }, { status: 400 })
    }

    const completedCount = Number(user.taskCompleted || 0)
    const walletVal = parseFloat(user.walletBalance || 0)
    if (completedCount === 0 && walletVal < 50) {
      return NextResponse.json({ error: 'New user balance below 50 unable to continue trading' }, { status: 400 })
    }

    // has active task?
    if (user.activeProducts && typeof user.activeProducts!== 'string' && user.activeProducts.length > 0) {
      if (Array.isArray(user.activeProducts) && user.activeProducts.length > 0) {
        // if activeProducts = 1 task and currentProducts already has full set, allow check to pass after submit
        // but if activeProducts exists, block
        const act = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts) : user.activeProducts
        if (act.length > 0) {
          return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
        }
      }
    }

    let fileSet = []
    if (currentProductsArray.length >= needed) {
      // user already started set, use his DB (so admin per-user edit stays)
      fileSet = currentProductsArray
    } else {
      fileSet = await loadSet(user.vipLevel, currentDay, currentSet)
      if (!fileSet) return NextResponse.json({ error: `Admin hasn't configured VIP${user.vipLevel} Day${currentDay} Set${currentSet}` }, { status: 400 })
      fileSet = [...fileSet].sort((a,b)=> Number(a.taskOrder||a.id) - Number(b.taskOrder||b.id))
      if (fileSet.length!== needed) {
        return NextResponse.json({ error: `Set has ${fileSet.length} tasks but VIP${user.vipLevel} needs ${needed}. Ask admin to save ${needed} tasks.` }, { status: 400 })
      }
    }

    const normalProduct = fileSet.find(p => Number(p.taskOrder || p.id) === userCurrentTaskNumber)
    if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber} in set (have ${fileSet.length})` }, { status: 400 })

    const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
    const bonus = Number(normalProduct.bonusMultiplier) || 1
    const activeProfitRate = baseRate * bonus

    const singleProduct = {
      id: userCurrentTaskNumber,
      taskOrder: userCurrentTaskNumber,
      name: normalProduct.name,
      price: parseFloat(normalProduct.price || 0),
      image: normalProduct.image,
      profitPercent: normalProduct.profitPercent || (baseRate * 100),
      bonusMultiplier: bonus,
      profit: parseFloat((parseFloat(normalProduct.price) * activeProfitRate).toFixed(2))
    }

    const reserveAmount = parseFloat((singleProduct.price + singleProduct.profit).toFixed(2))
    const activeSnapshot = [{...singleProduct, reserveAmount }]

    const pPrice = singleProduct.price
    const newWallet = parseFloat((user.walletBalance - pPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + pPrice).toFixed(2))
    const progressLabel = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${needed}`

    const updatedUser = await prisma.$transaction(async (tx) => {
      const dataToSave = currentProductsArray.length >= needed? currentProductsArray : fileSet

      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: dataToSave, // 40 or 45 or 50 depending on VIP
          activeProducts: activeSnapshot
        }
      })
      await tx.task.create({
        data: {
          userId,
          vipLevel: user.vipLevel,
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