import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try { // ADD: catch crashes
    const { userId, adminId } = await req.json()
    
    if(!userId || !adminId) // ADD: validation
      return NextResponse.json({ error: 'Missing userId or adminId' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if(!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if(user.currentSet >= 3) return NextResponse.json({ error: 'Cannot reset Set 3. Use Next Day' }, { status: 400 })

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        currentSet: user.currentSet + 1,
        tasksInCurrentSet: 0
      }
    })

    await prisma.adminLog.create({ 
      data: { adminId, action: `Reset Set for ${user.username} to Set ${updated.currentSet}` } 
    })
    
    return NextResponse.json({ success: true, user: updated }) // ADD: success flag
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}