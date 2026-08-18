import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
  1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 60, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 80, totalSets: 3, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 120, totalSets: 3, profit: 0.025 }
}

const loadSet = async (vip, day, set) => {
  try {
    const mod = await import(`@/data/vip${vip}/day${day}/vip${vip}Set${set}.js`)
    return mod.default || mod[`vip${vip}Set${set}`]
  } catch {
    return null
  }
}

const generateTaskCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 10000000).toString().padStart(10, '0')
  return `${date}${rand}`
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let currentProductsArray = []
    try {
      currentProductsArray = typeof user.currentTaskProducts === 'string'
      ? JSON.parse(user.currentTaskProducts || '[]')
        : (user.currentTaskProducts || [])
    } catch {
      currentProductsArray = []
    }

    if (currentProductsArray.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]

    // ADMIN ONLY
    const currentDay = user.currentDay || 1 // 1-5
    const currentSet = user.currentSet || 1 // 1-3
    let tasksInCurrentSet = user.tasksInCurrentSet || 0

    const userCurrentTaskNumber = tasksInCurrentSet + 1

    if (tasksInCurrentSet >= config.tasksPerSet) {
      return NextResponse.json({ error: `Set ${currentSet} completed. Contact admin to open next set.` }, { status: 400 })
    }

    const fileSet = await loadSet(user.vipLevel, currentDay, currentSet)
    if (!fileSet) return NextResponse.json({ error: `Data missing: /data/vip${user.vipLevel}/day${currentDay}/vip${user.vipLevel}Set${currentSet}.js` }, { status: 400 })

    const normalProduct = fileSet.find(p => Number(p.id) === userCurrentTaskNumber)
    if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber} in VIP${user.vipLevel} Day${currentDay} Set${currentSet}` }, { status: 400 })

    // CHANGED 1: read profit + bonus from file. use config.profit as fallback
    const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
    const bonus = Number(normalProduct.bonusMultiplier) || 1
    const activeProfitRate = baseRate * bonus

    const productsToAssign = [{
      id: userCurrentTaskNumber,
      productId: userCurrentTaskNumber,
      photoId: userCurrentTaskNumber,
      name: normalProduct.name,
      price: parseFloat(normalProduct.price || 0),
      rating: normalProduct.rating || 5.0,
      image: normalProduct.image || `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${userCurrentTaskNumber}.jpg`, // CHANGED 2: use file image first
      profitPercent: normalProduct.profitPercent, // ADD for frontend
      bonusMultiplier: bonus // ADD for frontend
    }]

    const pPrice = parseFloat(productsToAssign[0].price || 0)
    const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
    const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))

    const innerItemsSnapshot = [{
    ...productsToAssign[0],
      profit: profitAmount,
      reserveAmount
    }]

    if ((user.taskCompleted || 0) === 0 && parseFloat(user.walletBalance || 0) < 50) {
      return NextResponse.json({ error: 'Balance below 50 unable to continue trading' }, { status: 400 })
    }

    const newWallet = parseFloat((user.walletBalance - pPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + reserveAmount).toFixed(2))
    const progressLabelString = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${config.tasksPerSet}`

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: innerItemsSnapshot,
          activeProducts: innerItemsSnapshot,
          tasksInCurrentSet: userCurrentTaskNumber
        }
      }),
      prisma.task.create({
        data: {
          userId,
          vipLevel: user.vipLevel,
          day: currentDay, // CHANGED 3: save day
          setNumber: currentSet,
          progress: progressLabelString,
          status: 'pending',
          products: innerItemsSnapshot,
          taskCode: generateTaskCode()
        }
      })
    ])

    return NextResponse.json({ success: true, products: productsToAssign })
  } catch (err) {
    console.error('[CRASH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}