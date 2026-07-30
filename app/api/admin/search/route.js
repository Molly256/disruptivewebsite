import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { adminPhone, target } = await req.json()

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: target }, { phone: target }] }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { loginPassword, transactionPassword,...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}