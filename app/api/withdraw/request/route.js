export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, amount, txPass } = await req.json()

    if (!userId || amount === undefined || !txPass) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: String(userId) }})
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!user.boundWallet) return NextResponse.json({ error: 'Please bind wallet first' }, { status: 400 })
    if (txPass !== user.transactionPassword) return NextResponse.json({ error: 'Transaction password incorrect' }, { status: 400 })

    const withdrawAmount = Number(amount)
    const available = Number(user.walletBalance || 0) - Number(user.freezeAmount || 0)
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    if (withdrawAmount > available) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    // Use transaction so both updates happen together
    await prisma.$transaction(async (tx) => {
      // 1. Deduct from balance, add to freeze
      await tx.user.update({
        where: { id: String(userId) },
        data: { 
          walletBalance: { decrement: withdrawAmount },
          freezeAmount: { increment: withdrawAmount }
        }
      })

      // 2. Create pending withdrawal transaction with wallet snapshot
      await tx.transaction.create({
        data: {
          userId: String(userId),
          type: 'withdraw', // FIXED: was 'withdrawal'
          amount: withdrawAmount,
          status: 'pending',
          account: user.boundWallet.address, // for quick display
          wallet: user.boundWallet // FIXED: snapshot so it doesn't change later
        }
      })
    })

    // Return safe user object without passwords
    const updatedUser = await prisma.user.findUnique({ 
      where: { id: String(userId) },
      select: {
        id: true, username: true, phone: true, countryName: true,
        countryCode: true, gender: true, inviteCode: true, createdAt: true,
        updatedAt: true, vipLevel: true, vipId: true, currentDay: true, currentSet: true,
        walletBalance: true, holdAmount: true, freezeAmount: true, bonus: true, specialBonus: true,
        taskCompleted: true, totalTasks: true, activeProducts: true,
        completedProducts: true, currentTaskProducts: true,
        todayProfit: true, lastProfitReset: true, tasksInCurrentSet: true,
        boundWallet: true,
      }
    })
    
    return NextResponse.json({ success: true, user: updatedUser, message: 'withdrawRequestSent' })

  } catch (e) {
    console.error('API /withdraw/request error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}