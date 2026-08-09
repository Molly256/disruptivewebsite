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
    const isMergedTask = userTaskProducts.length > 1
    
    // CRITICAL MATH RULE: Multiplies profit rate by 10 ONLY if isMergedTask is true
    const activeProfitRate = isMergedTask ? (config.profit * 10) : config.profit

    const currentSetNumber = (user.setsCompleted || 0) + 1
    const vipSetLabel = `vip${user.vipLevel}set${currentSetNumber}`.toLowerCase()

    const masterPatch = await prisma.taskMerge.findFirst({ where: { vipSet: vipSetLabel, status: 'system_template' } })
    const masterPairs = masterPatch ? (typeof masterPatch.pairs === 'string' ? JSON.parse(masterPatch.pairs) : masterPatch.pairs) : []

    const enrichedProducts = userTaskProducts.map(ut => {
      const match = masterPairs.find(m => m.taskOrder === ut.taskOrder)
      const basePrice = match ? parseFloat(match.price) : (user.vipLevel === 2 ? 200.00 : 100.00)
      const baseName = match ? match.name : `Premium Product ${ut.taskOrder}`
      return {
        id: ut.taskOrder, taskOrder: ut.taskOrder, price: basePrice, name: baseName,
        profit: parseFloat((basePrice * activeProfitRate).toFixed(2))
      }
    })

    const totalPrice = enrichedProducts.reduce((sum, p) => sum + p.price, 0)
    const totalProfit = enrichedProducts.reduce((sum, p) => sum + p.profit, 0)
    const totalReserve = totalPrice + totalProfit
    const tasksCompletedInThisSubmit = enrichedProducts.length

    const currentIndex = user.tasksInCurrentSet || 0
    const nextTaskCount = currentIndex + tasksCompletedInThisSubmit
    const isSetComplete = nextTaskCount >= config.tasksPerSet

    const pendingTask = await prisma.task.findFirst({
      where: { userId: userId, status: 'pending' }, orderBy: { createdAt: 'desc' }
    })

    const tx = [
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: currentIndex },
        data: {
          walletBalance: { increment: totalReserve }, holdAmount: 0.00, todayProfit: { increment: totalProfit },
          currentTaskProducts: [], activeProducts: [],
          completedProducts: [...(user.completedProducts || []), ...enrichedProducts],
          tasksInCurrentSet: isSetComplete ? 0 : nextTaskCount,
          setsCompleted: isSetComplete ? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: tasksCompletedInThisSubmit }
        }
      })
    ]

    if (pendingTask) {
      tx.push(prisma.task.update({
        where: { id: pendingTask.id },
        data: {
          status: 'completed', completedAt: new Date(),
          productId: enrichedProducts[0].taskOrder,
          price: totalPrice,
          totalPrice: totalPrice,
          totalProfit: totalProfit,
          progress: `${nextTaskCount}/${config.tasksPerSet}`
        }
      }))

      if (isMergedTask) {
        enrichedProducts.slice(1).forEach((product, idx) => {
          tx.push(prisma.task.create({
            data: {
              userId, status: 'completed', vipLevel: user.vipLevel, setNumber: currentSetNumber,
              progress: `${currentIndex + 1 + (idx + 1)}/${config.tasksPerSet}`,
              productId: product.taskOrder, price: product.price, totalPrice: product.price, totalProfit: product.profit,
              completedAt: new Date(), taskCode: `T${Date.now()}${idx + 1}${userId.slice(-4)}`
            }
          }))
        })
      }
    } else {
      enrichedProducts.forEach((product, idx) => {
        tx.push(prisma.task.create({
          data: {
            userId, status: 'completed', vipLevel: user.vipLevel, setNumber: currentSetNumber,
            progress: `${currentIndex + (idx + 1)}/${config.tasksPerSet}`,
            productId: product.taskOrder, price: product.price, totalPrice: product.price, totalProfit: product.profit,
            completedAt: new Date(), taskCode: `T${Date.now()}${idx}${userId.slice(-4)}`
          }
        }))
      })
    }

    tx.push(prisma.taskMerge.updateMany({ where: { userId, vipSet: vipSetLabel, status: 'active' }, data: { status: 'used' } }))

    await prisma.$transaction(tx)
    return NextResponse.json({ success: true, user: await prisma.user.findUnique({ where: { id: userId } }) })
  } catch (err) {
    console.error(err); return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
