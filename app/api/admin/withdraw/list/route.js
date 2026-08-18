import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: 'withdrawal', status: 'pending' }, // FIX 1: use 'withdrawal' not 'withdraw'
      include: { 
        user: { 
          select: { 
            id: true,
            username: true, 
            phone: true,
            boundWallet: true // this is JSON, so it will return the wallet object
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    })

    // FIX 2: map type back to 'withdraw' for front
    const tx = transactions.map(t => ({...t, type: 'withdraw'}))

    return NextResponse.json({ transactions: tx })
  } catch (e) { 
    console.error('Withdraw list error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}