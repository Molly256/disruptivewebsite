export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const body = await req.json()
    const userId = body.userId || body.chatId
    const conversationId = body.conversationId || body.chatId

    if(!userId && !conversationId){
      return Response.json({ success: true })
    }

    // 1. mark contact as read
    if(userId){
      await prisma.contactMessage.updateMany({ 
        where: { userId: String(userId) }, 
        data: { isRead: true } 
      }).catch(()=>{})
      await prisma.contactMessage.updateMany({ 
        where: { guestId: String(userId) }, 
        data: { isRead: true } 
      }).catch(()=>{})
    }

    // 2. mark chat as read - reset unread counters
    try{
      let chat = null
      if(conversationId){
        chat = await prisma.chat.findUnique({ where: { id: String(conversationId) } }).catch(()=>null)
        if(!chat) chat = await prisma.chat.findFirst({ where: { userId: String(conversationId) } }).catch(()=>null)
        if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: String(conversationId) } }).catch(()=>null)
      }
      if(!chat && userId){
        chat = await prisma.chat.findFirst({ where: { userId: String(userId) } }).catch(()=>null)
        if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: String(userId) } }).catch(()=>null)
      }

      if(chat){
        await prisma.chat.update({
          where: { id: chat.id },
          data: { unreadAdmin: 0, unreadUser: 0 }
        })
      }
    }catch(e){ console.error('read chat err', e.message) }

    return Response.json({ success: true })
  }catch(e){
    return Response.json({ error: e.message }, { status: 500 })
  }
}