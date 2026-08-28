import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function withRetry(fn, tries = 3) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      if (e.message?.includes("Can't reach database server") && i < tries - 1) {
        await new Promise(r => setTimeout(r, 1200))
        continue
      }
      throw e
    }
  }
  throw lastErr
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await withRetry(() => prisma.user.findUnique({ where: { id: userId } }))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1

    let activeProducts = []
    try {
      activeProducts = typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts || '[]') : (user.activeProducts || [])
    } catch { activeProducts = [] }

    const allTasks = await withRetry(() => prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    }))

    const pendingTasks = allTasks.filter(t => String(t.status).toLowerCase() === 'pending' && t.day === currentDay && t.setNumber === currentSet)

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
      tasks: allTasks,
      currentDay,
      currentSet,
      products
    })

  } catch (err) {
    console.error('get tasks error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}