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
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: String(userId) } })
      if (!user) throw new Error('User not found')

      const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]

      let currentTaskProducts = []
      try { currentTaskProducts = typeof user.currentTaskProducts === 'string'? JSON.parse(user.currentTaskProducts||'[]') : (user.currentTaskProducts||[]) } catch { currentTaskProducts = [] }

      let activeProducts = []
      try { activeProducts = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts||'[]') : (user.activeProducts||[]) } catch { activeProducts = [] }

      // FIX 1: CHECK INSIDE TX - PREVENTS DOUBLE SUBMIT SKIP
      if (activeProducts.length === 0) throw new Error('No active task found to submit.')

      const currentTaskNumber = Number(activeProducts[0]?.taskOrder || user.tasksInCurrentSet + 1)

      const x10List = typeof user.x10TaskNumbers === 'string'? JSON.parse(user.x10TaskNumbers||'[]') : (user.x10TaskNumbers||[])
      const isX10 = x10List.includes(Number(currentTaskNumber))
      const currentSet = user.currentSet || 1

      let totalPrice = 0
      let totalProfit = 0
      const enrichedProducts = []

      activeProducts.forEach(ut => {
        const pPrice = parseFloat(ut.price || 0)
        const baseRate =!isNaN(parseFloat(ut.profitPercent))? (parseFloat(ut.profitPercent)/100) : config.profit
        const bonus = isX10? 10 : (Number(ut.bonusMultiplier)||1)
        const pProfit = parseFloat((pPrice * baseRate * bonus).toFixed(2))
        totalPrice += pPrice
        totalProfit += pProfit
        enrichedProducts.push({...ut, price: pPrice, profit: pProfit })
      })

      const activePendingTaskCard = await tx.task.findFirst({
        where: { userId: String(userId), status: 'pending', setNumber: currentSet },
        orderBy: { createdAt: 'desc' }
      })
      if (!activePendingTaskCard) throw new Error('No pending task card found')

      let completedArr = []
      try { completedArr = typeof user.completedProducts === 'string'? JSON.parse(user.completedProducts||'[]') : (user.completedProducts||[]) } catch { completedArr=[] }

      const returnToWallet = parseFloat((totalPrice + totalProfit).toFixed(2))

      // FIX 2: ATOMIC INCREMENT INSIDE TX - NO MORE tasksInCurrentSet +1 OUTSIDE
      const isLastTask = (Number(user.tasksInCurrentSet) + 1) >= config.tasksPerSet
      const isSetComplete = isLastTask

      const updatedUser = await tx.user.update({
        where: { id: String(userId) },
        data: {
          walletBalance: { increment: returnToWallet },
          holdAmount: 0, // FIX: reset to 0, not decrement (prevents negative bug)
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: isSetComplete? [] : currentTaskProducts,
          activeProducts: [],
          completedProducts: [...completedArr,...enrichedProducts],
          taskCompleted: { increment: 1 },
          tasksInCurrentSet: isSetComplete? config.tasksPerSet : { increment: 1 },
          currentSet: currentSet
        }
      })

      await tx.task.update({
        where: { id: activePendingTaskCard.id },
        data: { status: 'completed', completedAt: new Date(), products: enrichedProducts }
      })

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
              taskNumber: currentTaskNumber
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
      return { user: updatedUser, isSetComplete }
    })

    return NextResponse.json({
      success: true,
      user: result.user,
      isSetComplete: result.isSetComplete,
      message: result.isSetComplete? "Set completed - Contact customer service" : null
    })
  } catch (err) {
    console.error("Submission failure:", err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}