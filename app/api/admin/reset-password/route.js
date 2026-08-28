import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, newPassword, adminId } = await req.json()

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Missing userId or newPassword' }, { status: 400 })
    }

    // FIX: ensure id is correct type (Int vs String)
    const idToUse = isNaN(Number(userId)) ? userId : Number(userId)

    const user = await prisma.user.update({ 
      where: { id: idToUse }, 
      data: { password: newPassword } // plain text as you wanted
    })

    // FIX: don't let log break the reset
    try {
      if (adminId) {
        const adminIdToUse = isNaN(Number(adminId)) ? adminId : Number(adminId)
        await prisma.adminLog.create({ 
          data: { adminId: adminIdToUse, action: `Reset password for ${user.username}` }
        })
      }
    } catch (logErr) {
      console.log('adminLog failed but password ok:', logErr.message)
    }

    return NextResponse.json({ success: true, username: user.username })

  } catch (e) { 
    console.error('RESET PASSWORD ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}