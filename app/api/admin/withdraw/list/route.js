import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: 'withdraw', status: 'pending' }, // FIXED: lowercase
      include: { 
        user: { 
          select: { 
            id: true,
            username: true, 
            phone: true,        // <-- ADDED
            boundWallet: true   // <-- ADDED: payment method
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ transactions })
  } catch (e) { 
    console.error('Withdraw list error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}