import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { adminPhone, id, action } = await req.json() // action = 'success' or 'rejected'

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const tx = await prisma.transaction.update({
      where: { id },
      data: { status: action }
    })

    // if confirmed, deduct from balance
    if(action === 'success') {
      await prisma.user.update({
        where: { id: tx.userId },
        data: { totalBalance: { decrement: tx.amount }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}