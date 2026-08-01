const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { username: 'Admin256' },
    update: {
      phone: '+256712345678',
      loginPassword: 'Admin652',
      transactionPassword: 'Admin652',
      gender: 'Male',
      countryCode: '+256',
      countryName: 'Uganda',
      referralCode: 'ADMIN256',
      inviteCode: '345678DI',
      isAdmin: true,

      // VIP / TASK - VIP 1
      vipId: 1,
      vipLevel: 1,
      currentSet: 1,
      setCompleted: 0,
      taskCompleted: 0,
      totalTasks: 40,

      // MONEY
      walletBalance: 5000,
      holdAmount: 0,
      bonus: 0,
      specialBonus: 0,
      todayProfit: 0,
      lastProfitReset: new Date(),
      creditScore: 100,

      // JSON ARRAYS
      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
    },
    create: {
      username: 'Admin256',
      phone: '+256712345678',
      loginPassword: 'Admin652',
      transactionPassword: 'Admin652',
      gender: 'Male',
      countryCode: '+256',
      countryName: 'Uganda',
      referralCode: 'ADMIN256',
      inviteCode: '345678DI',
      isAdmin: true,

      // VIP / TASK - VIP 1
      vipId: 1,
      vipLevel: 1,
      currentSet: 1,
      setCompleted: 0,
      taskCompleted: 0,
      totalTasks: 40,

      // MONEY
      walletBalance: 5000,
      holdAmount: 0,
      bonus: 0,
      specialBonus: 0,
      todayProfit: 0,
      lastProfitReset: new Date(),
      creditScore: 100,

      // JSON ARRAYS
      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
    }
  })
  console.log('✅ Admin256 ready - VIP 1 with $5000 balance')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })