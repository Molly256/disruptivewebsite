export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getTodayUS() {
  return new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')
    if (!userId) {
      return NextResponse.json({ error: 'User ID query parameter required' }, { status: 400 })
    }
    let user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true, username: true, phone: true, countryName: true,
        countryCode: true, gender: true, inviteCode: true, createdAt: true,
        updatedAt: true, vipLevel: true, vipId: true,
        currentDay: true, currentSet: true,
        walletBalance: true, holdAmount: true, specialBonus: true,
        taskCompleted: true, totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true, 
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        x10TaskNumbers: true, boundWallet: true,
        creditScore: true, isRiskControlled: true, avatar: true,
      }
    })
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // RESET TODAY PROFIT AT 00:00 USA TIME
    const todayUS = getTodayUS()
    const lastResetUS = user.lastProfitReset ? new Date(user.lastProfitReset).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : null
    
    if (lastResetUS !== todayUS) {
      user = await prisma.user.update({
        where: { id: String(userId) },
        data: { todayProfit: 0, lastProfitReset: new Date() },
        select: {
          id: true, username: true, phone: true, countryName: true,
          countryCode: true, gender: true, inviteCode: true, createdAt: true,
          updatedAt: true, vipLevel: true, vipId: true,
          currentDay: true, currentSet: true,
          walletBalance: true, holdAmount: true, specialBonus: true,
          taskCompleted: true, totalTasks: true, activeProducts: true,
          completedProducts: true, currentTaskProducts: true, 
          todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
          x10TaskNumbers: true, boundWallet: true,
          creditScore: true, isRiskControlled: true, avatar: true,
        }
      })
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
    console.error('API /user GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { userId, type, oldPass, newPass } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: String(userId) } })
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
        walletBalance: true, holdAmount: true, specialBonus: true,
        taskCompleted: true, totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true, 
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        x10TaskNumbers: true, boundWallet: true,
        creditScore: true, isRiskControlled: true, avatar: true,
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