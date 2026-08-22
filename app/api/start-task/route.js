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
  return null // no file fallback on Vercel
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

    if (currentProductsArray.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const completedCount = Number(user.taskCompleted || 0)
    const walletVal = parseFloat(user.walletBalance || 0)
    if (completedCount === 0 && walletVal < 50) {
      return NextResponse.json({ error: 'New user balance below 50 unable to continue trading' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1
    const tasksInCurrentSet = user.tasksInCurrentSet || 0
    const userCurrentTaskNumber = tasksInCurrentSet + 1

    if (tasksInCurrentSet >= config.tasksPerSet) {
      return NextResponse.json({ error: `Set ${currentSet} completed. Contact admin.` }, { status: 400 })
    }

    const fileSet = await loadSet(user.vipLevel, currentDay, currentSet)
    if (!fileSet) return NextResponse.json({ error: `Admin hasn't configured VIP${user.vipLevel} Day${currentDay} Set${currentSet} yet. Please ask admin to save tasks in DB.` }, { status: 400 })

    const normalProduct = fileSet.find(p => Number(p.id) === userCurrentTaskNumber || Number(p.taskOrder) === userCurrentTaskNumber)
    if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber} in set` }, { status: 400 })

    const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
    const bonus = Number(normalProduct.bonusMultiplier) || 1
    const activeProfitRate = baseRate * bonus

    const realImgPath = normalProduct.image || `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${userCurrentTaskNumber}.jpg`

    const productsToAssign = [{
      id: userCurrentTaskNumber,
      taskOrder: userCurrentTaskNumber,
      name: normalProduct.name,
      price: parseFloat(normalProduct.price || 0),
      image: realImgPath,
      profitPercent: normalProduct.profitPercent || (baseRate * 100),
      bonusMultiplier: bonus,
      profit: parseFloat((parseFloat(normalProduct.price) * activeProfitRate).toFixed(2))
    }]

    const pPrice = productsToAssign[0].price
    const profitAmount = productsToAssign[0].profit
    const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))
    const innerItemsSnapshot = [{...productsToAssign[0], reserveAmount }]

    const newWallet = parseFloat((user.walletBalance - pPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + pPrice).toFixed(2))
    const progressLabel = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${config.tasksPerSet}`

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: innerItemsSnapshot,
          activeProducts: innerItemsSnapshot
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
          products: innerItemsSnapshot,
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