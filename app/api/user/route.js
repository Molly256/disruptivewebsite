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

      const updatedUser = await prisma.user.update({
        where: { id: String(userId) },
        data: { loginPassword: newPass },
        select: {
          id: true, username: true, phone: true, countryName: true,
          countryCode: true, gender: true, inviteCode: true, createdAt: true,
          updatedAt: true, vipLevel: true, vipId: true, day: true, setNumber: true,
          walletBalance: true, holdAmount: true, bonus: true, specialBonus: true,
          taskCompleted: true, setsCompleted: true, totalTasks: true, activeProducts: true,
          completedProducts: true, currentTaskProducts: true, mergedTasks: true,
          todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, boundWallet: true,
        }
      })

      return NextResponse.json({ user: { ...updatedUser, currentSet: updatedUser.setsCompleted }, message: 'passwordUpdated' })

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

      const updatedUser = await prisma.user.update({
        where: { id: String(userId) },
        data: { transactionPassword: newPass },
        select: {
          id: true, username: true, phone: true, countryName: true,
          countryCode: true, gender: true, inviteCode: true, createdAt: true,
          updatedAt: true, vipLevel: true, vipId: true, day: true, setNumber: true,
          walletBalance: true, holdAmount: true, bonus: true, specialBonus: true,
          taskCompleted: true, setsCompleted: true, totalTasks: true, activeProducts: true,
          completedProducts: true, currentTaskProducts: true, mergedTasks: true,
          todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true, boundWallet: true,
        }
      })

      return NextResponse.json({ user: { ...updatedUser, currentSet: updatedUser.setsCompleted }, message: 'txPasswordUpdated' })

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (e) {
    console.error('API /user/update error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}