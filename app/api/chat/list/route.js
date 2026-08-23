export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
export async function GET(){
  const chats = await prisma.chat.findMany({ orderBy: { updatedAt: 'desc' } })
  // also include contact-only users
  const contacts = await prisma.contactMessage.findMany({ distinct: ['userId'], select: { userId: true, username: true, message: true, createdAt: true } }).catch(()=>[])

  const map = new Map()
  chats.forEach(c=> map.set(c.userId || c.guestId, c))

  for(const co of contacts){
    if(!co.userId || map.has(co.userId)) continue
    map.set(co.userId, { id: 'contact_'+co.userId, userId: co.userId, guestId: co.userId.startsWith('guest_')? co.userId : null, displayName: co.username, lastMessage: co.message, updatedAt: co.createdAt, unreadAdmin: 1, isGuest: co.userId.startsWith('guest_') })
  }

  const list = Array.from(map.values()).map(c=>({
    userId: c.userId || c.guestId,
    chatId: c.id,
    username: c.displayName || c.guestName,
    lastMsg: c.lastMessage,
    lastTime: c.updatedAt,
    unread: c.unreadAdmin || 0,
    isGuest: c.isGuest
  }))

  return Response.json({ conversations: list })
}