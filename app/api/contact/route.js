export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const body = await req.json()
    const { userId, username, email, message, isGuest } = body

    if(!userId || !message) return Response.json({error:'missing'},{status:400})

    const uid = String(userId)
    const isGuestFlag = isGuest || uid.startsWith('guest_')
    const uname = username || (isGuestFlag ? `Guest-${uid.slice(-4)}` : 'User')

    // 1. Save to contact table - this is what chat/list will pull
    const contact = await prisma.contactMessage.create({
      data: {
        userId: uid,
        guestId: isGuestFlag ? uid : null,
        username: uname,
        email: email || '',
        message: String(message).slice(0,2000),
        isGuest: isGuestFlag,
        isRead: false
      }
    })

    // 2. ALSO create/update Chat so admin Chat inbox pulls it
    // This is the key: Chat must pull from Contact
    try{
      let chat = null
      if(isGuestFlag){
        chat = await prisma.chat.findUnique({ where: { guestId: uid } }).catch(()=>null)
      } else {
        chat = await prisma.chat.findFirst({ where: { userId: uid } }).catch(()=>null)
      }

      if(!chat){
        chat = await prisma.chat.create({
          data: {
            userId: isGuestFlag ? null : uid,
            guestId: isGuestFlag ? uid : null,
            guestName: isGuestFlag ? uname : null,
            displayName: uname, // real username for logged, SwiftFox-4821 for guest
            isGuest: isGuestFlag,
            lastMessage: String(message).slice(0,200),
            unreadAdmin: 1,
            unreadUser: 0
          }
        })
      } else {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            lastMessage: String(message).slice(0,200),
            displayName: uname,
            updatedAt: new Date(),
            unreadAdmin: { increment: 1 }
          }
        })
      }

      // also create Message so it appears in chat thread
      await prisma.message.create({
        data: {
          chatId: chat.id,
          text: String(message).slice(0,2000),
          sender: 'user',
          senderName: uname,
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      })
    }catch(e){ 
      console.error('chat upsert err', e.message) 
    }

    return Response.json({ success: true, contact })
  }catch(e){
    console.error(e)
    return Response.json({error:e.message},{status:500})
  }
}

export async function GET(){
  try{
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    return Response.json({ messages })
  }catch(e){
    return Response.json({ messages: [], error: e.message })
  }
}