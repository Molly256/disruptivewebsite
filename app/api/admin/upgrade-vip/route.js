export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VIP_TASKS = { 1: 40, 2: 45, 3: 50, 4: 55, 5: 60 }

export async function POST(req) {
  try {
    const { userId, newVipLevel, adminId } = await req.json()
    if(!userId ||!newVipLevel ||!adminId)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const vipLevel = Number(newVipLevel)
    const tasks = VIP_TASKS[vipLevel]
    if(!tasks) return NextResponse.json({ error: 'VIP not exist' }, { status: 400 })

    const today = new Date()
    today.setHours(0,0,0,0)
    await prisma.task.deleteMany({
      where: { userId: String(userId), createdAt: { gte: today } }
    }).catch(()=>{})

    const user = await prisma.user.update({
      where: { id: String(userId) },
      data: {
        vipLevel: vipLevel,
        vipId: vipLevel,
        totalTasks: tasks,
        tasksInCurrentSet: 0,
        taskCompleted: 0,
        currentSet: 1,
        currentDay: 1,
        currentTaskProducts: [],
        activeProducts: [],
        completedProducts: [],
        x10TaskNumbers: []
      }
    })

    return NextResponse.json({ success: true, user, totalTasks: tasks })
  } catch (e) {
    console.error('upgrade-vip error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}