export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { userId, username, text } = await req.json()
  if(!userId ||!text) return Response.json({error:'missing'},{status:400})
  const uid = String(userId)
  const isGuest = uid.startsWith('guest_')
  const displayName = username || (isGuest? uid : 'User')

  let chat = null
  if(isGuest){
    chat = await prisma.chat.findUnique({ where: { guestId: uid } })
  } else {
    chat = await prisma.chat.findFirst({ where: { userId: uid } })
  }

  if(!chat){
    chat = await prisma.chat.create({
      data: {
        userId: isGuest? null : uid,
        guestId: isGuest? uid : null,
        guestName: isGuest? displayName : null,
        displayName,
        isGuest,
        lastMessage: String(text).slice(0,200),
        unreadAdmin: 1
      }
    })
  } else {
    chat = await prisma.chat.update({
      where: { id: chat.id },
      data: { lastMessage: String(text).slice(0,200), displayName, updatedAt: new Date(), unreadAdmin: { increment: 1 } }
    })
  }

  const msg = await prisma.message.create({
    data: { chatId: chat.id, text: String(text), sender: 'user', senderName: displayName, timeString: new Date().toLocaleTimeString() }
  })

  return Response.json({ success: true, chat, message: msg })
}