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

    if (user.currentTaskProducts && user.currentTaskProducts.length > 0) {
      return NextResponse.json({ error: 'You have an active task. Submit it first.' }, { status: 400 })
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentSet = (user.setsCompleted || 0) + 1
    const index = user.tasksInCurrentSet || 0 

    if (index >= config.tasksPerSet) return NextResponse.json({ error: 'Set completed' }, { status: 400 })

    const fileSet = STATIC_PRODUCTS[user.vipLevel]?.[currentSet]
    if (!fileSet) return NextResponse.json({ error: 'Static product set missing' }, { status: 400 })

    // FIX 1: Robust case-insensitive lookup loop handles variations safely ("vip1set1" vs "vip1Set1")
    const activeUserMerge = await prisma.taskMerge.findFirst({
      where: { 
        userId, 
        OR: [
          { vipSet: `vip${user.vipLevel}set${currentSet}` },
          { vipSet: `vip${user.vipLevel}Set${currentSet}` }
        ],
        status: 'active' 
      },
      orderBy: { createdAt: 'desc' }
    })

    let productsToAssign = []
    let isMergedTask = false

    if (activeUserMerge) {
      // FLOW A: Merged Task Mode Active
      isMergedTask = true
      
      // FIX 2: Pull the real names and custom prices straight out of the user's active row JSON column!
      const userPairs = typeof activeUserMerge.pairs === 'string' ? JSON.parse(activeUserMerge.pairs) : activeUserMerge.pairs
      const targetTaskOrders = userPairs.map(p => p.taskOrder)

      targetTaskOrders.forEach(tOrder => {
        const fileMatch = fileSet.find(p => (p.taskOrder || p.id) === tOrder)
        const customAdminEdit = userPairs.find(u => u.taskOrder === tOrder)

        if (fileMatch) {
          productsToAssign.push({
            ...fileMatch,
            // Uses the admin's custom edited values if they exist, otherwise falls back to file baseline
            name: customAdminEdit?.name || fileMatch.name,
            price: customAdminEdit?.price ? parseFloat(customAdminEdit.price) : fileMatch.price
          })
        }
      })
    } else {
      // FLOW B: Standard Single Task Mode Fallback
      isMergedTask = false
      const productIdForThisTask = index + 1
      const normalProduct = fileSet.find(p => (p.taskOrder || p.id) === productIdForThisTask)
      if (normalProduct) productsToAssign.push(normalProduct)
    }

    if (productsToAssign.length === 0) return NextResponse.json({ error: 'No items found' }, { status: 400 })

    const activeProfitRate = isMergedTask ? (config.profit * 10) : config.profit

    let totalPrice = 0, totalReserveAdded = 0, totalProfit = 0
    const taskProducts = []

    productsToAssign.forEach(p => {
      const pPrice = p.price || 0
      const pOrder = p.taskOrder || p.id
      const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
      const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))
      const localImagePath = `/vip${user.vipLevel}/set${currentSet}/photo${pOrder}.jpg`
      
      totalPrice += pPrice
      totalReserveAdded += reserveAmount
      totalProfit += profitAmount
      
      taskProducts.push({ 
        photoId: pOrder, dataId: pOrder, taskOrder: pOrder, name: p.name, 
        image: localImagePath, price: pPrice, profit: profitAmount, reserveAmount 
      })
    })

    if (user.walletBalance < totalPrice) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    const taskCode = generateTaskCode()
    const newWallet = parseFloat((user.walletBalance - totalPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + totalReserveAdded).toFixed(2))

    // Safe mathematical formatting parameters to prevent schema errors
    const finalTotalPrice = parseFloat(totalPrice.toFixed(2))
    const finalTotalProfit = parseFloat(totalProfit.toFixed(2))
    const firstProductId = taskProducts.length > 0 ? taskProducts[0].taskOrder : 0

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId, tasksInCurrentSet: index },
        data: { walletBalance: newWallet, holdAmount: newHold, currentTaskProducts: taskProducts, activeProducts: taskProducts }
      }),
      prisma.task.create({
        data: {
          userId, vipLevel: user.vipLevel, setNumber: currentSet,
          progress: `${index + 1}/${config.tasksPerSet}`,
          productId: firstProductId,
          price: finalTotalPrice, totalPrice: finalTotalPrice, totalProfit: finalTotalProfit, status: 'pending', taskCode
        }
      })
    ])

    return NextResponse.json({ success: true, user: await prisma.user.findUnique({ where: { id: userId } }), currentTaskNumber: index + 1 })
  } catch (err) {
    console.error(err); return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
