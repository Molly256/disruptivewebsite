import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { txId, adminId } = await req.json()
    const tx = await prisma.transaction.update({ where: { id: txId }, data: { status: 'success' }})
    await prisma.adminLog.create({ data: { adminId, action: `Confirmed withdraw $${tx.amount}` }})
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}