import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, vipSet, photoTaskOrders, adminId } = await req.json()

    if (!userId || !vipSet || !photoTaskOrders || photoTaskOrders.length < 2) {
      return NextResponse.json({ error: 'Select at least 2 photos' }, { status: 400 })
    }

    const pairs = photoTaskOrders.map(orderNum => {
      const num = parseInt(orderNum);
      return { photoId: num, dataId: num, taskOrder: num }
    })

    await prisma.taskMerge.updateMany({
      where: { userId, vipSet, status: 'active' },
      data: { status: 'used' }
    })

    await prisma.taskMerge.create({
      data: {
        userId,
        vipSet: vipSet.toLowerCase(),
        pairs: pairs, 
        status: 'active'
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentTaskProducts: pairs,
        activeProducts: pairs
      }
    })

    if (adminId) {
      await prisma.adminLog.create({
        data: {
          adminId: adminId, 
          action: `Merged ${pairs.length} tasks in ${vipSet} for User ID: ${userId}`
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Merge tracking failed:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
