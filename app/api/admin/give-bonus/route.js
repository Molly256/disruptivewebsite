import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, amount, adminId } = await req.json()

    const user = await prisma.user.update({ 
      where: { id: userId }, 
      data: { specialBonus: { increment: parseFloat(amount) } } // FIXED: added ) }
    })

    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Gave $${amount} bonus to ${user.username}` 
      }
    })

    return NextResponse.json({ success: true, newBonus: user.specialBonus })
  } catch (e) { 
    console.error('Bonus error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}