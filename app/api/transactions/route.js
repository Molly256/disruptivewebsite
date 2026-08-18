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

    // FIX 1: map 'withdraw' to 'withdrawal' so it matches DB
    if (type && type !== 'all') {
      where.type = type === 'withdraw' ? 'withdrawal' : type
    } else {
      // FIX 2: include 'withdrawal' in default list
      where.type = { in: ['deposit', 'withdrawal', 'special_bonus'] }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true, // 'deposit', 'withdrawal', 'special_bonus', 'profit', 'reserve'
        amount: true,
        status: true, // 'pending', 'completed', 'rejected'
        createdAt: true,
        updatedAt: true,
      }
    })

    // FIX 3: convert 'withdrawal' back to 'withdraw' for front
    const txWithFixedType = transactions.map(tx => ({
      ...tx,
      type: tx.type === 'withdrawal' ? 'withdraw' : tx.type,
      status: tx.status === 'success' ? 'completed' : tx.status // map if needed
    }))

    return NextResponse.json({ transactions: txWithFixedType })
  } catch (e) {
    console.error('API /transactions error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}