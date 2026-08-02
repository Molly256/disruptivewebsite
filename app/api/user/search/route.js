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
          { username: { equals: q, mode: 'insensitive' } }, // FIX 1: case insensitive
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
        currentSet: true, 
        taskCompleted: true, 
        totalTasks: true,
        totalBalance: true, // FIX 2: needed for Deposit/Upgrade block
        specialBonus: true  // FIX 3: needed for Lucky Bonus block
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user })
  } catch (e) {
    console.error('API /user/search error:', e)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}