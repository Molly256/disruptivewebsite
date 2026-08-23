export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
export async function GET(req){
  const userId = new URL(req.url).searchParams.get('userId')
  if(!userId) return Response.json({ messages: [] })
  const uid = String(userId)
  const isGuest = uid.startsWith('guest_')

  let chat = isGuest? await prisma.chat.findUnique({ where: { guestId: uid } }) : await prisma.chat.findFirst({ where: { userId: uid } })

  let chatMsgs = []
  if(chat){
    chatMsgs = await prisma.message.findMany({ where: { chatId: chat.id }, orderBy: { createdAt: 'asc' } })
  }

  const contactMsgs = await prisma.contactMessage.findMany({ where: { userId: uid }, orderBy: { createdAt: 'asc' } }).catch(()=>[])

  const contactAsChat = contactMsgs.map(c=>({ id: c.id, text: c.message, sender: 'user', senderName: c.username, senderRole: 'user', createdAt: c.createdAt }))
  const contactReplies = contactMsgs.filter(c=>c.reply).map(c=>({ id: c.id+'_r', text: c.reply, sender: 'admin', senderName: 'Support', senderRole: 'admin', createdAt: new Date(new Date(c.createdAt).getTime()+1000) }))
  const formattedChat = chatMsgs.map(m=>({ id: m.id, text: m.text, sender: m.sender, senderName: m.senderName, senderRole: m.sender === 'user'? 'user' : 'admin', createdAt: m.createdAt }))

  const all = [...contactAsChat,...contactReplies,...formattedChat].sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt))

  return Response.json({ messages: all, chatId: chat?.id || null })
}