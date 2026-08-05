import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { vip1Set1 } from '@/data/vip1Set1'
import { vip1Set2 } from '@/data/vip1Set2'

const VIP_CONFIG = {
 1: { tasksPerSet: 40, totalSets: 2, profit: 0.005 },
}

const ALL_PRODUCTS = {
 1: { 1: vip1Set1, 2: vip1Set2 },
}

const generateTaskCode = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
  return `${date}${rand}`
}

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const config = VIP_CONFIG[user.vipLevel]
    const currentSet = (user.setsCompleted || 0) + 1
    const taskNumber = (user.tasksInCurrentSet || 0) + 1

    if(taskNumber > config.tasksPerSet) {
      return NextResponse.json({ error: 'Set completed' }, { status: 400 })
    }

    const baseSet = ALL_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!baseSet) return NextResponse.json({ error: 'Product set configuration missing' }, { status: 400 })

    let productsToAssign = []

    // Default: assign 1 product by task number
    const normalProduct = baseSet.find(p => p.id === taskNumber)
    if (normalProduct) productsToAssign.push(normalProduct)

    if (productsToAssign.length === 0) {
      return NextResponse.json({ error: 'No items available for this task' }, { status: 400 })
    }

    let totalPrice = 0
    let totalReserveAdded = 0
    let totalProfit = 0
    const taskProducts = []

    productsToAssign.forEach(p => {
      const profitAmount = parseFloat((p.price * config.profit).toFixed(2))
      const reserveAmount = parseFloat((p.price + profitAmount).toFixed(2))

      const imageIndex = ((p.id - 1) % 40) + 1
      const localImagePath = `/vip${user.vipLevel}/set${currentSet}/photo${imageIndex}.jpg`

      totalPrice += p.price
      totalReserveAdded += reserveAmount
      totalProfit += profitAmount

      taskProducts.push({
        id: p.id,
        name: p.name,
        image: localImagePath,
        price: p.price,
        profit: profitAmount,
        reserveAmount
      })
    })

    const taskCode = generateTaskCode()
    const newWallet = parseFloat((user.walletBalance - totalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))

    // WRAP IN TRANSACTION: update user + create task
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: taskProducts,
          tasksInCurrentSet: user.tasksInCurrentSet + 1,
        }
      }),
      prisma.task.create({ // ADDED: save task to DB for Records
        data: {
          userId: userId,
          vipLevel: user.vipLevel,
          setNumber: currentSet,
          progress: `${taskNumber}/${config.tasksPerSet}`,
          productId: normalProduct.id,
          price: totalPrice,
          totalPrice: totalPrice,
          totalProfit: totalProfit,
          status: 'pending',
          taskCode: taskCode,
        }
      })
    ])

    const finalUser = await prisma.user.findUnique({ where: { id: userId } })

    return NextResponse.json({ success: true, user: finalUser })
  } catch (err) {
    console.error('start-task error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}