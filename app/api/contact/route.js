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
    const text = String(message).slice(0,2000)

    const contact = await prisma.contactMessage.create({
      data: {
        userId: uid,
        guestId: isGuestFlag ? uid : null,
        username: uname,
        email: email || '',
        message: text,
        isGuest: isGuestFlag,
        isRead: false,
        status: 'pending'
      }
    })

    // create chat
    let chat = null
    if(isGuestFlag){
      chat = await prisma.chat.findFirst({ where: { guestId: uid } })
    } else {
      chat = await prisma.chat.findFirst({ where: { userId: uid } })
    }

    if(!chat){
      chat = await prisma.chat.create({
        data: {
          userId: isGuestFlag ? null : uid,
          guestId: isGuestFlag ? uid : null,
          guestName: isGuestFlag ? uname : null,
          displayName: uname,
          isGuest: isGuestFlag,
          lastMessage: text.slice(0,200),
          unreadAdmin: 1,
          unreadUser: 0
        }
      })
    } else {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          lastMessage: text.slice(0,200),
          displayName: uname,
          updatedAt: new Date(),
          unreadAdmin: { increment: 1 }
        }
      })
    }

    await prisma.message.create({
      data: {
        chatId: chat.id,
        text: text,
        sender: 'user',
        senderRole: 'user', // <-- THIS WAS MISSING, frontend checks this
        senderName: uname,
        status: 'delivered',
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })

    return Response.json({ success: true, contact, chatId: chat.id })
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