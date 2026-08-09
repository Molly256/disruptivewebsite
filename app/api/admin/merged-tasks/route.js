import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const vipSet = searchParams.get('vipSet')

    if (!userId || !vipSet) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const activeMerge = await prisma.taskMerge.findFirst({
      where: { userId, vipSet: vipSet.toLowerCase(), status: 'active' },
      orderBy: { createdAt: 'desc' }
    })

    if (!activeMerge) {
      return NextResponse.json({ tasks: [] })
    }

    const rawPairs = typeof activeMerge.pairs === 'string' ? JSON.parse(activeMerge.pairs) : activeMerge.pairs
    const taskOrders = Array.isArray(rawPairs) ? rawPairs.map(p => p.taskOrder) : []

    return NextResponse.json({ 
      id: activeMerge.id,
      status: activeMerge.status,
      tasks: taskOrders 
    })
  } catch (e) {
    console.error('Fetch error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
