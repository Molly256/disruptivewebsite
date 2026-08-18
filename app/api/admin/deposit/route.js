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

    // 1. Update user wallet
    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { walletBalance: { increment: amt } }
    })

    // 2. Create transaction record - FIXED
    await prisma.transaction.create({ 
      data: { 
        userId, 
        type: 'deposit',
        amount: amt, 
        status: 'success' // FIX: was 'completed'
      } 
    })

    // 3. Log admin action
    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Deposited $${amt.toFixed(2)} to ${user.username}`,
        targetUserId: userId // added so you can track who
      }
    })

    return NextResponse.json({ success: true, newBalance: user.walletBalance })
  } catch (e) { 
    console.error('Deposit error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}