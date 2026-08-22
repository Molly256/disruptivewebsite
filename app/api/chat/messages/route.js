import { prisma } from '@/lib/prisma'
export async function GET(req){
  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId')
  if(!chatId) return Response.json([])
  let chat = await prisma.chat.findUnique({ where: { id: chatId } }).catch(()=>null)
  if(!chat) chat = await prisma.chat.findUnique({ where: { guestId: chatId } })
  if(!chat) return Response.json([])
  const msgs = await prisma.message.findMany({ where:{chatId:chat.id}, orderBy:{createdAt:'asc'} })
  return Response.json(msgs)
}