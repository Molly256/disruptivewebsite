import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req){
  try{
    const { adminId, sub } = await req.json()
    if(!sub?.endpoint) return Response.json({error:'no endpoint'},{status:400})

    await prisma.adminPushSubscription.upsert({
      where:{ endpoint: sub.endpoint },
      update:{
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        adminId: adminId || 'admin'
      },
      create:{
        adminId: adminId || 'admin',
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth
      }
    })

    return Response.json({ok:true})
  }catch(e){
    return Response.json({error: e.message},{status:500})
  }
}