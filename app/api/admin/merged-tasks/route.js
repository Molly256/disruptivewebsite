import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const vipSet = searchParams.get('vipSet')

    if(!userId ||!vipSet) return NextResponse.json({ error: 'Missing' }, { status: 400 })

    const tasks = await prisma.taskMerge.findMany({
      where: { userId, vipSet, status: 'active' }
    })

    return NextResponse.json({ tasks })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}