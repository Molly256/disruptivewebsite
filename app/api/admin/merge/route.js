import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { adminPhone, target, vipSet, photoIds } = await req.json()

    const admin = await prisma.user.findUnique({ where: { phone: adminPhone } })
    if (!admin?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const user = await prisma.user.findFirst({ where: { OR: [{ username: target }, { phone: target }] } })

    await prisma.taskMerge.create({
      data: {
        userId: user.id,
        vipSet,
        photoIds
      }
    })

    return NextResponse.json({ success: true, message: 'Photos merged' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}