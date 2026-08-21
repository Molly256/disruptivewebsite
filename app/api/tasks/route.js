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

    // 1. Get active pending task row configuration for the current Day + Set session track
    const activeTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'pending',
        day: currentDay,
        setNumber: currentSet
      },
      orderBy: { createdAt: 'desc' }
    })

    if (activeTasks.length > 0) {
      const firstActiveCard = activeTasks[0]
      
      // Parse active snapshots out of task JSON table fields safely without compiling gaps
      const productsArraySnapshot = typeof firstActiveCard.products === 'string'
        ? JSON.parse(firstActiveCard.products || '[]')
        : (firstActiveCard.products || [])

      // Remap image strings dynamically to verify that the frontend displays item assets properly
      const patchedActiveProducts = productsArraySnapshot.map(p => {
        const pid = p.taskOrder || p.productId || p.id || p.photoId || 1
        return {
          ...p,
          id: pid,
          taskOrder: pid,
          image: p.image || `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${pid}.jpg`
        }
      })

      return NextResponse.json({
        success: true,
        tasks: activeTasks,
        currentDay,
        currentSet,
        products: patchedActiveProducts // Returns pristine image array snapshot paths
      })
    }

    // 2. Fallback execution flow path: Return all completed task records for history log components
    const historicTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Patch product tracking configurations inside historic rows to preserve legacy rendering records
    const patchedTasks = historicTasks.map(t => {
      const prods = typeof t.products === 'string' ? JSON.parse(t.products || '[]') : (t.products || [])
      const day = t.day || currentDay
      const set = t.setNumber || currentSet

      const patchedProds = prods.map(p => {
        const pid = p.taskOrder || p.productId || p.id || p.photoId || 1
        return {
          ...p,
          id: pid,
          taskOrder: pid,
          image: p.image || `/vip${t.vipLevel}/day${day}/set${set}/photo${pid}.jpg`
        }
      })

      return { ...t, products: patchedProds }
    })

    return NextResponse.json({
      success: true,
      tasks: patchedTasks, 
      currentDay,
      currentSet
    })
  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
