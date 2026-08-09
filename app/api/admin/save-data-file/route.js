import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipSet, data: updatedData } = await req.json()

    if (!vipSet || !updatedData || updatedData.length === 0) {
      return NextResponse.json({ error: 'Missing vipSet or data' }, { status: 400 })
    }

    const normalizedSet = vipSet.toLowerCase()

    // 1. Find the master inventory record in the database
    const masterData = await prisma.taskMerge.findFirst({
      where: { vipSet: normalizedSet, status: 'system_template' }
    })

    if (!masterData) {
      return NextResponse.json({ error: 'Master product template not found in DB.' }, { status: 404 })
    }
    
    let productsArray = typeof masterData.pairs === 'string' ? JSON.parse(masterData.pairs) : masterData.pairs

    // 2. Update the name and price changes directly inside the database array
    updatedData.forEach(updatedItem => {
      const idx = productsArray.findIndex(item => item.taskOrder === parseInt(updatedItem.taskOrder))
      if (idx !== -1) {
        productsArray[idx] = {
          ...productsArray[idx],
          name: updatedItem.name,
          price: parseFloat(updatedItem.price)
        }
      }
    })

    // 3. Save the modified product rules back into the database template
    await prisma.taskMerge.update({
      where: { id: masterData.id },
      data: { pairs: productsArray }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('SAVE DATA ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
