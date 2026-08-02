import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'

// 1. FIXED PROFIT % PER VIP - ONLY VIP1 FOR NOW
const VIP_PROFIT = { 1: 0.005 }
const SET_SIZES = { 1: 40 }

const ALL_PRODUCTS = {
 1: { 1: vip1Set1, 2: vip1Set2 },
}

// 2. ADMIN MERGE CONFIG
const MERGED_TASKS = {
 1: {
    1: {
      4: [4, 5],
      9: [9, 10, 11]
    },
    2: {}
  },
}

function getProductsForTask(vipLevel, currentSet, taskIndex) {
  const baseSet = ALL_PRODUCTS[vipLevel]?.[currentSet]
  if (!baseSet || baseSet.length === 0) return []

  const mergeConfig = MERGED_TASKS[vipLevel]?.[currentSet]?.[taskIndex]

  if (mergeConfig && mergeConfig.length > 0) {
    return mergeConfig.map(i => baseSet[i]).filter(Boolean)
  }
  return [baseSet[taskIndex]].filter(Boolean)
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // BLOCK VIP2+ users
    if (user.vipLevel!== 1) {
      return NextResponse.json({ error: 'Only VIP1 is available right now' }, { status: 400 })
    }

    const setSize = SET_SIZES[user.vipLevel]

    // LOCK: set finished
    if (user.taskCompleted >= setSize) {
      return NextResponse.json({ error: 'Set completed. Contact Customer Service to reset.' }, { status: 400 })
    }

    const taskIndex = user.taskCompleted
    const products = getProductsForTask(user.vipLevel, user.currentSet, taskIndex)

    if (products.length === 0) return NextResponse.json({ error: 'Products for this VIP/Set not added yet' }, { status: 400 })

    const profitRate = VIP_PROFIT[user.vipLevel]

    let totalPrice = 0
    let totalReserve = 0
    let balanceLeft = user.walletBalance // CHANGED: walletBalance
    const taskProducts = []

    products.forEach(p => {
      const profit = parseFloat((p.price * profitRate).toFixed(2))
      const reserveAmount = parseFloat((p.price + profit).toFixed(2))

      const canPay = Math.max(0, balanceLeft)
      const stillOwed = Math.max(0, parseFloat((p.price - canPay).toFixed(2)))
      balanceLeft = balanceLeft - p.price

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
    const newWallet = parseFloat((user.walletBalance - totalPrice).toFixed(2)) // CHANGED
    const newHold = parseFloat((user.holdAmount + totalReserve).toFixed(2))

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        walletBalance: newWallet, // CHANGED
        holdAmount: newHold,
        currentTaskProducts: taskProducts,
        activeProducts: [...user.activeProducts,...taskProducts],
        taskCompleted: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}