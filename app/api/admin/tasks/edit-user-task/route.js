import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, taskOrder, newPrice, newName } = await req.json()
    if (!userId || !taskOrder) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    
    const orderNum = Number(taskOrder)

    // FIXED PARSER: Gracefully handles native JSON arrays, objects, and strings
    const safeParseJsonArray = (v) => {
      if (!v) return []
      if (Array.isArray(v)) return v
      if (typeof v === 'string') { 
        try { 
          const parsed = JSON.parse(v) 
          return Array.isArray(parsed) ? parsed : []
        } catch { 
          return [] 
        } 
      }
      return typeof v === 'object' ? [v] : []
    }

    // Run everything inside an isolated transaction
    await prisma.$transaction(async (tx) => {
      
      // CRITICAL FIX: Use raw SQL to enforce a pessimistic row lock ('FOR UPDATE')
      // This forces concurrent requests in your frontend loop to wait in line sequentially
      await tx.$executeRawUnsafe(`SELECT id FROM "User" WHERE id = $1 FOR UPDATE`, String(userId))

      // Now it is completely safe to fetch the locked user row data
      const user = await tx.user.findUnique({ where: { id: String(userId) } })
      if (!user) throw new Error('User not found')

      let currentList = safeParseJsonArray(user.currentTaskProducts)
      
      // Fallback: If user has no cache yet, load from DB config template layout
      if (currentList.length === 0) {
        try {
          const dbConfig = await tx.taskSetConfig.findUnique({
            where: { 
              vipLevel_day_setNum: { 
                vipLevel: Number(user.vipLevel), 
                day: Number(user.currentDay), 
                setNum: Number(user.currentSet) 
              } 
            }
          })
          if (dbConfig?.data) {
            currentList = safeParseJsonArray(dbConfig.data)
          }
        } catch {}
      }

      // Safeguard layout structure if fallback template is empty
      if (currentList.length === 0) {
        currentList = Array.from({ length: 40 }, (_, i) => ({
          id: i + 1,
          taskOrder: i + 1,
          name: "Standard Product",
          price: 0
        }))
      }

      // Map over the list to inject your custom edits safely
      const newCurrent = currentList.map(p => {
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

      let activeList = safeParseJsonArray(user.activeProducts)
      const newActive = activeList.map(p => {
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

      // Update separate pending items inside the Task model table cleanly
      const pending = await tx.task.findFirst({ 
        where: { userId: String(userId), status: 'pending' }, 
        orderBy: { createdAt: 'desc' } // Target freshest open entry
      })
      
      if (pending) {
        let tProds = safeParseJsonArray(pending.products)
        const newTProds = tProds.map(p => {
          if (!p) return p
          if (Number(p.taskOrder || p.id) === orderNum) {
            return { 
              ...p, 
              price: newPrice !== undefined ? Number(newPrice) : p.price, 
              name: newName !== undefined ? newName : p.name 
            }
          }
          return p
        })
        await tx.task.update({ where: { id: pending.id }, data: { products: newTProds } })
      }

      // Save changes back to the database row before releasing the row lock
      return await tx.user.update({ 
        where: { id: String(userId) }, 
        data: { 
          currentTaskProducts: newCurrent,
          activeProducts: newActive
        } 
      })
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('edit-user-task isolated row lock transaction failure:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
