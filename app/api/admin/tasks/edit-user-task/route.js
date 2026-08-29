import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: String(userId) } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    const updateProducts = (products) => {
      let list = products || []
      if (typeof list === 'string') { try { list = JSON.parse(list) } catch { list = [] } }
      if (!Array.isArray(list)) list = []
      let found = false
      let updated = list.map(p => {
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
      if (!found) {
        updated.push({ 
          taskOrder: Number(taskOrder), 
          id: Number(taskOrder), 
          name: newName || `Product ${taskOrder}`, 
          price: Number(newPrice) || 0, 
          image: `/vip${user.vipLevel || 1}/day${user.currentDay || 1}/set${user.currentSet || 1}/photo${taskOrder}.jpg` 
        })
      }
      return updated
    }

    const newCurrent = updateProducts(user.currentTaskProducts)
    const newActive = updateProducts(user.activeProducts)

    await prisma.user.update({ 
      where: { id: String(userId) }, 
      data: { 
        currentTaskProducts: newCurrent,
        activeProducts: newActive
      } 
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Edit user task error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}