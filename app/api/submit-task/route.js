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
    if (!user) return NextResponse.json({ error: 'User not found' }, { where: { status: 404 } })

    const userTaskProducts = typeof user.currentTaskProducts === 'string'
      ? JSON.parse(user.currentTaskProducts || '[]')
      : (user.currentTaskProducts || [])

    if (userTaskProducts.length === 0) {
      return NextResponse.json({ error: 'No active task found to submit.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]

    const x10List = typeof user.x10TaskNumbers === 'string'
      ? JSON.parse(user.x10TaskNumbers || '[]')
      : (user.x10TaskNumbers || [])
    const isX10DatabaseOverride = x10List.includes(Number(currentTaskNumber))

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1

    let totalPrice = 0
    let totalProfit = 0
    const enrichedProducts = []

    userTaskProducts.forEach(ut => {
      const pPrice = parseFloat(ut.price || 0)
      
      const fileProfitPercent = parseFloat(ut.profitPercent)
      const baseRate = !isNaN(fileProfitPercent) ? (fileProfitPercent / 100) : config.profit
      const bonus = isX10DatabaseOverride ? 10 : (Number(ut.bonusMultiplier) || 1)

      const activeProfitRate = baseRate * bonus
      const pProfit = parseFloat((pPrice * activeProfitRate).toFixed(2))

      totalPrice += pPrice
      totalProfit += pProfit

      const pid = ut.productId || ut.id || ut.photoId || 0 

      enrichedProducts.push({
        productId: pid,
        taskOrder: ut.taskOrder || currentTaskNumber || ut.id,
        price: pPrice,
        name: ut.name || `Product ${pid}`,
        profit: pProfit,
        image: ut.image || `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${pid}.jpg` 
      })
    })

    const totalReserve = parseFloat((totalPrice + totalProfit).toFixed(2))

    const activePendingTaskCard = await prisma.task.findFirst({
      where: {
        userId: userId,
        status: 'pending',
        setNumber: currentSet
      },
      orderBy: { createdAt: 'desc' }
    })

    let completedArr = []
    if (user.completedProducts) {
      completedArr = typeof user.completedProducts === 'string'
        ? JSON.parse(user.completedProducts || '[]')
        : user.completedProducts
    }

    const updatedCompletedProducts = [...completedArr, ...enrichedProducts]

    // Calculate progression markers cleanly
    let tasksInCurrentSet = Number(user.tasksInCurrentSet || 0)
    let nextTasksInCurrentSet = tasksInCurrentSet + 1
    let nextSet = currentSet
    
    // 🎯 CYCLE FINISH ROUTINE CHECK: If user completes their final set boundaries, advance cleanly
    if (nextTasksInCurrentSet >= config.tasksPerSet) {
      nextTasksInCurrentSet = 0 // Reset progress to 0 for the fresh set loop step
      nextSet = currentSet < config.totalSets ? currentSet + 1 : 1
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // 🎯 MATH MECHANIC: Moves exact funds out of hold right into the balance arrays seamlessly!
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: totalReserve },
          holdAmount: { decrement: totalReserve }, // Wipes out hold parameter weights smoothly
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: '[]',
          activeProducts: '[]',
          completedProducts: JSON.stringify(updatedCompletedProducts),
          taskCompleted: { increment: 1 },
          
          // 🎯 FIXED: Sequential counters advance cleanly only after verification checks pass
          tasksInCurrentSet: nextTasksInCurrentSet,
          currentSet: nextSet
        }
      })

      if (activePendingTaskCard) {
        await tx.task.update({
          where: { id: activePendingTaskCard.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            products: JSON.stringify(enrichedProducts)
          }
        })
      } else {
        await tx.task.create({
          data: {
            userId,
            status: 'completed',
            vipLevel: user.vipLevel,
            day: currentDay, 
            setNumber: currentSet,
            progress: `D${currentDay} S${currentSet} T${currentTaskNumber}/${config.tasksPerSet}`,
            products: JSON.stringify(enrichedProducts),
            taskCode: `T${Date.now()}${userId.slice(-4)}`,
            completedAt: new Date()
          }
        })
      }

      return await tx.user.findUnique({ where: { id: userId } })
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error("Submission operational failure:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
