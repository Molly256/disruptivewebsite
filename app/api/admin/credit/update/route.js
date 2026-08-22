export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const { userId, newScore, action, adminId } = await req.json()
    let score = Number(newScore)
    if(score < 0) score = 0
    if(score > 100) score = 100

    const updated = await prisma.user.update({
      where: { id: String(userId) },
      data: { creditScore: score }
    })

    // log
    if(adminId){
      await prisma.adminLog.create({
        data: {
          adminId: String(adminId),
          action: action === 'decrease'? 'decrease_credit' : 'increase_credit',
          targetUserId: String(userId),
          details: { newScore: score, username: updated.username }
        }
      }).catch(()=>{})
    }

    return Response.json({success:true, creditScore: updated.creditScore})
  }catch(e){
    console.error(e)
    return Response.json({error:e.message},{status:500})
  }
}