import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE the countryCodes object - frontend sends the code

export async function POST(req) {
  try {
    const body = await req.json()
    const { action } = body

    // REGISTER
    if (action === 'register') {
      const {
        username,
        selectedCountryName,
        countryCode, // <-- use this from frontend
        fullPhone,   // <-- use this from frontend
        phone,
        loginPassword,
        transactionPassword,
        gender,
        inviteCode
      } = body

      if (!username ||!phone ||!loginPassword ||!transactionPassword ||!gender) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // No lookup needed - frontend already sent correct code
      if (!countryCode || !fullPhone) {
        return NextResponse.json({ error: 'Country code missing' }, { status: 400 })
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ username }, { phone: fullPhone }] }
      })

      if (existingUser) {
        return NextResponse.json({ error: 'Username or phone already exists' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          username,
          phone: fullPhone,
          countryCode,
          countryName: selectedCountryName,
          loginPassword,
          transactionPassword,
          gender,
          inviteCode: inviteCode || null
        }
      })

      return NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username }
      }, { status: 201 })
    }

    // LOGIN
    if (action === 'login') {
      const { loginType, username, phone, selectedCountryName, countryCode, fullPhone, password } = body

      let user = null

      if (loginType === 'username') {
        if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
        user = await prisma.user.findUnique({ where: { username } })
      } else {
        if (!phone && !fullPhone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })
        
        // Use fullPhone from frontend if sent, else build it
        const phoneToCheck = fullPhone || (countryCode + phone)
        
        user = await prisma.user.findUnique({ where: { phone: phoneToCheck } })
      }

      if (!user || user.loginPassword!== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          gender: user.gender
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}