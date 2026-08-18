import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1

    // 1. Get active pending task for current Day + Set
    const activeTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'pending',
        day: currentDay, // FIX 1: ADD THIS
        setNumber: currentSet
      },
      orderBy: { createdAt: 'desc' }
    })

    if (activeTasks.length > 0) {
      const firstActiveCard = activeTasks[0]
      const productsArraySnapshot = typeof firstActiveCard.products === 'string'
      ? JSON.parse(firstActiveCard.products || '[]')
        : (firstActiveCard.products || [])

      return NextResponse.json({
        success: true,
        tasks: activeTasks,
        currentDay,
        currentSet,
        products: productsArraySnapshot
      })
    }

    // 2. Fallback: Get all completed tasks for history
    const historicTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      tasks: historicTasks,
      currentDay, // FIX 2: ADD THIS for frontend
      currentSet
    })
  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}