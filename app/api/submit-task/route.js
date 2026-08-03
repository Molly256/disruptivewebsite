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

    const taskProducts = user.currentTaskProducts
    if (!taskProducts || taskProducts.length === 0) return NextResponse.json({ error: 'No active task' }, { status: 400 })

    const config = VIP_CONFIG[user.vipLevel]
    if(!config) return NextResponse.json({ error: 'VIP not configured' }, { status: 400 })

    const { tasksPerSet } = config
    const tasksInSet = user.tasksInCurrentSet || 0
    const setsCompleted = user.setsCompleted || 0

    // LOCK: set already full, waiting admin
    if(tasksInSet >= tasksPerSet) {
      return NextResponse.json({ error: 'Set completed. Waiting for admin reset.' }, { status: 400 })
    }

    const totalRequiredHold = taskProducts.reduce((sum, p) => sum + p.reserveAmount, 0)

    // LOCK: must deposit until hold is 100% full
    if (Math.abs(user.holdAmount - totalRequiredHold) > 0.01) {
      const stillNeed = (totalRequiredHold - user.holdAmount).toFixed(2)
      return NextResponse.json({ error: `Hold amount not complete. Deposit $${stillNeed} more.` }, { status: 400 })
    }

    const payout = totalRequiredHold // capital + profit for all merged products
    const totalProfit = taskProducts.reduce((sum, p) => sum + p.profit, 0)
    const newTasksInSet = tasksInSet + 1

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: { increment: payout }, 
        holdAmount: 0, // clear hold
        todayProfit: { increment: totalProfit },
        currentTaskProducts: [], // clear current task
        completedProducts: [...user.completedProducts,...taskProducts], // move to history
        activeProducts: [], // clear because we submitted
        taskCompleted: { increment: 1 }, // keep for total history
        tasksInCurrentSet: newTasksInSet // KEY: this moves 0/40 -> 1/40
        // NOTE: setsCompleted does NOT change here. Only admin changes it
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}