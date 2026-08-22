export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { txId } = await req.json()
    if (!txId) return NextResponse.json({ error: 'Missing txId' }, { status: 400 })

    const tx = await prisma.transaction.findUnique({ where: { id: String(txId) } })
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

    if (tx.status.toLowerCase() !== 'pending') {
      return NextResponse.json({ error: 'Already processed' }, { status: 400 })
    }

    await prisma.$transaction(async (p) => {
      await p.transaction.update({
        where: { id: String(txId) },
        data: { status: 'rejected' }
      })

      // On reject: return money to balance and remove freeze
      await p.user.update({
        where: { id: String(tx.userId) },
        data: {
          walletBalance: { increment: Number(tx.amount) },
          freezeAmount: { decrement: Number(tx.amount) }
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('reject error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}