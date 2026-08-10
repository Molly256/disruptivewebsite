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

    const currentSetNumber = (user.setsCompleted || 0) + 1

    // 2. CHECK IF THERE ARE ANY ACTIVE PENDING TASKS FOR THIS SET
    // 🎯 THE FIX: Removed the progress string lock so it successfully catches "5-6/40" or "5/40" alike!
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
      // 🎯 THE FIX: Read the inner JSON array bundle snapshot of the active card row
      const firstActiveCard = activeTasks[0]
      const productsArraySnapshot = typeof firstActiveCard.products === 'string'
        ? JSON.parse(firstActiveCard.products || '[]')
        : (firstActiveCard.products || [])

      return NextResponse.json({ 
        success: true, 
        tasks: activeTasks,
        // 🎯 Properly flags as a merged task bundle if the inner JSON contains multiple items!
        isMerged: productsArraySnapshot.length > 1 
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
