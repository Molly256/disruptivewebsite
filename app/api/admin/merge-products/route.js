import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, vipSet, pairs, adminId } = await req.json()
    // pairs: [{photoId, dataId, taskOrder}]

    if(!userId ||!vipSet ||!pairs || pairs.length === 0) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Save to TaskMerge table
    await prisma.taskMerge.create({
      data: { userId, vipSet, pairs }
    })

    // 2. Also save to User.mergedTasks Json field for quick access
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const mergedTasks = user.mergedTasks || []
    mergedTasks.push({ vipSet, pairs, createdAt: new Date() })

    await prisma.user.update({
      where: { id: userId },
      data: { mergedTasks }
    })

    // 3. Admin Log
    await prisma.adminLog.create({
      data: { adminId, action: `Merged ${pairs.length} tasks for user ${userId} in ${vipSet}` }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}