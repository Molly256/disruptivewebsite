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

    const totalReserve = taskProducts.reduce((sum, p) => sum + p.reserveAmount, 0) // price + profit
    const totalProfit = taskProducts.reduce((sum, p) => sum + p.profit, 0)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: { increment: totalReserve }, // return capital + profit
        holdAmount: { decrement: totalReserve }, // remove from hold
        todayProfit: { increment: totalProfit },
        currentTaskProducts: [],
        completedProducts: [...user.completedProducts,...taskProducts],
        activeProducts: [],
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}