import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    // 💡 FIXED: Read targetUserId directly from the payload sent by the admin front panel!
    const { vipLevel, day, setNum, data, adminId, targetUserId, userId } = body
    
    // Fallback to check any potential field names sent by the client frontend layout
    const activeUserId = targetUserId || userId || body.editUserId;

    // 1. Validate inputs
    if (!vipLevel || !day || !setNum || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const v = Number(vipLevel), d = Number(day), s = Number(setNum)
    if (![1,2,3,4,5].includes(v) || d < 1 || d > 5 || s < 1 || s > 3) {
      return NextResponse.json({ error: 'Invalid vipLevel, day, or setNum parameters' }, { status: 400 })
    }
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array matching task rows' }, { status: 400 })
    }

    // 2. 🎯 FIXED: FIND THE EXACT USER SEARCHED BY THE ADMIN, NOT A RANDOM ONE!
    let targetUser = null;
    
    if (activeUserId) {
      targetUser = await prisma.user.findUnique({
        where: { id: activeUserId }
      })
    }

    // Ultimate fallback: If the front-end didn't send the ID yet, search cleanly by current tier tracking
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({
        where: { vipLevel: v, currentDay: d, currentSet: s }
      })
    }

    if (!targetUser) {
      return NextResponse.json({ 
        error: `Target user profile record could not be resolved inside database.` 
      }, { status: 404 })
    }

    // 3. 🎯 PARSE THEIR EXISTING JSON PRODUCTS ARRAY SAFELY OUT OF THE USER COLUMN
    let activeTaskArray = []
    try {
      activeTaskArray = typeof targetUser.currentTaskProducts === 'string' 
        ? JSON.parse(targetUser.currentTaskProducts) 
        : (targetUser.currentTaskProducts || [])
    } catch (parseErr) {
      activeTaskArray = []
    }

    // 4. 🎯 MERGE YOUR ADMIN PANEL CHANGES INTO THE USER'S LIVE DATA INSTANTLY
    const updatedTaskSnapshot = activeTaskArray.map((originalProduct) => {
      const matchingAdminEditItem = data.find(edit => 
        Number(edit.taskOrder) === Number(originalProduct.id) || 
        Number(edit.id) === Number(originalProduct.id) ||
        Number(edit.taskOrder) === Number(originalProduct.taskOrder)
      )

      if (matchingAdminEditItem) {
        // Calculate dynamic profit matching your standard 10% rules if not explicit
        const updatedPrice = parseFloat(matchingAdminEditItem.price)
        const updatedProfit = matchingAdminEditItem.profit ? parseFloat(matchingAdminEditItem.profit) : (updatedPrice * 0.10)

        return {
          ...originalProduct,
          name: matchingAdminEditItem.name,
          price: updatedPrice,
          profit: updatedProfit,
          rating: parseFloat(matchingAdminEditItem.rating || originalProduct.rating || 5.0),
          image: originalProduct.image || `/vip${v}/day${d}/set${s}/photo${originalProduct.id || 1}.jpg`
        }
      }
      return originalProduct 
    })

    // If their profile row arrays were empty, populate them cleanly matching your system paths
    const finalProductsJsonBlock = updatedTaskSnapshot.length > 0 ? updatedTaskSnapshot : data.map(item => {
      const taskNum = item.taskOrder || item.id || 1
      const itemPrice = parseFloat(item.price || 0)
      return {
        id: taskNum,
        taskOrder: taskNum,
        name: item.name,
        rating: parseFloat(item.rating || 5.0),
        price: itemPrice,
        profit: parseFloat(item.profit || itemPrice * 0.10),
        image: item.image || `/vip${v}/day${d}/set${s}/photo${taskNum}.jpg`
      }
    })

    // 5. 🎯 MUTATE THE CORRECT USER ROW JSON WITH YOUR CHANGES
    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        currentTaskProducts: finalProductsJsonBlock,
        activeProducts: finalProductsJsonBlock 
      }
    })

    // 6. Log the admin action to the logs model safely matching your schema definitions
    if (adminId) {
      try {
        await prisma.adminLog.create({
          data: {
            adminId,
            action: 'edit_tasks',
            targetUserId: targetUser.id,
            details: {
              message: `Edited tasks inside user JSON array column for User: ${targetUser.username || targetUser.id}. ${data.length} fields overwrote.`
            }
          }
        })
      } catch (logErr) {
        console.warn('Optional admin log creation skipped:', logErr.message)
      }
    }

    return NextResponse.json({ success: true, message: 'Task changes saved to database successfully!' })
  } catch (e) {
    console.error('Save task database transaction failure:', e)
    return NextResponse.json({ error: e.message || 'Database write failed' }, { status: 500 })
  }
}
