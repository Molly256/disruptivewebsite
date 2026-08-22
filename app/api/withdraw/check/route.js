import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { userId, username, phone } = await req.json()

    let user = null

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isRiskControlled: true }
      })
    } else if (username) {
      user = await prisma.user.findFirst({
        where: { username: username },
        select: { isRiskControlled: true }
      })
    } else if (phone) {
      user = await prisma.user.findFirst({
        where: { phone: phone },
        select: { isRiskControlled: true }
      })
    }

    if (!user) {
      return Response.json({ blocked: false })
    }

    if (user.isRiskControlled) {
      return Response.json({
        blocked: true,
        message: 'Your account is under risk control please go to customer service now.'
      })
    }

    return Response.json({ blocked: false })

  } catch (e) {
    return Response.json({ blocked: false, error: e.message })
  }
}