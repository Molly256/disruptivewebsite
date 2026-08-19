export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 💡 FIXED: Added a GET handler to intercept and process ?id=... requests from the frontend!
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID query parameter required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true, username: true, phone: true, countryName: true,
        countryCode: true, gender: true, inviteCode: true, createdAt: true,
        updatedAt: true, vipLevel: true, vipId: true, 
        currentDay: true, currentSet: true,
        walletBalance: true, holdAmount: true, bonus: true, specialBonus: true,
        taskCompleted: true, totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true, mergedTasks: true,
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        x10TaskNumbers: true, boundWallet: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Add required formatting aliases to match dashboard templates smoothly
    return NextResponse.json({ 
      success: true,
      user: { 
        ...user, 
        day: user.currentDay, 
        setNumber: user.currentSet,
        setsCompleted: 0 
      }
    })

  } catch (e) {
    console.error('API /user GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// 🔒 PRESERVED: Your original POST password/txpassword handling security system continues exactly as before
export async function POST(req) {
  try {
    const { userId, type, oldPass, newPass } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let dataToUpdate = {}
    let message = ''

    if (type === 'password') {
      if (oldPass !== user.loginPassword) {
        return NextResponse.json({ error: 'Old password is incorrect' }, { status: 400 })
      }
      if (!newPass || newPass === oldPass) {
        return NextResponse.json({ error: 'New password must be different and not empty' }, { status: 400 })
      }
      dataToUpdate.loginPassword = newPass
      message = 'passwordUpdated'

    } else if (type === 'txpassword') {
      if (oldPass !== user.transactionPassword) {
        return NextResponse.json({ error: 'Old transaction password is incorrect' }, { status: 400 })
      }
      if (!newPass || newPass === oldPass) {
        return NextResponse.json({ error: 'New password must be different and not empty' }, { status: 400 })
      }
      dataToUpdate.transactionPassword = newPass
      message = 'txPasswordUpdated'

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: dataToUpdate,
      select: {
        id: true, username: true, phone: true, countryName: true,
        countryCode: true, gender: true, inviteCode: true, createdAt: true,
        updatedAt: true, vipLevel: true, vipId: true, 
        currentDay: true, currentSet: true,
        walletBalance: true, holdAmount: true, bonus: true, specialBonus: true,
        taskCompleted: true, 
        totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true, mergedTasks: true,
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        x10TaskNumbers: true, boundWallet: true,
      }
    })

    return NextResponse.json({ 
      user: { 
        ...updatedUser, 
        day: updatedUser.currentDay, 
        setNumber: updatedUser.currentSet,
        setsCompleted: 0 
      }, 
      message 
    })

  } catch (e) {
    console.error('API /user POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
