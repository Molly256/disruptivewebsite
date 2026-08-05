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
    const body = await req.json()
    console.log('submit-task body:', body) // LOG
    
    const { userId } = body
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

    const nextTaskCount = (user.tasksInCurrentSet || 0) + 1
    const isSetComplete = nextTaskCount >= config.tasksPerSet
    const newHoldAmount = Math.max(0, (user.holdAmount || 0) - totalPrice)

    const tx = [
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: totalReserve },
          holdAmount: newHoldAmount,
          todayProfit: { increment: totalProfit },
          currentTaskProducts: [],
          completedProducts: [...(user.completedProducts || []),...taskProducts],
          activeProducts: [],
          tasksInCurrentSet: isSetComplete? 0 : nextTaskCount,
          setsCompleted: isSetComplete? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: 1 }
        }
      })
    ]

    if(pendingTask) {
      tx.push(prisma.task.update({
        where: { id: pendingTask.id },
        data: { status: 'completed', completedAt: new Date(), payoutAmount: totalReserve, profitAmount: totalProfit }
      }))
    } else {
      tx.push(prisma.task.create({
        data: {
          userId, status: 'completed', products: taskProducts,
          totalPrice, totalProfit, totalReserve, payoutAmount: totalReserve, profitAmount: totalProfit, completedAt: new Date()
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