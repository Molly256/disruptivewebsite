import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
  1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 45, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 50, totalSets: 3, profit: 0.015 },
  4: { tasksPerSet: 55, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 60, totalSets: 3, profit: 0.025 },
}

export async function POST(req) {
  try {
    const { userId, currentTaskNumber } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]

    let currentTaskProducts = []
    try { currentTaskProducts = typeof user.currentTaskProducts === 'string'? JSON.parse(user.currentTaskProducts||'[]') : (user.currentTaskProducts||[]) } catch { currentTaskProducts = [] }

    let activeProducts = []
    try { activeProducts = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts||'[]') : (user.activeProducts||[]) } catch { activeProducts = [] }

    const toSubmit = activeProducts.length>0? activeProducts : currentTaskProducts.slice(0,1)
    if (toSubmit.length === 0) return NextResponse.json({ error: 'No active task found to submit.' }, { status: 400 })

    const x10List = typeof user.x10TaskNumbers === 'string'? JSON.parse(user.x10TaskNumbers||'[]') : (user.x10TaskNumbers||[])
    const isX10 = x10List.includes(Number(currentTaskNumber))
    const currentSet = user.currentSet || 1

    let totalPrice = 0
    let totalProfit = 0
    const enrichedProducts = []

    toSubmit.forEach(ut => {
      const pPrice = parseFloat(ut.price || 0)
      const baseRate =!isNaN(parseFloat(ut.profitPercent))? (parseFloat(ut.profitPercent)/100) : config.profit
      const bonus = isX10? 10 : (Number(ut.bonusMultiplier)||1)
      const pProfit = parseFloat((pPrice * baseRate * bonus).toFixed(2))
      totalPrice += pPrice
      totalProfit += pProfit
      enrichedProducts.push({...ut, price: pPrice, profit: pProfit })
    })

    const activePendingTaskCard = await prisma.task.findFirst({
      where: { userId, status: 'pending', setNumber: currentSet },
      orderBy: { createdAt: 'desc' }
    })

    let completedArr = []
    try { completedArr = typeof user.completedProducts === 'string'? JSON.parse(user.completedProducts||'[]') : (user.completedProducts||[]) } catch { completedArr=[] }

    let tasksInCurrentSet = Number(user.tasksInCurrentSet || 0)
    let nextTasksInCurrentSet = tasksInCurrentSet + 1
    let nextSet = currentSet
    let isSetComplete = false

    // === FIXED: LOCK AT 40/40, NO AUTO RESET ===
    if (nextTasksInCurrentSet >= config.tasksPerSet) {
      isSetComplete = true
      nextTasksInCurrentSet = config.tasksPerSet // stay 40/40 not 0
      nextSet = currentSet // stay same set, don't go to next
    }

    const returnToWallet = parseFloat((totalPrice + totalProfit).toFixed(2))

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: returnToWallet },
          holdAmount: { decrement: totalPrice },
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: isSetComplete? [] : currentTaskProducts,
          activeProducts: [],
          completedProducts: [...completedArr,...enrichedProducts],
          taskCompleted: { increment: 1 },
          tasksInCurrentSet: nextTasksInCurrentSet,
          currentSet: nextSet
        }
      })

      if (activePendingTaskCard) {
        await tx.task.update({
          where: { id: activePendingTaskCard.id },
          data: { status: 'completed', completedAt: new Date(), products: enrichedProducts }
        })
      }

      if (user.inviterId && totalProfit > 0) {
        const rewardAmount = parseFloat((totalProfit * 0.20).toFixed(2))
        if (rewardAmount > 0) {
          await tx.user.update({
            where: { id: user.inviterId },
            data: {
              walletBalance: { increment: rewardAmount },
              referralEarnings: { increment: rewardAmount }
            }
          })
          await tx.referralReward.create({
            data: {
              inviterId: user.inviterId,
              inviteeId: user.id,
              inviteeUsername: user.username,
              taskProfit: totalProfit,
              rewardAmount: rewardAmount,
              rate: 0.20,
              vipLevel: user.vipLevel,
              taskNumber: Number(currentTaskNumber)||0
            }
          })
          await tx.transaction.create({
            data: {
              userId: user.inviterId,
              type: 'referral_bonus',
              amount: rewardAmount,
              status: 'success'
            }
          })
        }
      }
      return await tx.user.findUnique({ where: { id: userId } })
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      isSetComplete: isSetComplete,
      message: isSetComplete? "Set completed - Contact customer service" : null
    })
  } catch (err) {
    console.error("Submission failure:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}