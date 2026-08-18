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

    if (user.currentDay >= 5) {
      return NextResponse.json({ error: 'Max Day 5 reached. User has completed all 5 days' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        currentDay: user.currentDay + 1,   // Day +1
        currentSet: 1,                     // Reset to Set 1
        tasksInCurrentSet: 0,              // Reset tasks to 0
        completedSetsToday: 0              // Reset sets done today to 0  <- ADDED
      },
      select: { // Return everything front needs to display
        id: true,
        username: true,
        vipLevel: true,           // VIP level user is on
        walletBalance: true,      // Balance of user
        currentDay: true,         // Day user is on
        currentSet: true,         // Set user is on
        tasksInCurrentSet: true,  // Tasks done in current set
        completedSetsToday: true, // Sets completed today
        specialBonus: true
      }
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: `Next Day: ${user.username} VIP${user.vipLevel} moved from Day ${user.currentDay} to Day ${updated.currentDay}`
      }
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}