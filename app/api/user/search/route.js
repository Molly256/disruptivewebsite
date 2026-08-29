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
        createdAt: true,
        lastProfitReset: true,
        todayProfit: true,
        x10TaskNumbers: true,
        boundWallet: true
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Normalize currentTaskProducts into a guaranteed clean array structure 
    let formattedProducts = user.currentTaskProducts;
    if (typeof formattedProducts === 'string') {
      try { formattedProducts = JSON.parse(formattedProducts) } catch { formattedProducts = [] }
    }
    if (!Array.isArray(formattedProducts)) formattedProducts = [];

    // Provide absolute consistency for both schemas to prevent frontend state mapping drops
    const userWithAlias = {
      ...user,
      currentTaskProducts: formattedProducts,
      day: user.currentDay || 1,       
      currentDay: user.currentDay || 1,
      setNumber: user.currentSet || 1, 
      currentSet: user.currentSet || 1,
      setsCompleted: 0            
    }

    return NextResponse.json({ user: userWithAlias })
  } catch (e) {
    console.error('API /user/search error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
