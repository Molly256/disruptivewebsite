import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const { userId, newScore, action, adminId } = await req.json()
    if(newScore < 0) newScore = 0
    if(newScore > 100) newScore = 100

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { creditScore: newScore }
    })

    // log
    if(adminId){
      await prisma.adminLog.create({
        data: {
          adminId,
          action: action === 'decrease'? 'decrease_credit' : 'increase_credit',
          targetUserId: userId,
          details: { newScore, username: updated.username }
        }
      }).catch(()=>{})
    }

    return Response.json({success:true, creditScore: updated.creditScore})
  }catch(e){
    return Response.json({error:e.message},{status:500})
  }
}