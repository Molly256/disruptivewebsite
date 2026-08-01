import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, vipSet, photoIds, adminId } = await req.json()
    if (!userId || !vipSet || !photoIds?.length) 
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })

    // 1. Save merge record so we know which images were grouped
    await prisma.taskMerge.create({
      data: { userId, vipSet, photoIds }
    })

    // 2. Add these photos to user's current tasks
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        currentTaskProducts: { push: photoIds }, // FIXED: was mergedTasks
        taskCompleted: { increment: 1 } // 1 merged group = 1 task count
      }
    })

    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Merged ${photoIds.length} images for ${user.username} in ${vipSet}` 
      }
    })
    
    return NextResponse.json({ success: true, newTasks: user.currentTaskProducts })
  } catch (e) { 
    console.error('Merge error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}