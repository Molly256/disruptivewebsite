export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VIP_TASKS = {
  1: 40,
  2: 45,
  3: 50,
  4: 55,
  5: 60,
}

export async function POST(req) {
  try {
    const { userId, newVipLevel, adminId } = await req.json()

    if(!userId ||!newVipLevel ||!adminId)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const vipLevel = Number(newVipLevel)
    const tasks = VIP_TASKS[vipLevel]

    if(!tasks) return NextResponse.json({ error: 'VIP not exist, only 1-5' }, { status: 400 })

    const user = await prisma.user.update({
      where: { id: String(userId) },
      data: {
        vipLevel: vipLevel,
        vipId: vipLevel,
        totalTasks: tasks, // VIP1=40, VIP2=45
        tasksInCurrentSet: 0, // so UI shows 1/45
        taskCompleted: 0,
        currentSet: 1, // Day1 Set1
        currentDay: 1,
        currentTaskProducts: [],
        activeProducts: [],
        completedProducts: [],
        x10TaskNumbers: []
      }
    })

    // delete today's tasks so start-task will create 45 with correct profit
    const today = new Date()
    today.setHours(0,0,0,0)
    await prisma.task.deleteMany({
      where: { userId: String(userId), createdAt: { gte: today } }
    }).catch(()=>{})
    await prisma.dailyTask.deleteMany({
      where: { userId: String(userId), createdAt: { gte: today } }
    }).catch(()=>{})

    await prisma.adminLog.create({
      data: {
        adminId: String(adminId),
        action: `Upgraded ${user.username} to VIP${vipLevel}`,
        targetUserId: String(userId),
        details: { newVipLevel: vipLevel, totalTasks: tasks }
      }
    }).catch(()=>{})

    return NextResponse.json({ success: true, user, totalTasks: tasks })
  } catch (e) {
    console.error('upgrade-vip error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}