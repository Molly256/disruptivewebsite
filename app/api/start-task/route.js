import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

const VIP_CONFIG = {
  1: { tasksPerSet: 40, totalSets: 3, profit: 0.005 },
  2: { tasksPerSet: 45, totalSets: 3, profit: 0.01 },
  3: { tasksPerSet: 50, totalSets: 3, profit: 0.015 },
  4: { tasksPerSet: 55, totalSets: 3, profit: 0.02 },
  5: { tasksPerSet: 60, totalSets: 3, profit: 0.025 }
}

const loadSet = async (vip, day, set) => {
  try {
    const dbConfig = await prisma.taskSetConfig.findUnique({
      where: { vipLevel_day_setNum: { vipLevel: vip, day, setNum: set } }
    })
    if (dbConfig?.data?.length > 0) return dbConfig.data
  } catch {}
  try {
    const mod = await import(`@/data/vip${vip}/day${day}/vip${vip}Set${set}.js`)
    const key = `vip${vip}Set${set}`
    return mod[key] || Object.values(mod)[0] || null
  } catch { return null }
}

const generateTaskCode = () => `${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random()*10000000).toString().padStart(10,'0')}`
const round2 = (n) => { const v = Math.round(Number(n)*100)/100; return Math.abs(v)<0.005?0:v }

export async function POST(req) {
  try {
    const { userId } = await req.json()
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: String(userId) } })
      if (!user) throw new Error('User not found')
      
      const vipLevel = Number(user.vipLevel)||1
      const config = VIP_CONFIG[vipLevel]||VIP_CONFIG[1]
      const needed = config.tasksPerSet
      const currentDay = user.currentDay||1
      const currentSet = user.currentSet||1
      const tasksInCurrentSet = user.tasksInCurrentSet||0
      const userCurrentTaskNumber = tasksInCurrentSet + 1
      
      if (tasksInCurrentSet >= needed) throw new Error(`Set ${currentSet} completed`)
      if (Number(user.taskCompleted||0)===0 && round2(user.walletBalance||0)<50) throw new Error('New user balance below 50 unable to continue trading')
      
      let activeCheck = user.activeProducts
      if (typeof activeCheck==='string'){ try{ activeCheck=JSON.parse(activeCheck)}catch{ activeCheck=[] } }
      if (Array.isArray(activeCheck)&&activeCheck.length>0) throw new Error('You have an active task. Submit it first.')
      
      const pending = await tx.task.findFirst({ where:{ userId:String(userId), status:'pending' } })
      if (pending) throw new Error('You have an active task. Submit it first.')

      // Parse user's personal task list (which contains admin edits)
      let cached=[]; 
      try { 
        cached = typeof user.currentTaskProducts==='string'? JSON.parse(user.currentTaskProducts||'[]'):(user.currentTaskProducts||[]) 
      } catch { 
        cached = [] 
      }

      let fileSet = [];
      
      // CRITICAL FIX: If admin has edited the user's layout, use it as the PRIMARY template source!
      if (Array.isArray(cached) && cached.length > 0) {
        fileSet = cached;
      } else {
        // Fall back to global configuration file/DB only if user has no customized tracking layout
        const loadedData = await loadSet(vipLevel, currentDay, currentSet)
        if (!loadedData) throw new Error(`Admin hasn't configured VIP${vipLevel} Day${currentDay} Set${currentSet}`)
        fileSet = loadedData;
      }

      // Standardize ordering and properties
      fileSet = [...fileSet].filter(Boolean).sort((a,b) => Number(a.taskOrder||a.id) - Number(b.taskOrder||b.id))

      // Keep user.currentTaskProducts perfectly uniform for subsequent operations
      const toSaveProducts = fileSet.map((p, idx) => {
        const order = Number(p.taskOrder || p.id || idx + 1)
        return { ...p, taskOrder: order, id: order }
      })

      // Pinpoint the active item matching the exact current task index milestone
      let baseProduct = toSaveProducts.find(p => Number(p.taskOrder||p.id) === userCurrentTaskNumber)
      if (!baseProduct) throw new Error(`No product ${userCurrentTaskNumber} in set configuration`)

      // Determine pricing rules: respect custom edited parameters seamlessly
      let rawPrice, realPrice
      const isEdited = baseProduct.price !== undefined; // If it came from currentTaskProducts, it carries the custom balance overrides

      if (isEdited) {
        realPrice = round2(baseProduct.price)
        rawPrice = realPrice
      } else {
        rawPrice = Number(baseProduct.price||0)
        realPrice = round2(rawPrice * Number(baseProduct.costMultiplier||1))
      }

      const baseRate = (Number(baseProduct.profitPercent)/100) || config.profit
      const bonus = Number(baseProduct.bonusMultiplier) || 1
      const profit = round2(realPrice * baseRate * bonus)

      const singleProduct = {
        id: userCurrentTaskNumber,
        taskOrder: userCurrentTaskNumber,
        productId: baseProduct.productId || baseProduct.id,
        name: baseProduct.name,
        price: realPrice,
        rawPrice: rawPrice,
        image: baseProduct.image || `/vip${vipLevel}/day${currentDay}/set${currentSet}/photo${userCurrentTaskNumber}.jpg`,
        rating: baseProduct.rating || "5.0",
        profitPercent: baseProduct.profitPercent || (baseRate * 100),
        bonusMultiplier: bonus,
        profit: profit
      }
      
      const activeSnapshot = [{ ...singleProduct, reserveAmount: round2(realPrice + profit) }]

      await tx.user.update({
        where: { id: String(userId) },
        data: {
          walletBalance: round2(Number(user.walletBalance) - realPrice),
          holdAmount: round2(realPrice),
          currentTaskProducts: toSaveProducts,
          activeProducts: activeSnapshot,
          totalTasks: needed
        }
      })

      await tx.task.create({
        data: { 
          userId: String(userId), 
          vipLevel: vipLevel, 
          day: currentDay, 
          setNumber: currentSet, 
          progress: `D${currentDay} S${currentSet} T${userCurrentTaskNumber}/${needed}`, 
          status: 'pending', 
          products: activeSnapshot, 
          taskCode: generateTaskCode() 
        }
      })

      return await tx.user.findUnique({ where: { id: String(userId) } })
    })

    return NextResponse.json({ success: true, user: result })
  } catch(err) { 
    return NextResponse.json({ error: err.message }, { status: 400 }) 
  }
}
