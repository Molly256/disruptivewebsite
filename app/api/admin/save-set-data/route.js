import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipLevel, day, setNum, data } = await req.json()

    if (!vipLevel || !day || !setNum || !data) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const v = Number(vipLevel)
    const d = Number(day)
    const s = Number(setNum)

    // Save to DB - NOT to file
    const saved = await prisma.taskSetConfig.upsert({
      where: {
        vipLevel_day_setNum: {
          vipLevel: v,
          day: d,
          setNum: s
        }
      },
      update: {
        data: data
      },
      create: {
        vipLevel: v,
        day: d,
        setNum: s,
        data: data
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `VIP${v} Day${d} Set${s} saved to DB for ALL users`,
      saved
    })

  } catch (e) {
    console.error('SAVE DB ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}