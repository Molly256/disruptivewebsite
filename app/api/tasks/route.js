import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1

    // 1. Always check user.activeProducts first - this holds admin per-user edit for current task
    let activeProducts = []
    try {
      activeProducts = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts || '[]') : (user.activeProducts || [])
    } catch { activeProducts = [] }

    const pendingTasks = await prisma.task.findMany({
      where: { userId, status: 'pending', day: currentDay, setNumber: currentSet },
      orderBy: { createdAt: 'desc' }
    })

    if (activeProducts.length > 0) {
      return NextResponse.json({
        success: true,
        tasks: pendingTasks.length? pendingTasks : [],
        currentDay,
        currentSet,
        products: activeProducts
      })
    }

    if (pendingTasks.length > 0) {
      const prods = typeof pendingTasks[0].products === 'string'? JSON.parse(pendingTasks[0].products || '[]') : (pendingTasks[0].products || [])
      return NextResponse.json({
        success: true,
        tasks: pendingTasks,
        currentDay,
        currentSet,
        products: prods
      })
    }

    // 2. History
    const historicTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, tasks: historicTasks, currentDay, currentSet })
  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}