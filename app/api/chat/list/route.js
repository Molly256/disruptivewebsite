export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(){
  try{
    const chats = await prisma.chat.findMany({ 
      orderBy: { updatedAt: 'desc' },
      take: 200
    })

    // Build list directly from Chat only (since /api/contact now creates Chat too)
    const list = chats.map(c=>({
      userId: c.userId || c.guestId,
      chatId: c.id, // real ID only
      username: c.displayName || c.guestName || 'User',
      lastMsg: c.lastMessage || '',
      lastTime: c.updatedAt,
      unread: c.unreadAdmin || 0,
      isGuest: !!c.isGuest,
      guestName: c.guestName
    }))

    return Response.json({ conversations: list })
  }catch(e){
    console.error(e)
    return Response.json({ conversations: [], error: e.message })
  }
}