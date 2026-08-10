import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'

export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 },
 2: { tasksPerSet: 60, totalSets: 2, profit: 0.01 },
 3: { tasksPerSet: 80, totalSets: 2, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 2, profit: 0.02 },
 5: { tasksPerSet: 120, totalSets: 2, profit: 0.025 }
}

const STATIC_PRODUCTS = { 1: { 1: vip1Set1, 2: vip1Set2 } }

const generateTaskCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 10000000).toString().padStart(10, '0')
  return `${date}${rand}`
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const currentProductsArray = typeof user.currentTaskProducts === 'string'
     ? JSON.parse(user.currentTaskProducts || '[]')
      : (user.currentTaskProducts || [])

    if (currentProductsArray.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentSet = (user.setsCompleted || 0) + 1
    const index = user.tasksInCurrentSet || 0
    const userCurrentTaskNumber = index + 1 // Current step tracker (e.g., 5)

    if (index >= config.tasksPerSet) return NextResponse.json({ error: 'Set completed' }, { status: 400 })

    const fileSet = STATIC_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!fileSet) return NextResponse.json({ error: 'Static product set missing' }, { status: 400 })

    const activeUserMerge = await prisma.taskMerge.findFirst({
      where: {
        userId,
        vipSet: {
          equals: `vip${user.vipLevel}set${currentSet}`,
          mode: 'insensitive'
        },
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    let productsToAssign = []
    let isMergedTask = false

    if (activeUserMerge) {
      const userPairs = typeof activeUserMerge.pairs === 'string' ? JSON.parse(activeUserMerge.pairs) : activeUserMerge.pairs
      const mergedTaskOrders = userPairs.map(p => Number(p.taskOrder || p.photoId || p.dataId || p.id))

      // 🎯 THE FIX: Find the lowest task number in the merge group (e.g., 5)
      const mergeTriggerStepNumber = Math.min(...mergedTaskOrders)

      // 🎯 THE FIX: Combo triggers ONLY when the user's progress reaches the first item in the merge bundle (5 === 5).
      // This stops step 6 from re-running the used gate, entirely blocking task separation.
      if (userCurrentTaskNumber === mergeTriggerStepNumber) {
        isMergedTask = true
        userPairs.forEach(pair => {
          const targetId = Number(pair.dataId || pair.photoId || pair.id || pair.taskOrder)
          const fileMatch = fileSet.find(p => Number(p.id) === targetId)

          if (fileMatch) {
            productsToAssign.push({
             ...fileMatch,
              name: pair.name || fileMatch.name,
              price: pair.price ? parseFloat(pair.price) : fileMatch.price,
              rating: fileMatch.rating || 5.0
            })
          }
        })
      }
    }

    // FALLBACK OVERRIDE: Serves normal single tasks if no merge matches yet (e.g. user is on step 3 or 4)
    if (productsToAssign.length === 0) {
      isMergedTask = false
      const productIdForThisTask = userCurrentTaskNumber
      const normalProduct = fileSet.find(p => Number(p.id) === productIdForThisTask)
      if (normalProduct) productsToAssign.push(normalProduct)
    }

    if (productsToAssign.length === 0) return NextResponse.json({ error: 'No items found' }, { status: 400 })

    const activeProfitRate = isMergedTask ? (config.profit * 10) : config.profit

    let totalPrice = 0, totalReserveAdded = 0, totalProfit = 0
    const innerItemsSnapshot = []

    productsToAssign.forEach(p => {
      const pPrice = parseFloat(p.price || 0)
      const pId = Number(p.id)
      const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
      const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))
      const localImagePath = `/vip${user.vipLevel}/set${currentSet}/photo${pId}.jpg`

      totalPrice += pPrice
      totalReserveAdded += reserveAmount
      totalProfit += profitAmount

      innerItemsSnapshot.push({
        id: pId,
        productId: pId,
        photoId: pId,
        dataId: pId,
        taskOrder: pId,
        name: p.name,
        rating: p.rating || 5.0,
        price: pPrice,
        profit: profitAmount,
        reserveAmount: reserveAmount,
        image: localImagePath
      })
    })

    if ((user.taskCompleted || 0) === 0) {
      if (parseFloat(user.walletBalance || 0) < 50) {
        return NextResponse.json({ error: 'Balance below 50 unable to continue trading' }, { status: 400 })
      }
    }

    // Math Fix: Only raw item cost is deducted from user wallet balance row cells.
    const cleanTotalPrice = parseFloat(totalPrice.toFixed(2))
    const newWallet = parseFloat((user.walletBalance - cleanTotalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))

    const stepsCompleted = productsToAssign.length
    const progressLabelString = stepsCompleted > 1
     ? `${userCurrentTaskNumber}-${index + stepsCompleted}/${config.tasksPerSet}`
      : `${userCurrentTaskNumber}/${config.tasksPerSet}`

    // 🎯 THE FIX: Defensive layout snapshot extraction mapping safeguards against array element crashes
    const unifiedTaskPayload = innerItemsSnapshot

    const databaseOperations = [
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: index },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: unifiedTaskPayload,
          activeProducts: unifiedTaskPayload
        }
      }),
      prisma.task.create({
        data: {
          userId: userId,
          vipLevel: user.vipLevel,
          setNumber: currentSet,
          progress: progressLabelString,
          status: 'pending',
          products: innerItemsSnapshot,
          taskCode: generateTaskCode()
        }
      })
    ]

    if (activeUserMerge && isMergedTask) {
      databaseOperations.push(
        prisma.taskMerge.update({
          where: { id: activeUserMerge.id },
          data: { status: 'used' }
        })
      )
    }

    await prisma.$transaction(databaseOperations)

    const finalDisplayNumber = index + stepsCompleted

    return NextResponse.json({
      success: true,
      user: await prisma.user.findUnique({ where: { id: userId } }),
      currentTaskNumber: finalDisplayNumber
    })
  } catch (err) {
    console.error(err); return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
