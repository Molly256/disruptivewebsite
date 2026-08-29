import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()
    if (!userId || !taskOrder) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    
    const user = await prisma.user.findUnique({ where: { id: String(userId) } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    const parse = (v) => {
      if (!v) return []
      if (typeof v === 'string') { try { return JSON.parse(v) } catch { return [] } }
      return Array.isArray(v) ? v : []
    }

    let currentList = parse(user.currentTaskProducts)
    // If user has no cache yet, load from DB config so edit doesn't disappear
    if (currentList.length === 0) {
      try {
        const dbConfig = await prisma.taskSetConfig.findUnique({
          where: { vipLevel_day_setNum: { vipLevel: Number(user.vipLevel), day: Number(user.currentDay), setNum: Number(user.currentSet) } }
        })
        if (dbConfig?.data?.length) currentList = dbConfig.data
      } catch {}
    }

    const orderNum = Number(taskOrder)
    const editOnly = (products) => {
      let list = parse(products)
      // if list empty and we have currentList, use currentList as base
      if (list.length === 0 && currentList.length > 0 && products === user.currentTaskProducts) {
        list = currentList
      }
      return list.map(p => {
        if (!p) return p
        if (Number(p.taskOrder || p.id) === orderNum) {
          return { 
            ...p, 
            price: newPrice !== undefined ? Number(newPrice) : p.price, 
            name: newName !== undefined ? newName : p.name,
            taskOrder: orderNum,
            id: orderNum
          }
        }
        return p
      })
    }

    const newCurrent = editOnly(user.currentTaskProducts)
    const newActive = editOnly(user.activeProducts)

    // FIX: also update Task table pending products
    const pending = await prisma.task.findFirst({ 
      where: { userId: String(userId), status: 'pending' }, 
      orderBy: { createdAt: 'desc' } 
    })
    if (pending) {
      let tProds = parse(pending.products)
      const newTProds = tProds.map(p => {
        if (!p) return p
        if (Number(p.taskOrder || p.id) === orderNum) {
          return { ...p, price: Number(newPrice), name: newName !== undefined ? newName : p.name }
        }
        return p
      })
      await prisma.task.update({ where: { id: pending.id }, data: { products: newTProds } })
    }

    await prisma.user.update({ 
      where: { id: String(userId) }, 
      data: { 
        currentTaskProducts: newCurrent.length > 0 ? newCurrent : currentList,
        activeProducts: newActive
      } 
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('edit-user-task error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}