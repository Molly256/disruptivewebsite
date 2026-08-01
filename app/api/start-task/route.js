import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'
import { vip2Set1 } from '@/data/vip2Set1'
import { vip2Set2 } from '@/data/vip2Set2'
import { vip3Set1 } from '@/data/vip3Set1'
import { vip3Set2 } from '@/data/vip3Set2'
import { vip4Set1 } from '@/data/vip4Set1'
import { vip4Set2 } from '@/data/vip4Set2'
import { vip5Set1 } from '@/data/vip5Set1'
import { vip5Set2 } from '@/data/vip5Set2'

// 1. FIXED PROFIT % PER VIP - APPLIES TO BOTH SETS
const VIP_PROFIT = { 1: 0.005, 2: 0.01, 3: 0.015, 4: 0.02, 5: 0.025 }
const SET_SIZES = { 1: 40, 2: 45, 3: 50, 4: 55, 5: 60 }

const ALL_PRODUCTS = {
 1: { 1: vip1Set1, 2: vip1Set2 },
 2: { 1: vip2Set1, 2: vip2Set2 },
 3: { 1: vip3Set1, 2: vip3Set2 },
 4: { 1: vip4Set1, 2: vip4Set2 },
 5: { 1: vip5Set1, 2: vip5Set2 },
}

// 2. ADMIN MERGE CONFIG: which task index merges which product indexes
// Example: VIP1 Set1 Task 4 = merge product 4 and 5. Task 9 = merge 9,10,11
const MERGED_TASKS = {
 1: { // VIP 1
    1: { // Set 1
      4: [4, 5], // when taskCompleted = 4, use product[4] and product[5]
      9: [9, 10, 11] // example: 3 products merged
    },
    2: {} // Set 2
  },
 2: { 1: {}, 2: {} }, // VIP 2
 3: { 1: {}, 2: {} },
 4: { 1: {}, 2: {} },
 5: { 1: {}, 2: {} },
}

function getProductsForTask(vipLevel, currentSet, taskIndex) {
  const baseSet = ALL_PRODUCTS[vipLevel][currentSet]
  const mergeConfig = MERGED_TASKS[vipLevel]?.[currentSet]?.[taskIndex]

  if (mergeConfig && mergeConfig.length > 0) {
    return mergeConfig.map(i => baseSet[i]).filter(Boolean) // return [p5, p6]
  }
  return [baseSet[taskIndex]].filter(Boolean) // return [p5]
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const setSize = SET_SIZES[user.vipLevel]

    // LOCK: set finished, need admin reset
    if (user.taskCompleted >= setSize) {
      return NextResponse.json({ error: 'Set completed. Contact Customer Service to reset.' }, { status: 400 })
    }

    const taskIndex = user.taskCompleted
    const products = getProductsForTask(user.vipLevel, user.currentSet, taskIndex)

    if (products.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 400 })

    const profitRate = VIP_PROFIT[user.vipLevel]

    let totalPrice = 0
    let totalReserve = 0
    let balanceLeft = user.totalBalance // use this to calculate stillOwed correctly
    const taskProducts = []

    products.forEach(p => {
      const profit = parseFloat((p.price * profitRate).toFixed(2))
      const reserveAmount = parseFloat((p.price + profit).toFixed(2))

      // stillOwed: if balance not enough, show how much is missing for this product
      const canPay = Math.max(0, balanceLeft)
      const stillOwed = Math.max(0, parseFloat((p.price - canPay).toFixed(2)))
      balanceLeft = balanceLeft - p.price // reduce for next product

      totalPrice += p.price
      totalReserve += reserveAmount

      taskProducts.push({
        id: `${user.vipLevel}-${user.currentSet}-${p.id}`,
        name: p.name,
        image: p.image,
        rating: p.rating,
        price: p.price,
        profitRate,
        profit,
        reserveAmount,
        stillOwed
      })
    })

    // ALWAYS DEDUCT = CAN GO NEGATIVE
    const newBalance = parseFloat((user.totalBalance - totalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserve).toFixed(2))

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalBalance: newBalance,
        holdAmount: newHold,
        currentTaskProducts: taskProducts, // SAVE THE 1 OR 2 PRODUCTS HERE
        activeProducts: [...user.activeProducts,...taskProducts], // keep for history
        taskCompleted: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}