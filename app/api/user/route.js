export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        taskCompleted: true, // setsCompleted REMOVED
        totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true, mergedTasks: true,
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        x10TaskNumbers: true, boundWallet: true,
      }
    })

    // Add aliases so admin panel using day/setNumber/setsCompleted won't break
    return NextResponse.json({ 
      user: { 
        ...updatedUser, 
        day: updatedUser.currentDay, 
        setNumber: updatedUser.currentSet,
        setsCompleted: 0 // default
      }, 
      message 
    })

  } catch (e) {
    console.error('API /user error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}