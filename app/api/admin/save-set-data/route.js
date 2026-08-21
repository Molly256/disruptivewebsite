import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { vipLevel, day, setNum, data, adminId } = body

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

    // 2. 🎯 FIND THE TARGET USER WHO IS CURRENTLY ASSIGNED TO THIS SET LAYOUT
    const targetUser = await prisma.user.findFirst({
      where: {
        vipLevel: v,
        currentDay: d,
        currentSet: s
      }
    })

    if (!targetUser) {
      return NextResponse.json({ 
        error: `No live user found currently matching VIP ${v}, Day ${d}, Set ${s}` 
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
      // Look for a corresponding modified item matches sent from your active edit admin menu layout rows
      const matchingAdminEditItem = data.find(edit => 
        Number(edit.taskOrder) === Number(originalProduct.id) || 
        Number(edit.id) === Number(originalProduct.id) ||
        Number(edit.taskOrder) === Number(originalProduct.taskOrder)
      )

      if (matchingAdminEditItem) {
        return {
          ...originalProduct,
          name: matchingAdminEditItem.name,
          price: parseFloat(matchingAdminEditItem.price),
          rating: parseFloat(matchingAdminEditItem.rating || originalProduct.rating || 5.0)
        }
      }
      return originalProduct // Leave unedited product items completely untouched
    })

    // If their profile row arrays were empty, fall back directly onto remapped incoming template fields
    const finalProductsJsonBlock = updatedTaskSnapshot.length > 0 ? updatedTaskSnapshot : data.map(item => ({
      id: item.id || item.taskOrder,
      name: item.name,
      rating: item.rating || 5.0,
      price: parseFloat(item.price),
      image: item.image
    }))

    // 5. 🎯 MUTATE THE USER ROW JSON WITH YOUR CHANGES (NO READ-ONLY FILE CRASHES)
    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        currentTaskProducts: finalProductsJsonBlock,
        activeProducts: finalProductsJsonBlock // Sync active mirror copy seamlessly
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
