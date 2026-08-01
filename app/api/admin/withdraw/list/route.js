import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: 'Withdraw', status: 'pending' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ transactions })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}