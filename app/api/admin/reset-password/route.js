import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, newPassword, adminId } = await req.json()
    const user = await prisma.user.update({ where: { id: userId }, data: { password: newPassword } })
    await prisma.adminLog.create({ data: { adminId, action: `Reset password for ${user.username}` }})
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}