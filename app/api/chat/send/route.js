export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const body = await req.json()
    // FIX: accept all params from both widget and admin modal
    const { chatId, userId, text, sender, senderName, username, isGuest } = body
    
    const msgText = String(text || '').slice(0,2000).trim()
    if(!msgText) return Response.json({error:'missing text'},{status:400})
    
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
        text: msgText, 
        sender: isAdmin ? 'admin' : 'user', 
        senderRole: isAdmin ? 'admin' : 'user',
        senderName: uname,
        status: 'delivered',
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })

    return Response.json({ success: true, chat, message: msg })
  }catch(e){
    console.error('send error', e)
    return Response.json({error:e.message},{status:500})
  }
}