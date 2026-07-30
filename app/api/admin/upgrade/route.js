import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const vipPrices = { 1:100, 2:500, 3:1600, 4:5500, 5:10000 }
const vipTasks = { 1:40, 2:45, 3:50, 4:55, 5:60 }

export async function POST(req) {
  try {
    const { adminPhone, target, newVipId } = await req.json()

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const user = await prisma.user.findFirst({ where: { OR: [{ username: target }, { phone: target }] } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { vipLevel: `VIP${newVipId}`, vipId: newVipId }
    })

    const price = vipPrices[newVipId]
    const tasks = vipTasks[newVipId]
    const canUnlock = user.totalBalance >= price

    return NextResponse.json({
      success: true,
      user: updated,
      message: canUnlock
       ? `Upgraded to VIP${newVipId}. ${tasks} tasks unlocked`
        : `Upgraded. Deposit $${price} to unlock ${tasks} tasks`
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}