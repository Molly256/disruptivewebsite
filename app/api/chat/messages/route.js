export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(req){
  try{
    const url = new URL(req.url)
    // FIX: accept both chatId (admin) and userId (widget)
    const chatId = url.searchParams.get('chatId')
    const userId = url.searchParams.get('userId')
    const id = String(chatId || userId || '').trim()
    
    if(!id) return Response.json([])

    // find chat by any type
    let chat = await prisma.chat.findUnique({ where: { id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { userId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { guestId: id } }).catch(()=>null)

    if(!chat) return Response.json([])

    // get messages
    const chatMsgs = await prisma.message.findMany({ 
      where: { chatId: chat.id }, 
      orderBy: { createdAt: 'asc' } 
    })

    // For user widget, also merge old contact messages if any
    const uid = chat.userId || chat.guestId || id
    const contactMsgs = await prisma.contactMessage.findMany({ 
      where: { userId: uid }, 
      orderBy: { createdAt: 'asc' } 
    }).catch(()=>[])

    const contactAsChat = contactMsgs.map(c=>({ 
      id: c.id, 
      text: c.message, 
      sender: 'user', 
      senderName: c.username, 
      senderRole: 'user', 
      status: 'delivered',
      timeString: new Date(c.createdAt).toLocaleTimeString(),
      createdAt: c.createdAt 
    }))
    
    const contactReplies = contactMsgs.filter(c=>c.reply).map(c=>({ 
      id: c.id+'_r', 
      text: c.reply, 
      sender: 'admin', 
      senderName: 'Support', 
      senderRole: 'admin',
      status: 'read',
      timeString: new Date(c.createdAt).toLocaleTimeString(),
      createdAt: new Date(new Date(c.createdAt).getTime()+1000) 
    }))

    const formattedChat = chatMsgs.map(m=>({ 
      id: m.id, 
      text: m.text, 
      sender: m.sender, 
      senderRole: m.sender === 'admin' ? 'admin' : 'user',
      senderName: m.senderName,
      status: m.status || 'delivered',
      timeString: m.timeString || new Date(m.createdAt).toLocaleTimeString(),
      createdAt: m.createdAt 
    }))

    const all = [...contactAsChat, ...contactReplies, ...formattedChat]
      .sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt))

    // FIX: return array directly for AdminChatModal, not {messages}
    // For backwards compat, widget can handle both
    return Response.json(all)
  }catch(e){
    console.error('messages error', e)
    return Response.json([], { status: 500 })
  }
}