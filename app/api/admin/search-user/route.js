import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export async function GET(req){
  try{
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    if(!q) return Response.json({error:'query required'},{status:400})
    
    const user = await prisma.user.findFirst({
      where:{
        OR:[
          { username: { equals: q, mode:'insensitive' } },
          { phone: { equals: q } },
          { username: { contains: q, mode:'insensitive' } },
          { phone: { contains: q } }
        ]
      },
      select:{
        id:true, username:true, phone:true, countryCode:true, countryName:true,
        vipLevel:true, walletBalance:true, holdAmount:true, createdAt:true
      }
    })
    if(!user) return Response.json({error:'User not found'},{status:404})
    return Response.json({ user })
  }catch(e){
    return Response.json({error:e.message},{status:500})
  }
}