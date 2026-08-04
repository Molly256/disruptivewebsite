import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { vip1Set1 } from '@/data/vip1Set1' // id: 1-40
import { vip1Set2 } from '@/data/vip1Set2' // id: 41-80

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 }, // 0.5%
 2: { tasksPerSet: 60, totalSets: 2, profit: 0.01 },
 3: { tasksPerSet: 80, totalSets: 2, profit: 0.015 },
 4: { tasksPerSet: 100, totalSets: 2, profit: 0.02 },
 5: { tasksPerSet: 120, totalSets: 2, profit: 0.025 },
}

const ALL_PRODUCTS = {
 1: { 1: vip1Set1, 2: vip1Set2 },
}

const MERGED_TASKS = {
 1: {
    1: { 5: [5, 6], 10: [10, 11, 12] },
    2: {}
  },
}

function getProductsForTask(vipLevel, setNumber, taskNumber) {
  const baseSet = ALL_PRODUCTS[vipLevel]?.[setNumber]
  if (!baseSet || baseSet.length === 0) return []

  const mergeConfig = MERGED_TASKS[vipLevel]?.[setNumber]?.[taskNumber]
  if (mergeConfig && mergeConfig.length > 0) {
    return mergeConfig.map(id => baseSet.find(p => p.id === id)).filter(Boolean)
  }
  return [baseSet.find(p => p.id === taskNumber)].filter(Boolean)
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const config = VIP_CONFIG[user.vipLevel]
    if(!config) return NextResponse.json({ error: 'VIP not configured' }, { status: 400 })

    const { tasksPerSet, totalSets, profit } = config

    const setsCompleted = user.setsCompleted || 0
    const tasksInSet = user.tasksInCurrentSet || 0
    const currentSet = setsCompleted + 1
    const taskNumber = tasksInSet + 1

    if (setsCompleted >= totalSets) {
      return NextResponse.json({ error: 'All sets completed. Contact Customer Service to reset.' }, { status: 400 })
    }

    if (tasksInSet >= tasksPerSet) {
      return NextResponse.json({ error: 'Set completed. Waiting for admin reset.' }, { status: 400 })
    }

    const products = getProductsForTask(user.vipLevel, currentSet, taskNumber)

    if (products.length === 0) return NextResponse.json({ error: `Product ${taskNumber} not found in Set ${currentSet}` }, { status: 400 })

    let totalPrice = 0
    let totalReserve = 0
    const taskProducts = []

    products.forEach(p => {
      const profitAmount = parseFloat((p.price * profit).toFixed(2)) // VIP1 = 0.5%
      const reserveAmount = parseFloat((p.price + profitAmount).toFixed(2))

      totalPrice += p.price
      totalReserve += reserveAmount

      taskProducts.push({
        id: p.id,
        setNumber: currentSet,
        name: p.name,
        image: p.image, // MUST be /vip1/set1/photo1.jpg
        rating: p.rating,
        price: p.price,
        profit: profitAmount,
        reserveAmount,
        stillOwed: 0
      })
    })

    // CHECK BALANCE FIRST - this gives "Insufficient balance" popup
    if (user.walletBalance < totalPrice) {
      return NextResponse.json({ error: `Insufficient balance. Need $${totalPrice.toFixed(2)}` }, { status: 400 })
    }

    const newWallet = parseFloat((user.walletBalance - totalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserve).toFixed(2))

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: newWallet, // deduct price
        holdAmount: newHold, // add price + profit
        currentTaskProducts: taskProducts, // show this in StartingDetail
        activeProducts: [...(user.activeProducts || []),...taskProducts],
        tasksInCurrentSet: tasksInSet + 1, // THIS makes button go 0/40 -> 1/40
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}