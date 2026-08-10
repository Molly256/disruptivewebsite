import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = { 
  1: { tasksPerSet: 40 },
  2: { tasksPerSet: 60 },
  3: { tasksPerSet: 80 },
  4: { tasksPerSet: 100 },
  5: { tasksPerSet: 120 }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // 1. Fetch user data to check progress level and active sets
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentSetNumber = (user.setsCompleted || 0) + 1
    
    // 🎯 THE DISPLAY TEXT FIX: Calculates current task number string dynamically based on active VIP config limits
    const currentTaskNum = (user.tasksInCurrentSet || 0) + 1
    const progressLabelString = `${currentTaskNum}/${config.tasksPerSet}`

    // 2. CHECK IF THERE ARE MULTIPLE PENDING TASKS FOR THIS EXACT STEP STEP (MERGED)
    // 🎯 THE FILTER FIX: Explicitly checks progress string matching 'index + 1' label boundaries 
    // to keep old historic steps from leaking into your current combo card layout loop!
    const activeTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'pending',
        setNumber: currentSetNumber,
        progress: progressLabelString
      },
      orderBy: { createdAt: 'desc' }
    })

    // If we have active pending database entries, send them immediately to the frontend
    if (activeTasks.length > 0) {
      return NextResponse.json({ 
        success: true, 
        tasks: activeTasks,
        isMerged: activeTasks.length > 1 
      })
    }

    // 3. FALLBACK: If no active pending tasks exist, pull their historic completion records log
    const historicTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, tasks: historicTasks })
  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
