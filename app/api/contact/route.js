export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const { userId, username, email, message, isGuest } = await req.json()
    if(!userId || !message) return Response.json({error:'missing'},{status:400})

    const uid = String(userId)
    const isGuestFlag = Boolean(isGuest) || uid.startsWith('guest_')
    const uname = (username || (isGuestFlag ? `Guest-${uid.slice(-4)}` : 'User')).slice(0,50)
    const text = String(message).slice(0,2000)
    if(!text.trim()) return Response.json({error:'empty message'},{status:400})

    // 1. find chat - use unique where possible
    let chat = null
    if(isGuestFlag){
      chat = await prisma.chat.findUnique({ where: { guestId: uid } }).catch(()=>null)
      if(!chat) chat = await prisma.chat.findFirst({ where: { guestId: uid } }).catch(()=>null)
    } else {
      chat = await prisma.chat.findFirst({ where: { userId: uid } }).catch(()=>null)
    }

    // 2. create or update chat -> this is what admin list reads
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
      chat = await prisma.chat.update({
        where: { id: chat.id },
        data: {
          lastMessage: text.slice(0,200),
          displayName: uname,
          guestName: isGuestFlag ? uname : chat.guestName,
          updatedAt: new Date(),
          unreadAdmin: { increment: 1 }
        }
      })
    }

    // 3. save as chat message - MUST have senderRole for frontend
    await prisma.message.create({
      data: {
        chatId: chat.id,
        text,
        sender: 'user',
        senderRole: 'user',
        senderName: uname,
        status: 'delivered',
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })

    // 4. optional log in contactMessage (don't fail if table missing fields)
    await prisma.contactMessage.create({
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
    }).catch(()=>{})

    return Response.json({ success: true, chatId: chat.id })
  }catch(e){
    console.error('contact error', e)
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