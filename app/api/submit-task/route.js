export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 },
 2: { tasksPerSet: 60, totalSets: 2, profit: 0.01 },
 3: { tasksPerSet: 80, totalSets: 2, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 2, profit: 0.02 },
 5: { tasksPerSet: 120, totalSets: 2, profit: 0.025 },
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const userTaskProducts = user.currentTaskProducts || []
    if (userTaskProducts.length === 0) return NextResponse.json({ error: 'No active task' }, { status: 400 })

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    
    // DETECT MERGED TASK LAYER: If there are 2 or more products, activate the 10x multiplier!
    const isMergedTask = userTaskProducts.length > 1
    const baseProfitRate = config.profit
    const activeProfitRate = isMergedTask ? (baseProfitRate * 10) : baseProfitRate

    const currentSetNumber = (user.setsCompleted || 0) + 1
    const vipSetLabel = `vip${user.vipLevel}set${currentSetNumber}`.toLowerCase()

    // 1. Fetch real price overrides from master inventory table
    const masterPatch = await prisma.taskMerge.findFirst({
      where: { vipSet: vipSetLabel, status: 'system_template' }
    })

    const masterPairs = masterPatch 
      ? (typeof masterPatch.pairs === 'string' ? JSON.parse(masterPatch.pairs) : masterPatch.pairs)
      : []

    // 2. Map through products and apply the 10x multiplier if active
    const enrichedProducts = userTaskProducts.map(ut => {
      const match = masterPairs.find(m => m.taskOrder === ut.taskOrder)
      const basePrice = match ? parseFloat(match.price) : (user.vipLevel === 2 ? 200.00 : 100.00)
      const baseName = match ? match.name : `Premium Product ${ut.taskOrder}`
      
      return {
        id: ut.taskOrder,
        taskOrder: ut.taskOrder,
        price: basePrice,
        name: baseName,
        // E.g., VIP1: $50 * (0.005 * 10) = $50 * 0.05 = $2.50 profit per product!
        profit: basePrice * activeProfitRate
      }
    })

    // Sum up cumulative task payouts safely
    const totalPrice = enrichedProducts.reduce((sum, p) => sum + p.price, 0)
    const totalProfit = enrichedProducts.reduce((sum, p) => sum + p.profit, 0)
    const totalReserve = totalPrice + totalProfit
    const tasksCompletedInThisSubmit = enrichedProducts.length

    const currentIndex = user.tasksInCurrentSet || 0
    const nextTaskCount = currentIndex + tasksCompletedInThisSubmit
    const isSetComplete = nextTaskCount >= config.tasksPerSet

    const tx = [
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: currentIndex }, // Atomic lock guard
        data: {
          walletBalance: { increment: totalReserve },
          holdAmount: 0.00,
          todayProfit: { increment: totalProfit },
          currentTaskProducts: [],
          completedProducts: [...(user.completedProducts || []), ...enrichedProducts],
          activeProducts: [],
          tasksInCurrentSet: isSetComplete ? 0 : nextTaskCount,
          setsCompleted: isSetComplete ? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: tasksCompletedInThisSubmit },
          vipLevel: user.vipLevel,
          vipId: user.vipId
        }
      })
    ]

    // 3. Create transparent logs for each task order in the user's completed records
    enrichedProducts.forEach((product, idx) => {
      tx.push(prisma.task.create({
        data: {
          userId,
          status: 'completed',
          vipLevel: user.vipLevel,
          setNumber: currentSetNumber,
          progress: `${currentIndex + (idx + 1)}/${config.tasksPerSet}`,
          productId: product.taskOrder,
          price: product.price,
          totalPrice: product.price,
          totalProfit: product.profit, // Logs the 10x enriched profit amount safely in histories
          completedAt: new Date(),
          taskCode: `T${Date.now()}${idx}${userId.slice(-4)}`
        }
      }))
    })

    // 4. Archive old active TaskMerge items in the history log to clear the workspace
    tx.push(prisma.taskMerge.updateMany({
      where: { userId, vipSet: vipSetLabel, status: 'active' },
      data: { status: 'used' }
    }))

    await prisma.$transaction(tx)
    const finalUser = await prisma.user.findUnique({ where: { id: userId } })

    return NextResponse.json({ 
      success: true, 
      user: finalUser, 
      message: isMergedTask 
        ? `🔥 Premium Merged Task Completed! 10x Bonus Profits Payout Received!` 
        : `Task Completed! Payout Received` 
    })
  } catch (err) {
    console.error('submit-task error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
