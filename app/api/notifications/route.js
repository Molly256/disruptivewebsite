export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ notifications })
  } catch (e) {
    console.error('API /notifications GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}