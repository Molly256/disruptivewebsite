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

    // 💡 FIXED: Only update fields that exist in your actual Prisma Schema
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        currentDay: user.currentDay + 1,   // Day +1
        currentSet: 1,                     // Reset to Set 1
        tasksInCurrentSet: 0,              // Reset tasks count to 0 in database
        currentTaskProducts: '[]',         // Safely clear active task snapshot
        activeProducts: '[]'               // Safely clear active product queue
      },
      select: { 
        id: true,
        username: true,
        vipLevel: true,           
        walletBalance: true,      
        currentDay: true,         
        currentSet: true,         
        tasksInCurrentSet: true,  
        specialBonus: true
        // 🚀 REMOVED: completedSetsToday from Prisma select block to stop the crash!
      }
    })

    // 💡 FIXED: Adjusted admin log text to match your schema types safely
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'next_day_progress',
        targetUserId: userId,
        details: {
          message: `Next Day: ${user.username} VIP${user.vipLevel} moved from Day ${user.currentDay} to Day ${updated.currentDay}`
        }
      }
    })

    // 💡 SOLUTION: Append the UI property right here before responding!
    // Since they just moved to a brand new day, completed sets today resets back to 0.
    const userWithUiProperties = {
      ...updated,
      completedSetsToday: 0 // Injected manually for your admin panel layout template!
    }

    return NextResponse.json({ success: true, user: userWithUiProperties })
  } catch (e) {
    console.error('API Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
