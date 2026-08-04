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

    // Prisma cuid is string, so don't parseInt
    const user = await prisma.user.findUnique({
      where: { id: String(id) }, // force to string
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
        totalBalance: true, // your DB column
        holdAmount: true,
        bonus: true,
        specialBonus: true,
        taskCompleted: true,
        currentSet: true,
        totalTasks: true,
        setCompleted: true,
        activeProducts: true,
        completedProducts: true,
        currentTaskProducts: true, 
        mergedTasks: true,
        todayProfit: true, // <-- ADDED
        lastProfitReset: true, // <-- ADDED
        tasksInCurrentSet: true, // <-- ADDED
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ONLY CHANGE: map DB names to what frontend expects
    const fixedUser = {
     ...user,
      walletBalance: user.totalBalance, // <-- FIX BOUNCE: frontend uses walletBalance
      tasksInCurrentSet: user.tasksInCurrentSet ?? user.currentSet ?? 0, // fallback
      todayProfit: user.todayProfit ?? 0,
      lastProfitReset: user.lastProfitReset ?? user.createdAt,
    }

    return NextResponse.json({ user: fixedUser })
  } catch (e) {
    console.error('API /user error:', e)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}