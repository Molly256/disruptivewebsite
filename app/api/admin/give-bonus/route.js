import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, amount, adminId } = await req.json()

    if (!userId || !amount || !adminId) {
      return NextResponse.json({ error: 'userId, amount, adminId required' }, { status: 400 })
    }

    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // 1. Add to specialBonus AND walletBalance only
    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { 
        specialBonus: { increment: amt },   // For display
        walletBalance: { increment: amt }   // So user can withdraw
      },
      select: { id: true, username: true, specialBonus: true, walletBalance: true }
    })

    // 2. Log admin action
    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Gave $${amt.toFixed(2)} Special Bonus to ${user.username}`,
        targetUserId: userId
      }
    })

    // 3. Transaction history - FIXED status
    await prisma.transaction.create({
      data: {
        userId,
        type: 'special_bonus', 
        amount: amt,
        status: 'success' // FIX: was 'completed'
      }
    })

    return NextResponse.json({ 
      success: true, 
      newBonus: user.specialBonus,
      newBalance: user.walletBalance
    })
  } catch (e) { 
    console.error('Give bonus error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}