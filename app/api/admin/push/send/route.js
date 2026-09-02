import { PrismaClient } from '@prisma/client'
import webpush from 'web-push'

const prisma = new PrismaClient()

if(process.env.VAPID_PUBLIC_KEY){
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function sendPushToAdmin(adminId, title, body){
  try{
    const subs = await prisma.adminPushSubscription.findMany({
      where:{ adminId: adminId || 'admin' }
    })
    const payload = JSON.stringify({ title, body, url: '/admin' })
    for(const s of subs){
      try{
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys:{ p256dh: s.p256dh, auth: s.auth } },
          payload
        )
      }catch(err){
        if(err.statusCode === 410) {
          await prisma.adminPushSubscription.delete({where:{endpoint:s.endpoint}}).catch(()=>{})
        }
      }
    }
  }catch(e){ console.log('push send error', e) }
}

export async function POST(req){
  const { adminId, title, body } = await req.json()
  await sendPushToAdmin(adminId, title, body)
  return Response.json({ok:true})
}