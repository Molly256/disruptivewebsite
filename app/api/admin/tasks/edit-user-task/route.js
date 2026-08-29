import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: String(userId) } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    const parse = (v) => {
      if (!v) return []
      if (typeof v === 'string') { try { return JSON.parse(v) } catch { return [] } }
      return Array.isArray(v) ? v : []
    }

    const editOnly = (products) => {
      let list = parse(products)
      return list.map(p => {
        if (!p) return p
        if (Number(p.taskOrder || p.id) === Number(taskOrder)) {
          return { 
            ...p, 
            price: newPrice !== undefined ? Number(newPrice) : p.price, 
            name: newName !== undefined ? newName : p.name,
            taskOrder: Number(taskOrder),
            id: Number(taskOrder)
          }
        }
        return p
      })
    }

    const newCurrent = editOnly(user.currentTaskProducts)
    const newActive = editOnly(user.activeProducts)

    await prisma.user.update({ 
      where: { id: String(userId) }, 
      data: { 
        currentTaskProducts: newCurrent,
        activeProducts: newActive
      } 
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}