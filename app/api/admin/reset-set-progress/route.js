import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, adminId } = await req.json()

    if (!userId || !adminId) {
      return NextResponse.json({ error: 'Missing userId or adminId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user.currentSet >= 3) {
      return NextResponse.json({ error: 'Cannot reset Set 3. Use Next Day instead' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        currentSet: user.currentSet + 1,
        tasksInCurrentSet: 0
      }
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: `Reset Set: ${user.username} moved from Set ${user.currentSet} to Set ${updated.currentSet} on Day ${user.currentDay}`
      }
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}