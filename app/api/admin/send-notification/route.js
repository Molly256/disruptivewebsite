import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, message, adminId } = await req.json()
    await prisma.notification.create({ data: { userId, message, isRead: false } })
    await prisma.adminLog.create({ data: { adminId, action: `Sent notification to ${userId}` }})
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}