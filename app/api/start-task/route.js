import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// 🎯 SPECIFICATION FIXED: Mapped exactly to your set sizes (40, 45, 50, 55, 60)
const VIP_CONFIG = {
  1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 45, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 50, totalSets: 3, profit: 0.015 },
  4: { tasksPerSet: 55, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 60, totalSets: 3, profit: 0.025 }
}

const loadSet = (vip, day, set) => {
  try {
    const fileName = `vip${vip}Set${set}.js`
    const filePath = path.join(process.cwd(), 'data', `vip${vip}/day${day}`, fileName)
    
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const cleanJsonString = fileContent
      .replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '')
      .trim()
      .replace(/;$/, '')
      
    return eval(cleanJsonString)
  } catch (err) {
    console.error("Failed parsing task data array string:", err)
    return null
  }
}

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

    const completedCount = Number(user.taskCompleted || 0)
    const walletVal = parseFloat(user.walletBalance || 0)

    if (completedCount === 0) {
      if (walletVal < 50) {
        return NextResponse.json({ error: 'New user balance below 50 unable to continue trading' }, { status: 400 })
      }
    } else {
      if (walletVal < 0) {
        return NextResponse.json({ error: 'Your balance is negative. Please settle your current deficit to continue.' }, { status: 400 })
      }
    }

    const config = VIP_CONFIG[user.vipLevel] || VIP_CONFIG[1]
    const currentDay = user.currentDay || 1 
    const currentSet = user.currentSet || 1 
    let tasksInCurrentSet = user.tasksInCurrentSet || 0

    const userCurrentTaskNumber = tasksInCurrentSet + 1

    if (tasksInCurrentSet >= config.tasksPerSet) {
      return NextResponse.json({ error: `Set ${currentSet} completed. Contact admin to open next set.` }, { status: 400 })
    }

    const fileSet = loadSet(user.vipLevel, currentDay, currentSet)
    if (!fileSet) return NextResponse.json({ error: `Data missing or invalid for VIP${user.vipLevel} Day${currentDay} Set${currentSet}` }, { status: 400 })

    const normalProduct = fileSet.find(p => Number(p.id) === userCurrentTaskNumber)
    if (!normalProduct) return NextResponse.json({ error: `No product ${userCurrentTaskNumber} in VIP${user.vipLevel} Day${currentDay} Set${currentSet}` }, { status: 400 })

    const baseRate = (Number(normalProduct.profitPercent) / 100) || config.profit
    const bonus = Number(normalProduct.bonusMultiplier) || 1
    const activeProfitRate = baseRate * bonus

    const realImgPath = normalProduct.image && !normalProduct.image.includes('photo') && normalProduct.image !== `/photo${userCurrentTaskNumber}.jpg`
      ? normalProduct.image
      : `/vip${user.vipLevel}/day${currentDay}/set${currentSet}/photo${userCurrentTaskNumber}.jpg`

    const productsToAssign = [{
      id: userCurrentTaskNumber,
      productId: userCurrentTaskNumber,
      photoId: userCurrentTaskNumber,
      name: normalProduct.name,
      price: parseFloat(normalProduct.price || 0),
      rating: normalProduct.rating || 5.0,
      image: realImgPath, 
      profitPercent: normalProduct.profitPercent || (baseRate * 100), 
      bonusMultiplier: bonus 
    }]

    const pPrice = parseFloat(productsToAssign[0].price || 0)
    const profitAmount = parseFloat((pPrice * activeProfitRate).toFixed(2))
    const reserveAmount = parseFloat((pPrice + profitAmount).toFixed(2))

    const innerItemsSnapshot = [{
      ...productsToAssign[0],
      profit: profitAmount,
      reserveAmount
    }]

    const newWallet = parseFloat((user.walletBalance - pPrice).toFixed(2))
    const newHold = parseFloat((user.holdAmount + reserveAmount).toFixed(2))
    const progressLabelString = `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${config.tasksPerSet}`

    const updatedUser = await prisma.$transaction(async (tx) => {
      // 💡 FIXED: Explicit JSON conversion mapping ensures clean writing to disk fields
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: newWallet,
          holdAmount: newHold,
          currentTaskProducts: JSON.stringify(innerItemsSnapshot),
          activeProducts: JSON.stringify(innerItemsSnapshot),
          tasksInCurrentSet: userCurrentTaskNumber
        }
      })

      await tx.task.create({
        data: {
          userId,
          vipLevel: user.vipLevel,
          day: currentDay,
          setNumber: currentSet,
          progress: progressLabelString,
          status: 'pending',
          products: JSON.stringify(innerItemsSnapshot), 
          taskCode: generateTaskCode()
        }
      })

      return await tx.user.findUnique({ where: { id: userId } }) 
    })

    return NextResponse.json({ success: true, user: updatedUser }) 
  } catch (err) {
    console.error('[START-TASK CRASH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
