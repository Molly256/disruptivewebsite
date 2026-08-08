import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { txId, adminId } = await req.json()
    if (!txId || !adminId) return NextResponse.json({ error: 'txId, adminId required' }, { status: 400 })

    const tx = await prisma.transaction.findUnique({ where: { id: txId }, include: { user: true } })
    if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    if (tx.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 400 })

    // Mark completed
    await prisma.transaction.update({ where: { id: txId }, data: { status: 'completed' } })

    // Reset freezeAmount: remove this amount from freeze
    await prisma.user.update({ 
      where: { id: tx.userId }, 
      data: { freezeAmount: { decrement: tx.amount } }
    })

    await prisma.adminLog.create({ 
      data: { adminId, action: `Confirmed withdraw $${tx.amount.toFixed(2)} for ${tx.user.username}` }
    })

    return NextResponse.json({ success: true })
  } catch (e) { 
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}