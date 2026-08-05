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

    // 1. Add to specialBonus and return updated user
    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { specialBonus: { increment: amt } },
      select: { id: true, username: true, specialBonus: true } // return updated
    })

    // 2. Log admin action
    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Gave $${amt.toFixed(2)} Lucky Bonus to ${user.username}` 
      }
    })

    // 3. Also create a transaction record so user can see it in history
    await prisma.transaction.create({
      data: {
        userId,
        type: 'bonus',
        amount: amt,
        status: 'success'
      }
    })

    return NextResponse.json({ success: true, newBonus: user.specialBonus })
  } catch (e) { 
    console.error('Give bonus error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}