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

    // Read the active item block from the User model JSON storage layer
    const userTaskProducts = typeof user.currentTaskProducts === 'string'
      ? JSON.parse(user.currentTaskProducts || '[]')
      : (user.currentTaskProducts || [])

    if (userTaskProducts.length === 0) {
      return NextResponse.json({ error: 'No active task' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const isMergedTask = userTaskProducts.length > 1
    const activeProfitRate = isMergedTask ? (config.profit * 10) : config.profit

    const currentSetNumber = (user.setsCompleted || 0) + 1
    const vipSetLabel = `vip${user.vipLevel}set${currentSetNumber}`.toLowerCase()

    // 🎯 SECURE MATHEMATICAL RE-VERIFICATION LAYER
    // Calculate total money calculations based on the authenticated snapshot stored during initialization
    let totalPrice = 0
    let totalProfit = 0
    const enrichedProducts = []

    userTaskProducts.forEach(ut => {
      const pPrice = parseFloat(ut.price || 0)
      const pProfit = parseFloat((pPrice * activeProfitRate).toFixed(2))
      totalPrice += pPrice
      totalProfit += pProfit

      enrichedProducts.push({
        id: ut.dataId || ut.photoId,
        taskOrder: ut.taskOrder,
        price: pPrice,
        name: ut.name || `Product ${ut.dataId}`,
        profit: pProfit
      })
    })

    const totalReserve = parseFloat((totalPrice + totalProfit).toFixed(2))
    const tasksCompletedInThisSubmit = enrichedProducts.length

    const currentIndex = user.tasksInCurrentSet || 0
    const nextTaskCount = currentIndex + tasksCompletedInThisSubmit
    const isSetComplete = nextTaskCount >= config.tasksPerSet

    // 🎯 FIND ALL PENDING DATABASE ROWS INITIALIZED FOR THIS TASK PACK
    const pendingTasks = await prisma.task.findMany({
      where: { userId: userId, status: 'pending', setNumber: currentSetNumber }
    })

    const tx = [
      // 1. Update the User Financial Balance cleanly
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: currentIndex },
        data: {
          walletBalance: { increment: totalReserve }, 
          holdAmount: { decrement: totalReserve >= user.holdAmount ? user.holdAmount : totalReserve }, // Decrement safely
          todayProfit: { increment: parseFloat(totalProfit.toFixed(2)) },
          currentTaskProducts: [], 
          activeProducts: [],
          completedProducts: [...(user.completedProducts || []), ...enrichedProducts],
          tasksInCurrentSet: isSetComplete ? 0 : nextTaskCount,
          setsCompleted: isSetComplete ? (user.setsCompleted || 0) + 1 : (user.setsCompleted || 0),
          taskCompleted: { increment: tasksCompletedInThisSubmit }
        }
      })
    ]

    // 2. 🎯 THE FIX: Update ALL matching pending rows to completed status simultaneously
    if (pendingTasks.length > 0) {
      const pendingTaskIds = pendingTasks.map(t => t.id)
      
      tx.push(
        prisma.task.updateMany({
          where: {
            id: { in: pendingTaskIds }
          },
          data: {
            status: 'completed',
            completedAt: new Date(),
            progress: `${nextTaskCount}/${config.tasksPerSet}`
          }
        })
      )
    } else {
      // Emergency Fallback: If no pending rows were generated somehow, log them here as safety backup
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

    // 3. Close the validation check block inside the task merges routing panel
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
