import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'

const VIP_CONFIG = { 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 } }
const ALL_PRODUCTS = { 1: { 1: vip1Set1, 2: vip1Set2 } }

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

    if(user.currentTaskProducts && user.currentTaskProducts.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel]
    const currentSet = (user.setsCompleted || 0) + 1
    const index = user.tasksInCurrentSet || 0 // 0/40

    if(index >= config.tasksPerSet) return NextResponse.json({ error: 'Set completed' }, { status: 400 })

    const baseSet = ALL_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!baseSet) return NextResponse.json({ error: 'Product set configuration missing' }, { status: 400 })

    const productIdForThisTask = index + 1
    let productsToAssign = []
    const merged = user.mergedTasks || []

    if(merged.length > 0 && merged[index]) {
      productsToAssign = merged[index]
    } else {
      const normalProduct = baseSet.find(p => p.id === productIdForThisTask)
      if (normalProduct) productsToAssign.push(normalProduct)
    }

    if (productsToAssign.length === 0) return NextResponse.json({ error: `Product id ${productIdForThisTask} not found` }, { status: 400 })

    let totalPrice = 0
    let totalReserveAdded = 0
    let totalProfit = 0
    const taskProducts = []

    productsToAssign.forEach(p => {
      const profitAmount = parseFloat((p.price * config.profit).toFixed(2))
      const reserveAmount = parseFloat((p.price + profitAmount).toFixed(2))
      const localImagePath = `/vip${user.vipLevel}/set${currentSet}/photo${p.id}.jpg`
      totalPrice += p.price
      totalReserveAdded += reserveAmount
      totalProfit += profitAmount
      taskProducts.push({ id: p.id, name: p.name, image: localImagePath, price: p.price, profit: profitAmount, reserveAmount })
    })

    const taskCode = generateTaskCode()
    const newWallet = parseFloat((user.walletBalance - totalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))

    // FIX: Transaction. Create pending task + assign products
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: index },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: taskProducts,
        }
      }),
      prisma.task.create({ // CREATE PENDING TASK
        data: {
          userId,
          vipLevel: user.vipLevel,
          setNumber: currentSet,
          // taskNumber: index + 1, <-- REMOVED THIS LINE
          progress: `${index + 1}/${config.tasksPerSet}`, // 1/40
          productId: taskProducts[0].id,
          price: totalPrice,
          totalPrice,
          totalProfit,
          status: 'pending', // KEY: This makes it show in Pending tab
          taskCode,
          products: taskProducts, // save json so records can show images
        }
      })
    ])

    const finalUser = await prisma.user.findUnique({ where: { id: userId } })
    return NextResponse.json({
      success: true,
      user: finalUser,
      currentTaskNumber: index + 1 // FIX: send 1 not 0
    })

  } catch (err) {
    console.error('start-task error:', err)
    if (err.code === 'P2025') return NextResponse.json({ error: 'Task processing conflict. Please wait.' }, { status: 409 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}