import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, vipSet, photoTaskOrders, adminId } = await req.json()
    // photoTaskOrders: [1,2,3]

    if(!userId ||!vipSet ||!photoTaskOrders || photoTaskOrders.length < 2) {
      return NextResponse.json({ error: 'Select at least 2 photos' }, { status: 400 })
    }

    const pairs = photoTaskOrders.map(taskOrder => ({ taskOrder }))

    // 1. Save to TaskMerge
    await prisma.taskMerge.create({ data: { userId, vipSet, pairs } })

    // 2. Update User.mergedTasks + currentTaskProducts so user can do it
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const mergedTasks = user.mergedTasks || []
    mergedTasks.push({ vipSet, pairs, createdAt: new Date() })

    await prisma.user.update({
      where: { id: userId },
      data: {
        mergedTasks,
        currentTaskProducts: pairs, // this makes user see the merged task
        activeProducts: pairs
      }
    })

    // 3. Admin Log
    await prisma.adminLog.create({
      data: { adminId, action: `Merged ${pairs.length} photos for ${vipSet}`, userId }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}