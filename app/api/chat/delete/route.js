export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const { chatId, userId } = await req.json()
    const id = String(chatId || userId || '').trim()
    if(!id) return Response.json({ ok: false, error: 'missing id' }, { status: 400 })

    // find chat by any id type
    let chat = await prisma.chat.findUnique({ where: { id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { userId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { guestId: id } }).catch(()=>null)

    if(chat){
      // delete messages first (FK constraint)
      await prisma.message.deleteMany({ where: { chatId: chat.id } })
      await prisma.chat.delete({ where: { id: chat.id } })
      
      // clean contact logs too
      await prisma.contactMessage.deleteMany({ where: { userId: chat.userId || id } }).catch(()=>{})
      if(chat.guestId){
        await prisma.contactMessage.deleteMany({ where: { guestId: chat.guestId } }).catch(()=>{})
      }
    } else {
      // no chat found, still try to clean contact messages by id directly
      await prisma.contactMessage.deleteMany({ where: { userId: id } }).catch(()=>{})
      await prisma.contactMessage.deleteMany({ where: { guestId: id } }).catch(()=>{})
    }

    return Response.json({ ok: true })
  }catch(e){
    console.error('delete error', e)
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}