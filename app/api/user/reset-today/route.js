import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req) {
  const { userId } = await req.json()
  await prisma.user.update({
    where: { id: userId },
    data: { todayProfit: 0, lastProfitReset: new Date() }
  })
  return NextResponse.json({ success: true })
}