import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const userTaskProducts = typeof user.currentTaskProducts === 'string'
     ? JSON.parse(user.currentTaskProducts || '[]')
      : (user.currentTaskProducts || [])

    if (userTaskProducts.length === 0) {
      return NextResponse.json({ error: 'No active task' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const isMergedTask = userTaskProducts.length > 1
    const activeProfitRate = isMergedTask? (config.profit * 10) : config.profit

    const currentSetNumber = (user.setsCompleted || 0) + 1
    const vipSetLabel = `vip${user.vipLevel}set${currentSetNumber}`.toLowerCase()
    const currentIndex = user.tasksInCurrentSet || 0

    let totalPrice = 0
    let totalProfit = 0
    const enrichedProducts = []

    userTaskProducts.forEach(ut => {
      const pPrice = parseFloat(ut.price || 0)
      const pProfit = parseFloat((pPrice * activeProfitRate).toFixed(2))
      totalPrice += pPrice
      totalProfit += pProfit

      enrichedProducts.push({
        productId: ut.id || ut.productId || ut.photoId,
        taskOrder: ut.taskOrder,
        price: pPrice,
        name: ut.name || `Product ${ut.dataId}`,
        profit: pProfit,
        // ONLY CHANGE: force to set1 because that's the only folder you have
        image: ut.image || `/vip${user.vipLevel}/set1/photo${ut.id}.jpg`
      })
    })

    const totalReserve = parseFloat((totalPrice + totalProfit).toFixed(2))
    const tasksCompletedInThisSubmit = enrichedProducts.length

    const nextTaskCount = currentIndex + tasksCompletedInThisSubmit
    const isSetComplete = nextTaskCount >= config.tasksPerSet

    // Fetch exactly ONE single pending database task card block generated on initialization step hooks
    const activePendingTaskCard = await prisma.task.findFirst({
      where: {
        userId: userId,
        status: 'pending',
        setNumber: currentSetNumber
      },
      orderBy: { createdAt: 'desc' }
    })

    // 🎯 BACKEND MATHEMATICAL ISOLATION FIX:
    // Extract raw conditional calculations from runtime logic pools out to clean JS variables.
    // This stops Prisma from crashing on variable arithmetic parameters!
    const rawDecrementValue = totalReserve >= (user.holdAmount || 0)? (user.holdAmount || 0) : totalReserve;
    const cleanDecrementAmount = parseFloat(rawDecrementValue.toFixed(2));

    const tx = [
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: totalReserve },
          holdAmount: { decrement: cleanDecrementAmount },
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: [],
          activeProducts: [],
          completedProducts: [...(Array.isArray(user.completedProducts)? user.completedProducts : []),...enrichedProducts],
          tasksInCurrentSet: isSetComplete? 0 : nextTaskCount,
          setsCompleted: isSetComplete? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: tasksCompletedInThisSubmit }
        }
      })
    ]

    // Mark exactly that ONE active task record row status parameter as completed!
    if (activePendingTaskCard) {
      tx.push(
        prisma.task.update({
          where: { id: activePendingTaskCard.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            products: enrichedProducts // Overwrites snapshot cache with real prices into JSON field
          }
        })
      )
    } else {
      // Emergency Fallback if card layout row was not found
      tx.push(prisma.task.create({
        data: {
          userId,
          status: 'completed',
          vipLevel: user.vipLevel,
          setNumber: currentSetNumber,
          progress: isMergedTask? `${currentIndex + 1}-${nextTaskCount}/${config.tasksPerSet}` : `${currentIndex + 1}/${config.tasksPerSet}`,
          products: enrichedProducts,
          taskCode: `T${Date.now()}${userId.slice(-4)}`,
          completedAt: new Date()
        }
      }))
    }

    tx.push(
      prisma.taskMerge.updateMany({
        where: { userId, vipSet: vipSetLabel, status: 'active' },
        data: { status: 'used' }
      })
    )

    await prisma.$transaction(tx)

    return NextResponse.json({
      success: true,
      user: await prisma.user.findUnique({ where: { id: userId } })
    })
  } catch (err) {
    console.error("Submission operational failure:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}