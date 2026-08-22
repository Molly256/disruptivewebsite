export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { txId } = await req.json()
    if (!txId) return NextResponse.json({ error: 'Missing txId' }, { status: 400 })

    const tx = await prisma.transaction.findUnique({ where: { id: String(txId) } })
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

    if (String(tx.status).toLowerCase() !== 'pending') {
      return NextResponse.json({ error: 'Already processed: ' + tx.status }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: String(tx.userId) } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.$transaction(async (p) => {
      await p.transaction.update({
        where: { id: String(txId) },
        data: { status: 'completed' }
      })

      // SAFE: handle null freezeAmount
      const currentFreeze = Number(user.freezeAmount || 0)
      const amount = Number(tx.amount)
      const newFreeze = Math.max(0, currentFreeze - amount)

      await p.user.update({
        where: { id: String(tx.userId) },
        data: { freezeAmount: newFreeze }
      })
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('approve error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}