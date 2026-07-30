import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { adminPhone, target, amount } = await req.json()

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const user = await prisma.user.findFirst({ where: { OR: [{ username: target }, { phone: target }] } })

    // 1. Add to balance
    await prisma.user.update({
      where: { id: user.id },
      data: { totalBalance: { increment: parseFloat(amount) } }
    })

    // 2. Create transaction history
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'deposit',
        amount: parseFloat(amount),
        status: 'success'
      }
    })

    return NextResponse.json({ success: true, message: 'Deposit successful' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}