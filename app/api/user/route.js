export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 💡 FIXED: Handles standard query fetches gracefully to stop 405 rejections
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    // Checks for both ?id= and ?userId= parameter structures cleanly
    const userId = searchParams.get('id') || searchParams.get('userId')

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
    console.error('API /user GET exception tracker:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// 🔒 PRESERVED & STABILIZED: Your profile adjustment processing block
export async function POST(req) {
  try {
    const rawData = await req.json()
    const { userId, id, type, oldPass, newPass } = rawData
    
    // Fallback parsing strategy handles payload tokens in any format seamlessly
    const activeId = userId || id

    if (!activeId) {
      return NextResponse.json({ error: 'Target account identifier string missing' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: String(activeId) }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 💡 INTERCEPT HOOK: If the frontend sends a general update fetch via POST instead of GET
    if (!type) {
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          day: user.currentDay,
          setNumber: user.currentSet,
          setsCompleted: 0
        }
      })
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
      return NextResponse.json({ error: 'Invalid type operation parameter' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(activeId) },
      data: dataToUpdate,
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
    console.error('API /user POST configuration failure:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
