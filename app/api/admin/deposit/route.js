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
      data: { walletBalance: { increment: amt } } // FIXED: added closing }
    })

    // 2. Create transaction record
    await prisma.transaction.create({ 
      data: { 
        userId, 
        type: 'deposit',
        amount: amt, 
        status: 'success' 
      } 
    })

    // 3. Log admin action
    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Deposited $${amt.toFixed(2)} to ${user.username}` 
      }
    })

    return NextResponse.json({ success: true, newBalance: user.walletBalance })
  } catch (e) { 
    console.error('Deposit error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}