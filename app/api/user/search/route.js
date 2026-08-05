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
        setsCompleted: true, // FIX: was currentSet
        tasksInCurrentSet: true, // FIX: added this
        taskCompleted: true, 
        totalTasks: true,
        walletBalance: true, // FIX: was totalBalance
        holdAmount: true, // added for admin panel
        specialBonus: true,
        bonus: true, // added for admin panel
        creditScore: true,
        currentTaskProducts: true,
        activeProducts: true,
        createdAt: true
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user })
  } catch (e) {
    console.error('API /user/search error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) // return real error for debugging
  }
}