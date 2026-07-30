import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { adminPhone, target, newPass } = await req.json()

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    await prisma.user.updateMany({
      where: { OR: [{ username: target }, { phone: target }] },
      data: { loginPassword: newPass } // plain text as you requested
    })

    return NextResponse.json({ success: true, message: 'Password reset' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}