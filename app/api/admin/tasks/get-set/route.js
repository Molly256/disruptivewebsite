import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const vip = Number(searchParams.get('vipLevel'))
    const day = Number(searchParams.get('day'))
    const set = Number(searchParams.get('set'))

    if (!userId ||!vip ||!day ||!set) {
      return NextResponse.json({ tasks: [] })
    }

    // 1. Custom per-user
    const custom = await prisma.task.findFirst({
      where: { userId, day, setNumber: set, status: 'custom' }
    })
    if (custom?.products && custom.products.length > 0) {
      const list = typeof custom.products === 'string'? JSON.parse(custom.products) : custom.products
      return NextResponse.json({ tasks: list })
    }

    // 2. Current cache
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user && Number(user.currentDay) === day && Number(user.currentSet) === set) {
      let list = user.currentTaskProducts
      if (typeof list === 'string') try { list = JSON.parse(list) } catch { list = [] }
      if (Array.isArray(list) && list.length > 0) {
        return NextResponse.json({ tasks: list })
      }
    }

    // 3. File
    const fileName = `vip${vip}Set${set}.js`
    let filePath = path.join(process.cwd(), 'data', `vip${vip}/day${day}`, fileName)
    if (!fs.existsSync(filePath)) filePath = path.join(process.cwd(), 'data-source', `vip${vip}/day${day}`, fileName)

    if (!fs.existsSync(filePath)) return NextResponse.json({ tasks: [] })

    const content = fs.readFileSync(filePath, 'utf8')
    const start = content.indexOf('[')
    const end = content.lastIndexOf(']')
    if (start === -1 || end === -1) return NextResponse.json({ tasks: [] })
    const items = Function(`"use strict"; return (${content.substring(start, end + 1)})`)()
    const formatted = items.map((p, i) => ({
     ...p,
      id: p.taskOrder || i + 1,
      taskOrder: p.taskOrder || i + 1,
      price: Number(p.price || 0),
      name: p.name || `Product ${i + 1}`
    }))
    return NextResponse.json({ tasks: formatted })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ tasks: [] })
  }
}