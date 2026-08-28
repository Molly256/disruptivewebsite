import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, newPassword } = await req.json()

    console.log('RESET ATTEMPT:', userId, newPassword)

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Fix ID type - try both Int and String
    let updated = null
    let lastErr = null
    
    // Try as number
    try {
      updated = await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: newPassword }
      })
    } catch (e1) {
      lastErr = e1.message
      console.log('Failed as Number:', e1.message)
      // Try as string
      try {
        updated = await prisma.user.update({
          where: { id: String(userId) },
          data: { password: newPassword }
        })
      } catch (e2) {
        lastErr = e2.message
        console.log('Failed as String:', e2.message)
        // Try passwordHash field name instead
        try {
          updated = await prisma.user.update({
            where: { id: Number(userId) },
            data: { passwordHash: newPassword }
          })
        } catch (e3) {
          try {
            updated = await prisma.user.update({
              where: { id: String(userId) },
              data: { passwordHash: newPassword }
            })
          } catch (e4) {
            return NextResponse.json({ error: `All attempts failed: ${lastErr} | ${e2.message} | ${e4.message}` }, { status: 500 })
          }
        }
      }
    }

    console.log('SUCCESS reset for', updated.username)
    return NextResponse.json({ success: true, username: updated.username })

  } catch (e) {
    console.error('RESET FINAL CRASH:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}