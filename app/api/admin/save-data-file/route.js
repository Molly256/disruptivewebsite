import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const { vipSet, data: updatedData } = body
    
    // FIX 1: Flexibly capture the userId, user_id, or fallback inputs from the frontend
    let userId = body.userId || body.user_id || body.id

    if (!vipSet || !updatedData || updatedData.length === 0) {
      return NextResponse.json({ error: 'Missing vipSet or data parameters' }, { status: 400 })
    }

    const normalizedSet = vipSet.toLowerCase()
    let activeMerge = null

    // FIX 2: Dynamic Lookup — Search using exactly what the frontend provided
    if (userId) {
      // If the frontend successfully sent an ID, use it directly
      activeMerge = await prisma.taskMerge.findFirst({
        where: { userId, vipSet: normalizedSet, status: 'active' },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // FALLBACK: If the frontend forgot the userId, scan the DB for whichever active user is currently on this set!
      activeMerge = await prisma.taskMerge.findFirst({
        where: { vipSet: normalizedSet, status: 'active' },
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!activeMerge) {
      return NextResponse.json({ error: `Active merge row not found for ${vipSet}.` }, { status: 404 })
    }
    
    let pairsArray = typeof activeMerge.pairs === 'string' ? JSON.parse(activeMerge.pairs) : activeMerge.pairs

    // Update the specific name and price variables directly inside the array keys
    updatedData.forEach(updatedItem => {
      const idx = pairsArray.findIndex(item => item.taskOrder === parseInt(updatedItem.taskOrder))
      if (idx !== -1) {
        pairsArray[idx] = {
          ...pairsArray[idx],
          name: updatedItem.name,
          price: parseFloat(updatedItem.price)
        }
      }
    })

    // FIX 3: Overwrite the updated price rule snapshots directly back to that specific row entry
    await prisma.taskMerge.update({
      where: { id: activeMerge.id },
      data: { pairs: pairsArray }
    })

    return NextResponse.json({ success: true, message: "Successfully synced data edits straight to active user merge track." })
  } catch (e) {
    console.error('SAVE DATA ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
