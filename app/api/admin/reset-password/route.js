import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId, newPassword } = await req.json()
    if (!userId || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Load prisma both ways
    const mod = await import('@/lib/prisma')
    const prisma = mod.prisma || mod.default
    if (!prisma?.user) return NextResponse.json({ error: `prisma import wrong. Found keys: ${Object.keys(mod).join(',')}` }, { status: 500 })

    // Find correct id type
    let user = await prisma.user.findFirst({ where: { id: Number(userId) } }).catch(()=>null)
    if (!user) user = await prisma.user.findFirst({ where: { id: String(userId) } }).catch(()=>null)
    if (!user) return NextResponse.json({ error: `User ${userId} not found` }, { status: 404 })

    // Update - try both field names
    try {
      await prisma.user.update({ where: { id: user.id }, data: { password: newPassword } })
    } catch {
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newPassword } })
    }

    return NextResponse.json({ success: true, username: user.username })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}