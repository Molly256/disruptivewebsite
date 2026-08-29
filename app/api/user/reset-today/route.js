import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const updated = await prisma.user.update({
      where: { id: String(userId) },
      data: {
        todayProfit: 0,
        lastProfitReset: new Date()
      }
    })

    return NextResponse.json({ user: updated })
  } catch (e) {
    console.error('reset-today', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}