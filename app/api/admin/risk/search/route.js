import { prisma } from '@/lib/prisma'
export async function GET(req){
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if(!q) return Response.json({error:'empty'},{status:400})
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: q }, { phone: q }, { username: { contains: q, mode:'insensitive' } }, { phone: { contains: q } }] },
    select: { id:true, username:true, phone:true, vipLevel:true, walletBalance:true, isRiskControlled:true }
  })
  if(!user) return Response.json({found:false})
  return Response.json({found:true, user})
}