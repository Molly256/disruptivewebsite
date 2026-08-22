import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { chatId } = await req.json()
  let chat = await prisma.chat.findUnique({ where: { id: chatId } }).catch(()=>null)
  if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: chatId } })
  if(!chat) return Response.json({ok:false})
  await prisma.chat.delete({ where:{id:chat.id} })
  return Response.json({ok:true})
}