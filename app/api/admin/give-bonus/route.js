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

    // 1. Add to specialBonus, walletBalance, AND TotalBalance
    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { 
        specialBonus: { increment: amt },   // For display: "Special Lucky Bonus"
        walletBalance: { increment: amt },  // So user can actually withdraw it
        TotalBalance: { increment: amt }    // <-- ADDED: keeps total in sync
      },
      select: { id: true, username: true, specialBonus: true, walletBalance: true, TotalBalance: true }
    })

    // 2. Log admin action
    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Gave $${amt.toFixed(2)} Lucky Bonus to ${user.username}` 
      }
    })

    // 3. Transaction history - must be 'special_bonus' and 'completed'
    await prisma.transaction.create({
      data: {
        userId,
        type: 'special_bonus', // <-- FIXED
        amount: amt,
        status: 'completed' // <-- FIXED
      }
    })

    return NextResponse.json({ 
      success: true, 
      newBonus: user.specialBonus,
      newBalance: user.walletBalance,
      newTotal: user.TotalBalance
    })
  } catch (e) { 
    console.error('Give bonus error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}