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
      inviteCode: '345678DI', 
      referredBy: null,
      isAdmin: true,

      // VIP / TASK - ADMIN CONTROLLED
      vipId: 1,
      vipLevel: 1,
      currentDay: 1,
      currentSet: 1,
      tasksInCurrentSet: 0,
      taskCompleted: 0,
      totalTasks: 40,

      // MONEY
      walletBalance: 5000,
      holdAmount: 0,
      freezeAmount: 0, 
      bonus: 0,
      specialBonus: 0,
      todayProfit: 0,
      lastProfitReset: new Date(),
      creditScore: 100,
      isRiskControlled: false,

      // BIND WALLET
      boundWallet: null,

      // TASK DATA
      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
      x10TaskNumbers: [],
    },
    create: {
      username: 'Admin256',
      phone: '+256712345678',
      loginPassword: 'Admin652',
      transactionPassword: 'Admin652',
      gender: 'Male',
      countryCode: '+256',
      countryName: 'Uganda',
      inviteCode: '345678DI',
      referredBy: null,
      isAdmin: true,

      vipId: 1,
      vipLevel: 1,
      currentDay: 1,
      currentSet: 1,
      tasksInCurrentSet: 0,
      taskCompleted: 0,
      totalTasks: 40,

      walletBalance: 5000,
      holdAmount: 0,
      freezeAmount: 0,
      bonus: 0,
      specialBonus: 0,
      todayProfit: 0,
      lastProfitReset: new Date(),
      creditScore: 100,
      isRiskControlled: false,

      boundWallet: null,

      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
      x10TaskNumbers: [],
    }
  })

  console.log('✅ Seed complete: Admin256 ready')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })