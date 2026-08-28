export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(){
  try{
    const chats = await prisma.chat.findMany({ 
      orderBy: { updatedAt: 'desc' },
      take: 200
    })

    // Return in format AdminChatModal understands
    const list = chats.map(c=>({
      // new format (what modal needs)
      id: c.id,
      guestId: c.guestId || null,
      userId: c.userId || c.guestId || c.id,
      displayName: c.displayName || c.guestName || 'User',
      lastMessage: c.lastMessage || '',
      unreadAdmin: c.unreadAdmin || 0,
      unreadUser: c.unreadUser || 0,
      isGuest: !!c.isGuest,
      guestName: c.guestName || null,
      updatedAt: c.updatedAt,
      createdAt: c.createdAt,
      
      // old format (keep for backwards compat)
      chatId: c.id,
      username: c.displayName || c.guestName || 'User',
      lastMsg: c.lastMessage || '',
      lastTime: c.updatedAt,
      unread: c.unreadAdmin || 0,
    }))

    // Return array directly, not {conversations}
    return Response.json(list)
  }catch(e){
    console.error('list error', e)
    return Response.json([], { status: 500 })
  }
}