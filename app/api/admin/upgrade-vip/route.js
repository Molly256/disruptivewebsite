import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, newVipLevel, totalTasks, adminId } = await req.json()
    
    if(!userId || !newVipLevel || !adminId) 
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        vipLevel: newVipLevel, 
        totalTasks, 
        tasksInCurrentSet: 0, // FIX 1: use same field name as rest of app
        currentSet: 1, 
        currentDay: 1,        // FIX 2: reset day too
        completedSetsToday: 0 // FIX 3: reset daily counter
      }
    })

    await prisma.adminLog.create({ 
      data: { adminId, action: `Upgraded ${user.username} to VIP${newVipLevel}` }
    })

    return NextResponse.json({ success: true, user }) // FIX 4: add success
  } catch (e) { 
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}