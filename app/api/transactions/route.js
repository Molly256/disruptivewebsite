export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'withdraw' | 'deposit' | 'special_bonus' | 'all'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const where = { userId: String(userId) }

    // filter by type if not 'all'
    if (type && type!== 'all') {
      where.type = type
    } else {
      // default: only show deposit, withdraw, special_bonus for history page
      where.type = { in: ['deposit', 'withdraw', 'special_bonus'] }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true, // 'withdraw', 'deposit', 'special_bonus'
        amount: true,
        status: true, // 'pending', 'completed', 'rejected'
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ transactions })
  } catch (e) {
    console.error('API /transactions error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}