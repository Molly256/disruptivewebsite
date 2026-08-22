export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        type: { in: ['withdraw', 'withdrawal'] },
        status: { in: ['pending', 'PENDING'] }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            phone: true,
            walletBalance: true,
            boundWallet: true
          }
        }
      }
    })

    const normalized = transactions.map(tx => ({
      ...tx,
      status: tx.status.toLowerCase(),
      type: 'withdraw'
    }))

    return NextResponse.json({ transactions: normalized })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}