import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()

    const user = await prisma.user.findUnique({ 
      where: { id: Number(userId) } // FIX 1: Number
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let products = user.currentTaskProducts || []
    if (typeof products === 'string') {
      try { products = JSON.parse(products) } catch { products = [] }
    }

    // FIX: if user has no active tasks, don't throw error - create it from this edit
    // This happens when admin edits Set 3 from file, but user DB is still empty
    if (!Array.isArray(products)) products = []
    
    let found = false
    let updated = products.map(p => {
      if (!p) return p
      if (Number(p.taskOrder || p.id) === Number(taskOrder)) {
        found = true
        return {
          ...p,
          price: newPrice !== undefined ? Number(newPrice) : Number(p.price),
          name: newName || p.name,
          taskOrder: Number(taskOrder),
          id: Number(taskOrder)
        }
      }
      return p
    })

    // if task not in DB yet (because DB empty), add it
    if (!found) {
      updated.push({
        taskOrder: Number(taskOrder),
        id: Number(taskOrder),
        name: newName || `Product ${taskOrder}`,
        price: Number(newPrice) || 0
      })
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { currentTaskProducts: JSON.stringify(updated) } // FIX 2: stringify
    })

    return NextResponse.json({ success: true })

  } catch (e) {
    console.error('Edit user task error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}