import { prisma } from '@/lib/prisma'
export async function GET(){
  const chats = await prisma.chat.findMany({ orderBy:{updatedAt:'desc'} })
  return Response.json(chats)
}