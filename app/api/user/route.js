export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Prisma cuid is string, so don't parseInt
    const user = await prisma.user.findUnique({
      where: { id: String(id) }, // force to string
      select: {
        id: true,
        username: true,
        phone: true,
        countryName: true,
        countryCode: true,
        gender: true,
        inviteCode: true,
        createdAt: true,
        updatedAt: true,
        vipLevel: true,
        totalBalance: true,
        holdAmount: true,
        bonus: true,
        specialBonus: true,
        taskCompleted: true,
        currentSet: true,
        totalTasks: true,
        setCompleted: true,
        activeProducts: true,
        completedProducts: true,
        currentTaskProducts: true, 
        mergedTasks: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (e) {
    console.error('API /user error:', e)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}