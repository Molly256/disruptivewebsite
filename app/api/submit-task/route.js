export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 },
 2: { tasksPerSet: 60, totalSets: 2, profit: 0.01 },
 3: { tasksPerSet: 80, totalSets: 2, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 2, profit: 0.02 },
 5: { tasksPerSet: 120, totalSets: 2, profit: 0.025 },
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const taskProducts = user.currentTaskProducts || []
    if (taskProducts.length === 0) return NextResponse.json({ error: 'No active task' }, { status: 400 })

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const profitRate = config.profit

    const totalPrice = taskProducts.reduce((sum, p) => sum + (p.price || 0), 0)
    const totalProfit = taskProducts.reduce((sum, p) => sum + (p.profit || (p.price * profitRate)), 0)
    const totalReserve = totalPrice + totalProfit

    const pendingTask = await prisma.task.findFirst({
      where: { userId: userId, status: 'pending' },
      orderBy: { createdAt: 'desc' }
    })

    const currentIndex = user.tasksInCurrentSet || 0
    const nextTaskCount = currentIndex + 1
    const isSetComplete = nextTaskCount >= config.tasksPerSet

    const tx = [
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: currentIndex }, // ATOMIC LOCK: prevents skip
        data: {
          walletBalance: { increment: totalReserve }, // return price + profit
          holdAmount: 0.00, // FIX: Force reset to 0.00
          todayProfit: { increment: totalProfit },
          currentTaskProducts: [],
          completedProducts: [...(user.completedProducts || []),...taskProducts],
          activeProducts: [],
          tasksInCurrentSet: isSetComplete? 0 : nextTaskCount,
          setsCompleted: isSetComplete? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: 1 },
          vipLevel: user.vipLevel,
          vipId: user.vipId
        }
      })
    ]

    if(pendingTask) {
      tx.push(prisma.task.update({
        where: { id: pendingTask.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          totalPrice: totalPrice,
          totalProfit: totalProfit
        }
      }))
    } else {
      tx.push(prisma.task.create({
        data: {
          userId,
          status: 'completed',
          vipLevel: user.vipLevel,
          setNumber: (user.setsCompleted || 0) + 1,
          progress: `${nextTaskCount}/${config.tasksPerSet}`,
          productId: taskProducts[0]?.id || 0,
          price: taskProducts[0]?.price || 0,
          totalPrice,
          totalProfit,
          completedAt: new Date(),
          taskCode: `T${Date.now()}${userId.slice(-4)}`
        }
      }))
    }

    await prisma.$transaction(tx)
    const finalUser = await prisma.user.findUnique({ where: { id: userId } })

    return NextResponse.json({ success: true, user: finalUser, message: 'Task Completed! Payout Received' })
  } catch (err) {
    console.error('submit-task error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}