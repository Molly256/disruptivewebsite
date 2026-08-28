import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, newPassword } = await req.json()
    if (!userId || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const updated = await prisma.user.update({
      where: { id: String(userId) },
      data: { loginPassword: newPassword }
    })

    return NextResponse.json({ success: true, username: updated.username })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}