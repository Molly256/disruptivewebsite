export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await prisma.notification.updateMany({
      where: { userId: String(userId), isRead: false }, // FIXED
      data: { isRead: true } // FIXED
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('API /notifications/read error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}