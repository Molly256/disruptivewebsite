export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import webpush from 'web-push'

if(process.env.VAPID_PUBLIC_KEY){
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

async function sendPushToAdmin(title, body){
  try{
    const subs = await prisma.adminPushSubscription.findMany()
    const payload = JSON.stringify({ title, body })
    for(const s of subs){
      try{
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys:{ p256dh: s.p256dh, auth: s.auth } },
          payload
        )
      }catch(err){
        if(err.statusCode === 410) {
          await prisma.adminPushSubscription.delete({where:{endpoint:s.endpoint}}).catch(()=>{})
        }
      }
    }
  }catch(e){ console.log('push error', e) }
}

export async function POST(req){
  try{
    const body = await req.json()
    // FIX: accept all params from both widget and admin modal
    const { chatId, userId, text, sender, senderName, username, isGuest, image } = body
    
    const msgText = String(text || '').slice(0,2000).trim()
    if(!msgText && !image) return Response.json({error:'missing text'},{status:400})
    
    const id = String(chatId || userId || '').trim()
    if(!id) return Response.json({error:'missing id'},{status:400})

    const isAdmin = sender === 'admin'
    const uname = String(senderName || username || (isAdmin ? 'Support' : 'User')).slice(0,50)
    const isGuestFlag = Boolean(isGuest) || id.startsWith('guest_')

    // find chat
    let chat = await prisma.chat.findUnique({ where: { id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { userId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { guestId: id } }).catch(()=>null)

    // if widget sends first message and no chat yet (shouldn't happen because contact creates it, but safe)
    if(!chat){
      chat = await prisma.chat.create({
        data: {
          userId: isGuestFlag ? null : id,
          guestId: isGuestFlag ? id : null,
          guestName: isGuestFlag ? uname : null,
          displayName: uname,
          isGuest: isGuestFlag,
          lastMessage: msgText.slice(0,200),
          unreadAdmin: isAdmin ? 0 : 1,
          unreadUser: isAdmin ? 1 : 0
        }
      })
    } else {
      // update chat preview + unread counters correctly
      chat = await prisma.chat.update({
        where: { id: chat.id },
        data: { 
          lastMessage: msgText.slice(0,200), 
          displayName: isAdmin ? chat.displayName : uname,
          updatedAt: new Date(), 
          unreadAdmin: isAdmin ? 0 : { increment: 1 },
          unreadUser: isAdmin ? { increment: 1 } : 0
        }
      })
    }

    // save message with correct role
    const msg = await prisma.message.create({
      data: { 
        chatId: chat.id, 
        text: msgText || '📷 Image', 
        sender: isAdmin ? 'admin' : 'user', 
        senderRole: isAdmin ? 'admin' : 'user',
        senderName: uname,
        image: image || null,
        status: 'delivered',
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })

    // === LOUD NOTIFICATION FROM YOUR APP ONLY - when user sends ===
    if(!isAdmin){
      // don't await - fire and forget so message sends fast
      sendPushToAdmin(`New message from ${uname} 🔔`, msgText.slice(0,80))
    }

    return Response.json({ success: true, chat, message: msg })
  }catch(e){
    console.error('send error', e)
    return Response.json({error:e.message},{status:500})
  }
}