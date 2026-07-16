import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id }, // removed parseInt() because your id is String cuid()
      select: {
        id: true,
        username: true,
        phone: true,
        countryName: true,
        countryCode: true,
        gender: true,
        inviteCode: true,
        createdAt: true,
        updatedAt: true
        // loginPassword and transactionPassword excluded for security
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (e) {
    console.error('API /user error:', e)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}