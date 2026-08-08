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
      inviteCode: '345678DI', // this is their own code
      referredBy: null, // who invited admin = null
      isAdmin: true,

      // VIP / TASK - VIP 1
      vipId: 1,
      vipLevel: 1,
      setsCompleted: 0, // 0 = Set1 not done yet
      tasksInCurrentSet: 0, // 0/40
      taskCompleted: 0,
      totalTasks: 40,

      // MONEY
      walletBalance: 5000,
      holdAmount: 0,
      freezeAmount: 0, // <-- ADDED
      bonus: 0,
      specialBonus: 0,
      todayProfit: 0,
      lastProfitReset: new Date(),
      creditScore: 100,

      // JSON ARRAYS
      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
      mergedTasks: [], // <-- ADDED
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

      // VIP / TASK - VIP 1
      vipId: 1,
      vipLevel: 1,
      setsCompleted: 0,
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

      // JSON ARRAYS
      currentTaskProducts: [],
      activeProducts: [],
      completedProducts: [],
      mergedTasks: [],
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