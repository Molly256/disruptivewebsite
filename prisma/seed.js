const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      username: 'Admin256',
      phone: '+256712345678',
      loginPassword: 'Admin652',
      transactionPassword: 'Admin652',
      gender: 'Male',
      countryCode: '+256',
      countryName: 'Uganda',
      referralCode: '678DI',
      isAdmin: true,
      vipId: 5,
      vipLevel: 'VIP5',
      totalBalance: 9999
    }
  })
}

main()