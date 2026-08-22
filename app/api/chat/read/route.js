import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { chatId, who } = await req.json()
  let chat = await prisma.chat.findUnique({ where: { id: chatId } }).catch(()=>null)
  if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: chatId } })
  if(!chat) return Response.json({ok:false})
  await prisma.chat.update({ where:{id:chat.id}, data:{ [who==='admin'?'unreadAdmin':'unreadUser']:0 } })
  if(who==='admin') await prisma.message.updateMany({ where:{chatId:chat.id,sender:'user'}, data:{status:'read'} })
  return Response.json({ok:true})
}