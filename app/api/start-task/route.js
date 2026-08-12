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
    const userCurrentTaskNumber = index + 1 // BACK TO +1 FOR DISPLAY

    if (index >= config.tasksPerSet) return NextResponse.json({ error: 'Set completed' }, { status: 400 })

    const fileSet = STATIC_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!fileSet) return NextResponse.json({ error: 'Static product set missing' }, { status: 400 })

    const basePath = `/vip${user.vipLevel}/set${currentSet}`

    const activeUserMerge = await prisma.taskMerge.findFirst({
      where: { userId: userId, vipSet: `vip${user.vipLevel}set${currentSet}`, status: 'active' },
      orderBy: { createdAt: 'desc' }
    })

    let productsToAssign = []
    let isMergedTask = false

    if (activeUserMerge) {
      const userPairs = typeof activeUserMerge.pairs === 'string'? JSON.parse(activeUserMerge.pairs) : activeUserMerge.pairs
      if (userPairs && userPairs.length > 0) {
        const mergedTaskOrders = userPairs.map(p => Number(p.taskOrder || p.photoId || p.dataId || p.id)).filter(n =>!isNaN(n))
        const comboStart = Math.min(...mergedTaskOrders)
        const comboEnd = Math.max(...mergedTaskOrders)

        const gatePasses = Number(userCurrentTaskNumber) === comboStart // Check against +1 number

        if (gatePasses) {
          isMergedTask = true
          await prisma.taskMerge.update({ where: { id: activeUserMerge.id }, data: { status: 'used' } })

          userPairs.forEach((pair) => {
            const targetId = Number(pair.taskOrder || pair.dataId || pair.photoId || pair.id)
            const fileMatch = fileSet.find(p => Number(p.id) === targetId)
            productsToAssign.push({
              id: targetId,
              name: pair.name || (fileMatch? fileMatch.name : `Combo Item #${targetId}`),
              price: pair.price? parseFloat(pair.price) : (fileMatch? parseFloat(fileMatch.price) : 0.00),
              rating: fileMatch? (fileMatch.rating || 5.0) : 5.0,
              image: `${basePath}/photo${targetId}.jpg`
            })
          })
        }
      }
    }

    if (productsToAssign.length === 0) {
      isMergedTask = false
      const normalProduct = fileSet.find(p => Number(p.id) === userCurrentTaskNumber)
      if (normalProduct) {
        productsToAssign.push({
          id: userCurrentTaskNumber,
          name: normalProduct.name || `Product #${userCurrentTaskNumber}`,
          price: parseFloat(normalProduct.price || 0),
          rating: normalProduct.rating || 5.0,
          image: `${basePath}/photo${userCurrentTaskNumber}.jpg`
        })
      }
    }

    if (productsToAssign.length === 0) return NextResponse.json({ error: 'No items found' }, { status: 400 })

    const activeProfitRate = isMergedTask? (config.profit * 10) : config.profit
    let totalReserveAdded = 0
    const innerItemsSnapshot = []
    const rawCostsArray = productsToAssign.map(p => parseFloat(p.price || 0))
    const cleanTotalPriceSum = rawCostsArray.reduce((sum, val) => sum + val, 0)

    productsToAssign.forEach(p => {
      const pPrice = parseFloat(p.price || 0)
      const pId = Number(p.id || userCurrentTaskNumber)
      const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
      const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))

      totalReserveAdded += reserveAmount
      innerItemsSnapshot.push({
        id: pId, productId: pId, photoId: pId, dataId: pId, taskOrder: pId,
        name: p.name, rating: p.rating || 5.0,
        price: pPrice, profit: profitAmount, reserveAmount: reserveAmount,
        image: `${basePath}/photo${pId}.jpg`
      })
    })

    if ((user.taskCompleted || 0) === 0 && parseFloat(user.walletBalance || 0) < 50) {
      return NextResponse.json({ error: 'Balance below 50 unable to continue trading' }, { status: 400 })
    }

    const newWallet = parseFloat((user.walletBalance - cleanTotalPriceSum).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))

    const stepsCompleted = isMergedTask? productsToAssign.length : 1
    const newTasksInCurrentSet = index + stepsCompleted // Store raw index
    const progressLabelString = isMergedTask? `${userCurrentTaskNumber}-${userCurrentTaskNumber + stepsCompleted - 1}/${config.tasksPerSet}` : `${userCurrentTaskNumber}/${config.tasksPerSet}`
    const unifiedTaskPayload = innerItemsSnapshot

    const databaseOperations = [
      prisma.user.update({
        where: { id: userId },
        data: { walletBalance: newWallet, holdAmount: newHold, tasksInCurrentSet: newTasksInCurrentSet, currentTaskProducts: unifiedTaskPayload, activeProducts: unifiedTaskPayload }
      }),
      prisma.task.create({
        data: { userId: userId, vipLevel: user.vipLevel, setNumber: currentSet, progress: progressLabelString, status: 'pending', products: innerItemsSnapshot, taskCode: generateTaskCode() }
      })
    ]

    await prisma.$transaction(databaseOperations)

    return NextResponse.json({ success: true, isMerged: isMergedTask, productsGiven: productsToAssign.map(p=>p.id) })
  } catch (err) {
    console.error('[DEBUG] CRASH:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}