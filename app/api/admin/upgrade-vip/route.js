export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, newVipLevel, totalTasks, adminId } = await req.json()
    
    if(!userId || !newVipLevel || !adminId) 
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const vipLevel = Number(newVipLevel)
    const tasks = Number(totalTasks) || 40

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

    await prisma.adminLog.create({ 
      data: { 
        adminId: String(adminId), 
        action: `Upgraded ${user.username} to VIP${vipLevel}`,
        targetUserId: String(userId),
        details: { newVipLevel: vipLevel, totalTasks: tasks }
      }
    }).catch(()=>{})

    return NextResponse.json({ success: true, user })
  } catch (e) { 
    console.error('upgrade-vip error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}