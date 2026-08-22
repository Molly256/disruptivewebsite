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

    // Get activeProducts (admin per-user edit)
    let activeProducts = []
    try {
      activeProducts = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts || '[]') : (user.activeProducts || [])
    } catch { activeProducts = [] }

    // 1. ALWAYS get full history for Records page - this is the fix
    const allTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // 2. Also get current pending for starting page
    const pendingTasks = allTasks.filter(t => String(t.status).toLowerCase() === 'pending' && t.day === currentDay && t.setNumber === currentSet)

    // Determine products to show in starting page
    let products = []
    if (activeProducts.length > 0) {
      products = activeProducts
    } else if (pendingTasks.length > 0) {
      try {
        products = typeof pendingTasks[0].products === 'string'? JSON.parse(pendingTasks[0].products || '[]') : (pendingTasks[0].products || [])
      } catch { products = [] }
    }

    return NextResponse.json({
      success: true,
      tasks: allTasks, // <-- ALWAYS return ALL tasks, not just pending
      currentDay,
      currentSet,
      products
    })

  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}