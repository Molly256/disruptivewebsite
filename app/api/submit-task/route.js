import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const taskProducts = user.currentTaskProducts
    if (!taskProducts || taskProducts.length === 0) return NextResponse.json({ error: 'No active task' }, { status: 400 })

    const totalRequiredHold = taskProducts.reduce((sum, p) => sum + p.reserveAmount, 0)

    // LOCK: must deposit until hold is 100% full
    if (Math.abs(user.holdAmount - totalRequiredHold) > 0.01) {
      const stillNeed = (totalRequiredHold - user.holdAmount).toFixed(2)
      return NextResponse.json({ error: `Hold amount not complete. Deposit $${stillNeed} more.` }, { status: 400 })
    }

    const payout = totalRequiredHold // capital + profit for all merged products

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalBalance: { increment: payout }, // pay capital + profit
        holdAmount: 0, // clear hold
        currentTaskProducts: [], // clear current task
        completedProducts: [...user.completedProducts,...taskProducts], // move to history
        activeProducts: [] // clear because we submitted
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}