import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateInviteCode(phone) {
  const last6 = phone.slice(-6).padStart(6, '0') // take last 6 digits
  return `${last6}DI`
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { action } = body

    // REGISTER
    if (action === 'register') {
      const {
        username,
        countryName,
        countryCode,
        phone,
        loginPassword,
        transactionPassword,
        gender,
        invitedBy // CODE THEY TYPED - WHO INVITED THEM
      } = body

      if (!username || !phone || !loginPassword || !transactionPassword || !gender) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      if (!countryCode) {
        return NextResponse.json({ error: 'Country code missing' }, { status: 400 })
      }

      if (!invitedBy) {
        return NextResponse.json({ error: 'Invite code is required' }, { status: 400 })
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ username }, { phone }] }
      })

      if (existingUser) {
        return NextResponse.json({ error: 'Username or phone already exists' }, { status: 400 })
      }

      // check if inviteCode exists in DB
      const inviter = await prisma.user.findFirst({
        where: { inviteCode: invitedBy }
      })
      if (!inviter) {
        return NextResponse.json({ error: 'Invalid Invite Code' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          username,
          phone,
          countryCode,
          countryName,
          loginPassword,
          transactionPassword,
          gender,
          inviteCode: generateInviteCode(phone), // NOW = last6 + DI
          referredBy: invitedBy, // WHO INVITED THEM

          vipId: 1,
          vipLevel: 1,
          currentSet: 1,
          setCompleted: 0,
          taskCompleted: 0,

          walletBalance: 0,
          holdAmount: 0,
          bonus: 0,
          specialBonus: 0,
          todayProfit: 0,
          lastProfitReset: new Date(),
          creditScore: 100,

          currentTaskProducts: [],
          activeProducts: [],
          completedProducts: [],
          isAdmin: false
        }
      })

      return NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, inviteCode: user.inviteCode }
      }, { status: 201 })
    }

    // LOGIN
    if (action === 'login') {
      const { loginType, username, phone, countryCode, password } = body

      let user = null

      if (loginType === 'username') {
        if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
        user = await prisma.user.findUnique({ where: { username } })
      } else {
        if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })
        
        user = await prisma.user.findFirst({ where: { phone } })
      }

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      if (user.loginPassword !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const res = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          gender: user.gender,
          vipLevel: user.vipLevel,
          walletBalance: user.walletBalance,
          holdAmount: user.holdAmount,
          specialBonus: user.specialBonus,
          todayProfit: user.todayProfit,
          lastProfitReset: user.lastProfitReset,
          currentTaskProducts: user.currentTaskProducts,
          taskCompleted: user.taskCompleted,
          currentSet: user.currentSet,
          inviteCode: user.inviteCode // send to profile for sharing
        }
      })

      res.cookies.set('session', String(user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })

      return res
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (e) {
    console.error("AUTH ERROR:", e)
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Invite code already exists. Please contact support.' }, { status: 400 })
    }
    return NextResponse.json({ error: e.message || 'Request failed' }, { status: 500 })
  }
}