import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 },
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!user.currentTaskProducts || user.currentTaskProducts.length === 0) {
      return NextResponse.json({ error: 'No active task to submit' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel]
    const currentSet = (user.setsCompleted || 0) + 1

    let totalPrice = 0
    let totalProfit = 0
    let totalReserve = 0

    user.currentTaskProducts.forEach(p => {
      totalPrice += p.price
      totalProfit += p.profit || (p.price * config.profit)
      totalReserve += p.reserveAmount || (p.price + (p.price * config.profit))
    })

    // 1. Release hold: add price + profit back to wallet
    // 2. Reset hold to 0.00
    const newWallet = parseFloat((user.walletBalance + totalPrice + totalProfit).toFixed(2))
    const newHold = 0.00

    // Check if set completed
    const newTasksInSet = user.tasksInCurrentSet
    let newSetsCompleted = user.setsCompleted || 0
    let finalTasksInSet = newTasksInSet

    if (newTasksInSet >= config.tasksPerSet) {
      newSetsCompleted = (user.setsCompleted || 0) + 1
      finalTasksInSet = 0 // reset for next set
    }

    // Mark task as completed
    await prisma.task.updateMany({
      where: { userId: userId, status: 'pending' },
      data: { status: 'completed' }
    })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: newWallet,
        holdAmount: newHold, // RESET HOLD TO 0
        currentTaskProducts: [],
        todayProfit: (user.todayProfit || 0) + totalProfit,
        tasksInCurrentSet: finalTasksInSet,
        setsCompleted: newSetsCompleted,
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error('submit-task error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}