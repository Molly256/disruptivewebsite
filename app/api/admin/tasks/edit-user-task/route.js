import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let products = user.currentTaskProducts || []
    if (typeof products === 'string') {
      try { 
        products = JSON.parse(products) 
      } catch { 
        products = [] 
      }
    }
    
    if (products.length === 0) {
      return NextResponse.json({ error: 'User has no active tasks' }, { status: 400 })
    }

    const updated = products.map(p => {
      if (Number(p.taskOrder || p.id) === Number(taskOrder)) {
        return {
          ...p,
          price: newPrice !== undefined ? parseFloat(newPrice) : p.price,
          name: newName || p.name
        }
      }
      return p
    })

    await prisma.user.update({
      where: { id: userId },
      data: { currentTaskProducts: updated }
    })

    return NextResponse.json({ success: true, message: `User ${userId} task ${taskOrder} updated` })

  } catch (e) {
    console.error('Edit user task error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}