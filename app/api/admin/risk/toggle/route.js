import { prisma } from '@/lib/prisma'
export async function POST(req){
  const { userId, value, adminId } = await req.json()
  const updated = await prisma.user.update({ where:{id:userId}, data:{ isRiskControlled: value } })
  await prisma.adminLog.create({ data:{ adminId, action: value?'risk_control_on':'risk_control_off', targetUserId:userId, details:{ username: updated.username } } }).catch(()=>{})
  return Response.json({success:true, isRiskControlled: updated.isRiskControlled})
}