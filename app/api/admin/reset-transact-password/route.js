import { prisma } from '@/lib/prisma'

export async function POST(req){
  try{
    const { userId, newPassword, adminId } = await req.json()
    if(!userId || !newPassword) return Response.json({error:'missing data'},{status:400})
    
    await prisma.user.update({
      where:{ id: String(userId) },
      data:{ transactionPassword: String(newPassword) }
    })
    
    if(adminId){
      await prisma.adminLog.create({
        data:{
          adminId: String(adminId),
          action: 'RESET_TRANSACT_PASSWORD',
          targetUserId: String(userId),
          details: { newPasswordLength: newPassword.length }
        }
      }).catch(()=>{})
    }
    
    return Response.json({ ok:true })
  }catch(e){
    return Response.json({error:e.message},{status:500})
  }
}