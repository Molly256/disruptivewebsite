import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// POST = SAVE MERGE TO DB
export async function POST(req) {
  try {
    const { userId, vipSet, pairs, adminId } = await req.json()
    // pairs: [{taskOrder: 1}, {taskOrder: 2}] <-- ONLY taskOrder now

    if(!userId ||!vipSet ||!pairs || pairs.length === 0) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Save to TaskMerge table for history
    await prisma.taskMerge.create({
      data: { userId, vipSet, pairs }
    })

    // 2. Save to User.mergedTasks Json field for admin view
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const mergedTasks = user.mergedTasks || []
    mergedTasks.push({ vipSet, pairs, createdAt: new Date() })

    // 3. CRITICAL: Set currentTaskProducts so user can actually do the tasks
    await prisma.user.update({
      where: { id: userId },
      data: {
        mergedTasks,
        currentTaskProducts: pairs,
        activeProducts: pairs
      }
    })

    // 4. Admin Log
    await prisma.adminLog.create({
      data: { adminId, action: `Merged ${pairs.length} tasks for user ${userId} in ${vipSet}` }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Merge error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT = EDIT /data/vip1Set1.js FILE - FIXED TO USE taskOrder
export async function PUT(req) {
  try {
    const { vipSet, taskOrder, newData } = await req.json()
    // taskOrder: 3 means edit 3rd item in array. newData = {name: "New Name", price: 12.5}

    if(!vipSet ||!taskOrder) return NextResponse.json({ error: 'vipSet, taskOrder required' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/)[1]
    const set = vipSet.match(/set(\d)/)[1]
    const idx = taskOrder - 1 // task 3 = index 2

    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)

    if(!fs.existsSync(dataPath)) return NextResponse.json({ error: 'Data file not found' }, { status: 404 })

    delete require.cache[require.resolve(dataPath)]
    let dataArr = require(dataPath).default

    // Update the item
    dataArr[idx] = {...dataArr[idx],...newData }

    const fileContent = `export default ${JSON.stringify(dataArr, null, 2)}`
    fs.writeFileSync(dataPath, fileContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Edit error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}