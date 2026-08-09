import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipSet = searchParams.get('vipSet')
    const userId = searchParams.get('userId') // Expects userId passed from frontend query string

    if (!vipSet) return NextResponse.json({ error: 'Missing vipSet' }, { status: 400 })

    const normalizedSet = vipSet.toLowerCase()

    // 1. Look for the actual active merged entry for this specific user
    const activeMerge = await prisma.taskMerge.findFirst({
      where: { 
        userId: userId || undefined, // Context-specific user tracking
        vipSet: normalizedSet, 
        status: 'active' 
      },
      orderBy: { createdAt: 'desc' }
    })

    // 2. Fallback: If no active user merge is found, return a clean default template array of 40 items
    if (!activeMerge) {
      const isSet2 = normalizedSet.includes('set2');
      const startId = isSet2 ? 41 : 1;
      const defaultProducts = Array.from({ length: 40 }, (_, i) => {
        const order = startId + i;
        return { id: order, taskOrder: order, name: `Product ${order}`, price: isSet2 ? 200.00 : 100.00, image: `photo${order}.jpg`, rating: 5 }
      });
      return NextResponse.json(defaultProducts)
    }

    // 3. Parse and return the real products inside the user's active merge row
    const dataArr = typeof activeMerge.pairs === 'string' ? JSON.parse(activeMerge.pairs) : activeMerge.pairs
    return NextResponse.json(dataArr)
  } catch (e) {
    console.error('FETCH DATA ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
