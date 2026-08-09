import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(req) {
  try {
    // FIX 1: Destructure incoming array matching frontend "data" payload key name
    const { userId, vipSet, data: updatedData, adminId } = await req.json()

    if (!userId || !vipSet || !updatedData || !Array.isArray(updatedData)) {
      return NextResponse.json({ error: 'Missing parameters or invalid updated data format' }, { status: 400 })
    }

    // Update TaskMerge.pairs with name/price snapshots safely
    const merges = await prisma.taskMerge.findMany({ 
      where: { userId, vipSet: vipSet.toLowerCase(), status: 'active' } 
    })

    for (const merge of merges) {
      // Safely ensure pairs is treated as a manipulable native array structure
      let pairs = typeof merge.pairs === 'string' ? JSON.parse(merge.pairs) : (merge.pairs || [])
      if (!Array.isArray(pairs)) continue;

      let changed = false

      updatedData.forEach(u => {
        const idx = pairs.findIndex(p => p.taskOrder === parseInt(u.taskOrder))
        if (idx !== -1) {
          // Injects or overrides snapshot entries for user interface displays
          pairs[idx] = {
            ...pairs[idx],
            name: u.name,
            price: parseFloat(u.price)
          }
          changed = true
        }
      })

      if (changed) {
        await prisma.taskMerge.update({ 
          where: { id: merge.id }, 
          data: { pairs: pairs } 
        })
      }
    }

    // FIX 2: Aligned perfectly with your strict AdminLog schema configuration layout
    if (adminId) {
      await prisma.adminLog.create({
        data: { 
          adminId: adminId, 
          action: `Updated data snapshot parameters for ${vipSet} (Target User: ${userId})` 
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('UPDATE MERGED DATA DB ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
