import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, vipSet, photoTaskOrders, adminId } = await req.json()

    if(!userId ||!vipSet ||!photoTaskOrders || photoTaskOrders.length < 2) {
      return NextResponse.json({ error: 'Select at least 2 photos' }, { status: 400 })
    }

    const pairs = photoTaskOrders.map(taskOrder => ({ taskOrder }))

    // 1. Save to TaskMerge
    await prisma.taskMerge.create({ data: { userId, vipSet, pairs } })

    // 2. Update User so user can do it
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentTaskProducts: pairs,
        activeProducts: pairs
      }
    })

    // 3. Admin Log - FIXED: use connect
    await prisma.adminLog.create({
      data: { 
        action: `Merged ${pairs.length} photos for ${vipSet}`,
        admin: { connect: { id: adminId } },
        user: { connect: { id: userId } }
      }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Merge error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}