import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, newVipLevel, totalTasks, adminId } = await req.json()
    const user = await prisma.user.update({
      where: { id: userId },
      data: { vipLevel: newVipLevel, totalTasks, taskCompleted: 0, currentSet: 1, setCompleted: 0 }
    })
    await prisma.adminLog.create({ data: { adminId, action: `Upgraded ${user.username} to VIP${newVipLevel}` }})
    return NextResponse.json({ user })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}