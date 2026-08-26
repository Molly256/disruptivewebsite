export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const where = { userId: String(userId) }

    if (type && type!== 'all') {
      where.type = type === 'withdraw'? 'withdrawal' : type
    } else {
      // INCLUDE referral_bonus now
      where.type = { in: ['deposit', 'withdrawal', 'special_bonus', 'referral_bonus', 'referral_reward'] }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    const txWithFixedType = transactions.map(tx => ({
     ...tx,
      type: tx.type === 'withdrawal'? 'withdraw' : tx.type,
      status: tx.status === 'success'? 'completed' : tx.status
    }))

    return NextResponse.json({ transactions: txWithFixedType })
  } catch (e) {
    console.error('API /transactions error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}