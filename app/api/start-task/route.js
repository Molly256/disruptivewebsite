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

    let currentProductsArray = []
    try {
      currentProductsArray = typeof user.currentTaskProducts === 'string'
       ? JSON.parse(user.currentTaskProducts || '[]')
        : (user.currentTaskProducts || [])
    } catch {
      currentProductsArray = []
    }

    if (currentProductsArray.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentSet = (user.setsCompleted || 0) + 1
    const index = Number(user.tasksInCurrentSet) || 0
    const userCurrentTaskNumber = index + 1

    if (index >= config.tasksPerSet) return NextResponse.json({ error: 'Set completed' }, { status: 400 })

    const fileSet = STATIC_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!fileSet) return NextResponse.json({ error: 'Static product set missing' }, { status: 400 })

    const activeUserMerge = await prisma.taskMerge.findFirst({
      where: { userId: userId, vipSet: `vip${user.vipLevel}set${currentSet}`, status: 'active' },
      orderBy: { createdAt: 'desc' }
    })

    let productsToAssign = []
    let isMergedTask = false
    let stepsCompleted = 1

    if (activeUserMerge) {
      let userPairs = []
      try {
        userPairs = typeof activeUserMerge.pairs === 'string' ? JSON.parse(activeUserMerge.pairs) : activeUserMerge.pairs || []
      } catch {
        userPairs = []
      }

      if (userPairs.length > 0) {
        const mergedTaskOrders = userPairs.map(p => Number(p.taskOrder || p.id)).filter(n => !isNaN(n))
        if (mergedTaskOrders.length > 0) {
          const comboStart = Math.min(...mergedTaskOrders)

          // 🔒 LANDING CHECKPOINT MATCHES TRUE STEPS ONLY
          if (userCurrentTaskNumber === comboStart) {
            isMergedTask = true
            stepsCompleted = userPairs.length

            if (stepsCompleted > 1) {
              await prisma.taskMerge.update({ where: { id: activeUserMerge.id }, data: { status: 'used' } })
            }

            userPairs.forEach((pair, idx) => {
              const targetId = Number(pair.taskOrder || pair.id)
              const fileMatch = fileSet.find(p => Number(p.id) === targetId)
              
              productsToAssign.push({
                id: targetId,
                name: pair.name || (fileMatch ? fileMatch.name : `Combo Item #${idx + 1}`),
                price: pair.price ? parseFloat(pair.price) : (fileMatch ? parseFloat(fileMatch.price) : 0.00),
                rating: fileMatch ? fileMatch.rating : 5.0,
                image: pair.image || (fileMatch ? fileMatch.image : `/photo${targetId}.jpg`)
              })
            })
          }
        }
      }
    }

    // ALWAYS FALLBACK TO SINGLE
    if (productsToAssign.length === 0) {
      const normalProduct = fileSet.find(p => Number(p.id) === userCurrentTaskNumber)
      if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber}` }, { status: 400 })

      productsToAssign.push({
        id: userCurrentTaskNumber,
        name: normalProduct.name,
        price: parseFloat(normalProduct.price || 0),
        rating: normalProduct.rating || 5.0,
        image: normalProduct.image || `/photo${userCurrentTaskNumber}.jpg`
      })
    }

    const activeProfitRate = isMergedTask ? (config.profit * 10) : config.profit
    let totalReserveAdded = 0
    const innerItemsSnapshot = []
    const cleanTotalPriceSum = productsToAssign.reduce((sum, p) => sum + parseFloat(p.price || 0), 0)

    productsToAssign.forEach(p => {
      const pPrice = parseFloat(p.price || 0)
      const pId = Number(p.id)
      const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
      const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))
      totalReserveAdded += reserveAmount
      
      innerItemsSnapshot.push({ 
        id: pId, 
        productId: pId,
        photoId: pId,
        dataId: pId,
        taskOrder: pId,
        name: p.name, 
        price: pPrice, 
        profit: profitAmount, 
        reserveAmount, 
        rating: p.rating, 
        image: p.image || `/photo${pId}.jpg` 
      })
    })

    if ((user.taskCompleted || 0) === 0 && parseFloat(user.walletBalance || 0) < 50) {
      return NextResponse.json({ error: 'Balance below 50 unable to continue trading' }, { status: 400 })
    }

    const newWallet = parseFloat((user.walletBalance - cleanTotalPriceSum).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))
    
    // 🎯 THE DOUBLE INCREMENT REMOVED FIX: 
    // Do not modify tasksInCurrentSet here. Leave it completely alone!
    // The submit-task file handles the increment cleanly when items save.
    const progressLabelString = isMergedTask 
      ? `${userCurrentTaskNumber}-${userCurrentTaskNumber + stepsCompleted - 1}/${config.tasksPerSet}` 
      : `${userCurrentTaskNumber}/${config.tasksPerSet}`

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { 
          walletBalance: newWallet, 
          holdAmount: newHold, 
          currentTaskProducts: innerItemsSnapshot, 
          activeProducts: innerItemsSnapshot 
        }
      }),
      prisma.task.create({
        data: { userId, vipLevel: user.vipLevel, setNumber: currentSet, progress: progressLabelString, status: 'pending', products: innerItemsSnapshot, taskCode: generateTaskCode() }
      })
    ])

    return NextResponse.json({ success: true, isMerged: isMergedTask, products: productsToAssign })
  } catch (err) {
    console.error('[CRASH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
