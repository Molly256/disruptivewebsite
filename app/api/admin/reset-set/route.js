import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
const VIP_TASKS = {1:40,2:45,3:50,4:55,5:60}

export async function POST(req) {
  try {
    const { userId, setTo, adminId } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: userId }})
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { currentSet: setTo, taskCompleted: 0, totalTasks: VIP_TASKS[user.vipLevel], setCompleted: setTo === 2? 1 : 0 }
    })
    await prisma.adminLog.create({ data: { adminId, action: `Reset ${user.username} to Set ${setTo}` }})
    return NextResponse.json({ user: updated })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}