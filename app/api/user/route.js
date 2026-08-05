export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        username: true,
        phone: true,
        countryName: true,
        countryCode: true,
        gender: true,
        inviteCode: true,
        createdAt: true,
        updatedAt: true,
        vipLevel: true,
        walletBalance: true, // FIX: was totalBalance
        holdAmount: true,
        bonus: true,
        specialBonus: true, // <-- STAYS SEPARATE
        taskCompleted: true,
        setsCompleted: true, // FIX: was currentSet
        totalTasks: true,
        activeProducts: true,
        completedProducts: true,
        currentTaskProducts: true, 
        mergedTasks: true,
        todayProfit: true,
        lastProfitReset: true,
        tasksInCurrentSet: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // No mapping needed anymore. Send as-is
    return NextResponse.json({ user })
  } catch (e) {
    console.error('API /user error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}