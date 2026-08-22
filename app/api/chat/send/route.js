import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { chatId, text, sender, senderName, isGuest } = await req.json()
  if(!text?.trim()) return Response.json({error:'empty'},{status:400})
  let chat = await prisma.chat.findUnique({ where: { id: chatId } }).catch(()=>null)
  if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: chatId } })
  if(!chat){
    const isGuestChat = chatId.startsWith('guest_')
    chat = await prisma.chat.create({
      data: {
        guestId: isGuestChat?chatId:null,
        userId: !isGuestChat?chatId:null,
        guestName: isGuest?senderName:null,
        displayName: senderName,
        isGuest: !!isGuestChat||!!isGuest,
        lastMessage: text,
        unreadAdmin: sender==='user'?1:0,
        unreadUser: sender==='admin'?1:0,
      }
    })
  }
  const msg = await prisma.message.create({
    data: { chatId: chat.id, text: text.trim(), sender, senderName, status:'delivered', timeString: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }
  })
  await prisma.chat.update({
    where:{id:chat.id},
    data:{ lastMessage:text.trim(), displayName: sender==='user'?senderName:chat.displayName, updatedAt:new Date(), ...(sender==='user'?{unreadAdmin:{increment:1}}:{unreadUser:{increment:1}}) }
  })
  return Response.json({ success:true, message:msg, chatId:chat.id })
}