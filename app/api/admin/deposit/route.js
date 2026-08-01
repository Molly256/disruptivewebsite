import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, amount, adminId } = await req.json()

    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { totalBalance: { increment: parseFloat(amount) } } // FIXED: added ) }
    })

    await prisma.transaction.create({ 
      data: { 
        userId, 
        type: 'deposit', // lowercase to match your schema comment
        amount: parseFloat(amount), 
        status: 'success' 
      } 
    })

    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Deposited $${amount} to ${user.username}` 
      }
    })

    return NextResponse.json({ success: true, newBalance: user.totalBalance })
  } catch (e) { 
    console.error('Deposit error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}