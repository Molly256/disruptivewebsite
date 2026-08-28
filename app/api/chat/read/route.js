export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const body = await req.json()
    const { chatId, userId, conversationId, who } = body
    const id = String(chatId || conversationId || userId || '').trim()
    
    if(!id) return Response.json({ success: true })

    // 1. mark contactMessage as read (old table)
    if(userId || chatId){
      const uid = String(userId || chatId)
      await prisma.contactMessage.updateMany({ 
        where: { userId: uid }, 
        data: { isRead: true } 
      }).catch(()=>{})
      await prisma.contactMessage.updateMany({ 
        where: { guestId: uid }, 
        data: { isRead: true } 
      }).catch(()=>{})
    }

    // 2. find chat
    let chat = await prisma.chat.findUnique({ where: { id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { userId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { guestId: id } }).catch(()=>null)

    if(!chat) return Response.json({ success: true })

    // 3. reset only the reader's counter - FIX
    if(who === 'admin'){
      await prisma.chat.update({ where: { id: chat.id }, data: { unreadAdmin: 0 } })
      await prisma.message.updateMany({ 
        where: { chatId: chat.id, sender: 'user' }, 
        data: { status: 'read' } 
      }).catch(()=>{})
    } else if(who === 'user'){
      await prisma.chat.update({ where: { id: chat.id }, data: { unreadUser: 0 } })
      await prisma.message.updateMany({ 
        where: { chatId: chat.id, sender: 'admin' }, 
        data: { status: 'read' } 
      }).catch(()=>{})
    } else {
      // backwards compat: if no who sent, reset both (for contact page)
      await prisma.chat.update({ where: { id: chat.id }, data: { unreadAdmin: 0, unreadUser: 0 } })
    }

    return Response.json({ success: true })
  }catch(e){
    console.error('read error', e)
    return Response.json({ success: true }) // don't break polling
  }
}