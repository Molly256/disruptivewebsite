export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, type, oldPass, newPass, boundWallet } = body // <-- add boundWallet

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
      if (newPass === oldPass) {
        return NextResponse.json({ error: 'New password must be different' }, { status: 400 })
      }
      if (!newPass) {
        return NextResponse.json({ error: 'New password cannot be empty' }, { status: 400 })
      }
      dataToUpdate.loginPassword = newPass
      message = 'passwordUpdated'

    } else if (type === 'txpassword') {
      if (oldPass !== user.transactionPassword) {
        return NextResponse.json({ error: 'Old transaction password is incorrect' }, { status: 400 })
      }
      if (newPass === oldPass) {
        return NextResponse.json({ error: 'New password must be different' }, { status: 400 })
      }
      if (!newPass) {
        return NextResponse.json({ error: 'New password cannot be empty' }, { status: 400 })
      }
      dataToUpdate.transactionPassword = newPass
      message = 'txPasswordUpdated'

    } else if (boundWallet) { // <-- NEW: handle bind wallet
      if(!boundWallet.type || !boundWallet.name || !boundWallet.address) {
        return NextResponse.json({ error: 'All wallet fields required' }, { status: 400 })
      }
      dataToUpdate.boundWallet = boundWallet // save as JSON
      message = 'walletBound'

    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: dataToUpdate,
      select: {
        id: true, username: true, phone: true, countryName: true,
        countryCode: true, gender: true, inviteCode: true, createdAt: true,
        updatedAt: true, vipLevel: true, vipId: true, currentDay: true, currentSet: true,
        walletBalance: true, holdAmount: true, bonus: true, specialBonus: true,
        taskCompleted: true, totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true,
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, 
        transactionPassword: false, loginPassword: false, // don't return passwords
        boundWallet: true, // <-- IMPORTANT
      }
    })

    return NextResponse.json({ user: updatedUser, message })

  } catch (e) {
    console.error('API /user/update error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}