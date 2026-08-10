import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    // 🎯 THE FIX: Destructure the new 'pairs' payload variable containing names/prices directly from the frontend request body
    const { userId, vipSet, pairs, adminId } = await req.json()

    // 🎯 THE FIX: Re-targeted validation parameter filters onto the incoming data array metrics
    if (!userId || !vipSet || !pairs || pairs.length < 2) {
      return NextResponse.json({ error: 'Select at least 2 photos' }, { status: 400 })
    }

    // Deactivate previous active merges for this specific folder loop segment safely
    await prisma.taskMerge.updateMany({
      where: { userId, vipSet, status: 'active' },
      data: { status: 'used' }
    })

    // Save the fully populated pairs list directly into the database row columns
    await prisma.taskMerge.create({
      data: {
        userId,
        vipSet: vipSet.toLowerCase(),
        pairs: pairs, // Saves [{photoId: 4, dataId: 4, name: '...', price: 44.99}, ...]
        status: 'active'
      }
    })

    // ❌ REMOVED: Bypassed updating currentTaskProducts here completely.
    // The user's page will initialize these columns directly when they load and trigger the start-task route endpoint pipeline!

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
