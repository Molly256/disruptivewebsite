import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(req) {
  try {
    const { userId, vipSet, updatedData, adminId } = await req.json()
    // updatedData: [{taskOrder: 1, name: "New", price: 10}]

    if(!userId ||!vipSet ||!updatedData) return NextResponse.json({ error: 'Missing' }, { status: 400 })

    // Update TaskMerge.pairs with name/price snapshot
    const merges = await prisma.taskMerge.findMany({ where: { userId, vipSet, status: 'active' } })
    for(const merge of merges){
      let pairs = merge.pairs || []
      let changed = false
      updatedData.forEach(u => {
        const idx = pairs.findIndex(p => p.taskOrder === u.taskOrder)
        if(idx!== -1){
          pairs[idx].name = u.name // snapshot for user UI
          pairs[idx].price = u.price
          changed = true
        }
      })
      if(changed){
        await prisma.taskMerge.update({ where: { id: merge.id }, data: { pairs } })
      }
    }

    await prisma.adminLog.create({
      data: { adminId, action: `Updated data for ${vipSet}`, userId }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}