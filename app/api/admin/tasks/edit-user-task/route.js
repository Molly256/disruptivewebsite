import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const userId = body.userId? String(body.userId) : null
    const taskOrder = body.taskOrder!== undefined && body.taskOrder!== null? Number(body.taskOrder) : null
    const newPrice = body.newPrice!== undefined? Number(body.newPrice) : undefined
    const newName = body.newName!== undefined? String(body.newName) : undefined
    const editDay = body.day!== undefined? Number(body.day) : null
    const editSet = body.setNumber!== undefined? Number(body.setNumber) : null

    if (!userId || taskOrder === null || isNaN(taskOrder)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const orderNum = Number(taskOrder)

    const safeParseJsonArray = (v) => {
      if (!v) return []
      if (Array.isArray(v)) return v
      if (typeof v === 'string') {
        try { const p = JSON.parse(v); return Array.isArray(p)? p : [] } catch { return [] }
      }
      return typeof v === 'object'? [v] : []
    }

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SELECT id FROM "User" WHERE id = $1 FOR UPDATE`, String(userId))
      const user = await tx.user.findUnique({ where: { id: String(userId) } })
      if (!user) throw new Error('User not found')

      const day = editDay!== null &&!isNaN(editDay)? editDay : Number(user.currentDay)
      const set = editSet!== null &&!isNaN(editSet)? editSet : Number(user.currentSet)
      const isCurrentSet = Number(user.currentDay) === day && Number(user.currentSet) === set

      let baseList = []
      const customExisting = await tx.task.findFirst({
        where: { userId: String(userId), day, setNumber: set, status: 'custom' }
      })

      if (customExisting?.products?.length > 0) {
        baseList = safeParseJsonArray(customExisting.products)
      } else if (isCurrentSet) {
        baseList = safeParseJsonArray(user.currentTaskProducts)
        if (baseList.length === 0) {
          try {
            const fs = await import('fs'); const path = await import('path')
            const fn = `vip${user.vipLevel}Set${set}.js`
            let fp = path.join(process.cwd(), 'data', `vip${user.vipLevel}/day${day}`, fn)
            if (!fs.existsSync(fp)) fp = path.join(process.cwd(), 'data-source', `vip${user.vipLevel}/day${day}`, fn)
            const c = fs.readFileSync(fp, 'utf8'); const s = c.indexOf('['); const e = c.lastIndexOf(']')
            const items = Function(`"use strict"; return (${c.substring(s, e + 1)})`)()
            baseList = items.map((p, i) => ({...p, id: p.taskOrder || i + 1, taskOrder: p.taskOrder || i + 1 }))
          } catch { baseList = [] }
        }
      } else {
        try {
          const fs = await import('fs'); const path = await import('path')
          const fn = `vip${user.vipLevel}Set${set}.js`
          let fp = path.join(process.cwd(), 'data', `vip${user.vipLevel}/day${day}`, fn)
          if (!fs.existsSync(fp)) fp = path.join(process.cwd(), 'data-source', `vip${user.vipLevel}/day${day}`, fn)
          const c = fs.readFileSync(fp, 'utf8'); const s = c.indexOf('['); const e = c.lastIndexOf(']')
          const items = Function(`"use strict"; return (${c.substring(s, e + 1)})`)()
          baseList = items.map((p, i) => ({...p, id: p.taskOrder || i + 1, taskOrder: p.taskOrder || i + 1 }))
        } catch {
          baseList = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, taskOrder: i + 1, name: "Standard Product", price: 0 }))
        }
      }

      if (baseList.length === 0) baseList = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, taskOrder: i + 1, name: "Standard Product", price: 0 }))

      const newList = baseList.map(p => {
        if (!p) return p
        if (Number(p.taskOrder || p.id) === orderNum) {
          return {...p, price: newPrice!== undefined? newPrice : p.price, name: newName!== undefined? newName : p.name, taskOrder: orderNum, id: orderNum }
        }
        return p
      })

      if (customExisting) {
        await tx.task.update({ where: { id: customExisting.id }, data: { products: newList } })
      } else {
        await tx.task.create({
          data: {
            userId: String(userId), vipLevel: user.vipLevel, day, setNumber: set,
            status: 'custom', products: newList,
            progress: `CUSTOM D${day} S${set}`, taskCode: `CUSTOM-${userId}-${day}-${set}-${Date.now()}`
          }
        })
      }

      if (isCurrentSet) {
        let activeList = safeParseJsonArray(user.activeProducts)
        const newActive = activeList.map(p => {
          if (!p) return p
          if (Number(p.taskOrder || p.id) === orderNum) {
            return {...p, price: newPrice!== undefined? newPrice : p.price, name: newName!== undefined? newName : p.name, taskOrder: orderNum, id: orderNum }
          }
          return p
        })
        const pending = await tx.task.findFirst({ where: { userId: String(userId), status: 'pending' }, orderBy: { createdAt: 'desc' } })
        if (pending) {
          let tProds = safeParseJsonArray(pending.products)
          const newTProds = tProds.map(p => {
            if (!p) return p
            if (Number(p.taskOrder || p.id) === orderNum) {
              return {...p, price: newPrice!== undefined? newPrice : p.price, name: newName!== undefined? newName : p.name }
            }
            return p
          })
          await tx.task.update({ where: { id: pending.id }, data: { products: newTProds } })
        }
        await tx.user.update({ where: { id: String(userId) }, data: { currentTaskProducts: newList, activeProducts: newActive } })
      }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('edit-user-task failure:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}