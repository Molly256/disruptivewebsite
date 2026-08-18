import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ADMIN SENDS NOTIFICATION
export async function POST(req) {
  try {
    const { userId, message, adminId } = await req.json()
    if(!userId || !message || !adminId) 
      return NextResponse.json({ error: 'userId, message, adminId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if(!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const notif = await prisma.notification.create({ 
      data: { 
        userId, 
        message, 
        isRead: false 
      } 
    })

    await prisma.adminLog.create({ 
      data: { 
        adminId, 
        action: `Sent notification to ${user.username}: "${message}"` 
      }
    })
    
    return NextResponse.json({ success: true, notification: notif })
  } catch (e) { 
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 }) 
  }
}