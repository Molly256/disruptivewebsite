import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    // FIX 1: Extract the userId passed dynamically from your frontend payload
    const { vipSet, data: updatedData, userId } = await req.json()

    if (!vipSet || !userId || !updatedData || updatedData.length === 0) {
      return NextResponse.json({ error: 'Missing vipSet, userId, or data' }, { status: 400 })
    }

    const normalizedSet = vipSet.toLowerCase()

    // FIX 2: Locate the target user's exact active task merge configuration row
    const activeMerge = await prisma.taskMerge.findFirst({
      where: { userId, vipSet: normalizedSet, status: 'active' },
      orderBy: { createdAt: 'desc' }
    })

    if (!activeMerge) {
      return NextResponse.json({ error: 'Active merge instance not found for this user.' }, { status: 404 })
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

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('SAVE DATA ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
