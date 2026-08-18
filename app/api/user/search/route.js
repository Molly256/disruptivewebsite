export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 })

    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { id: q },
          { username: { equals: q, mode: 'insensitive' } },
          { phone: q }
        ] 
      },
      select: { 
        id: true, 
        username: true, 
        phone: true, 
        countryName: true, 
        gender: true, 
        vipLevel: true, 
        vipId: true,
        currentDay: true,          
        currentSet: true,
        // setsCompleted: true,  // REMOVED - doesn't exist on User model
        tasksInCurrentSet: true,
        taskCompleted: true, 
        totalTasks: true,
        walletBalance: true,
        holdAmount: true,
        freezeAmount: true,
        bonus: true,
        specialBonus: true,
        creditScore: true,
        currentTaskProducts: true,
        activeProducts: true,
        completedProducts: true,
        mergedTasks: true,
        createdAt: true,
        lastProfitReset: true,
        todayProfit: true,
        x10TaskNumbers: true,
        boundWallet: true
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Add aliases so your admin panel code using user.day / user.setNumber won't break
    const userWithAlias = {
      ...user,
      day: user.currentDay,       // alias for photo path
      setNumber: user.currentSet, // alias for setSize
      setsCompleted: 0            // add default so frontend doesn't crash
    }

    return NextResponse.json({ user: userWithAlias })
  } catch (e) {
    console.error('API /user/search error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}