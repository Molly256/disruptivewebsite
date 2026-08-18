import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 60, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 80, totalSets: 3, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 120, totalSets: 3, profit: 0.025 },
}

export async function POST(req) {
  try {
    const { userId, currentTaskNumber } = await req.json()
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

    // SILENT x10 LOGIC: Only if this task number is in x10TaskNumbers
    const x10List = typeof user.x10TaskNumbers === 'string'
     ? JSON.parse(user.x10TaskNumbers || '[]')
      : (user.x10TaskNumbers || [])
    const isX10 = x10List.includes(Number(currentTaskNumber))
    const activeProfitRate = isX10? (config.profit * 10) : config.profit

    const currentDay = user.currentDay || 1
    const currentSet = user.currentSet || 1

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
        taskOrder: ut.taskOrder || currentTaskNumber,
        price: pPrice,
        name: ut.name || `Product ${ut.productId}`,
        profit: pProfit,
        image: ut.image || `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${ut.productId}.jpg`
      })
    })

    const totalReserve = parseFloat((totalPrice + totalProfit).toFixed(2))

    // Hold amount to release
    const rawDecrementValue = totalReserve >= (user.holdAmount || 0)? (user.holdAmount || 0) : totalReserve;
    const cleanDecrementAmount = parseFloat(rawDecrementValue.toFixed(2));

    const activePendingTaskCard = await prisma.task.findFirst({
      where: {
        userId: userId,
        status: 'pending',
        setNumber: currentSet
      },
      orderBy: { createdAt: 'desc' }
    })

    const tx = [
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: totalReserve },
          holdAmount: { decrement: cleanDecrementAmount },
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: "[]",
          activeProducts: "[]",
          completedProducts: [...(Array.isArray(user.completedProducts)? user.completedProducts : []),...enrichedProducts],
          taskCompleted: { increment: 1 }
        }
      })
    ]

    if (activePendingTaskCard) {
      tx.push(
        prisma.task.update({
          where: { id: activePendingTaskCard.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            products: enrichedProducts
          }
        })
      )
    } else {
      tx.push(prisma.task.create({
        data: {
          userId,
          status: 'completed',
          vipLevel: user.vipLevel,
          setNumber: currentSet,
          progress: `D${currentDay} S${currentSet} T${currentTaskNumber}/${config.tasksPerSet}`,
          products: enrichedProducts,
          taskCode: `T${Date.now()}${userId.slice(-4)}`,
          completedAt: new Date()
        }
      }))
    }

    await prisma.$transaction(tx)

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } })
    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error("Submission operational failure:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}