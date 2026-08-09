export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const currentSetNumber = (user.setsCompleted || 0) + 1
    const progressLabel = `${user.tasksInCurrentSet}/40`

    // 2. CHECK IF THERE ARE MULTIPLE PENDING TASKS FOR THIS STEP (MERGED)
    const activeTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'pending',
        setNumber: currentSetNumber
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
