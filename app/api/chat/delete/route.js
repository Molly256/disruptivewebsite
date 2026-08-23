export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { chatId, userId } = await req.json()
  const id = String(userId || chatId)
  if(!id) return Response.json({ok:false})
  try{
    let chat = await prisma.chat.findUnique({ where: { id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findFirst({ where: { userId: id } }).catch(()=>null)
    if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: id } }).catch(()=>null)
    if(chat){
      await prisma.message.deleteMany({ where: { chatId: chat.id } })
      await prisma.chat.delete({ where: { id: chat.id } })
    }
    await prisma.contactMessage.deleteMany({ where: { userId: id } }).catch(()=>{})
    await prisma.contactMessage.deleteMany({ where: { guestId: id } }).catch(()=>{})
    return Response.json({ok:true})
  }catch(e){ return Response.json({ok:false, error:e.message},{status:500}) }
}