import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipLevel = Number(searchParams.get('vipLevel'))
    const day = Number(searchParams.get('day'))
    const set = Number(searchParams.get('set'))

    if (!vipLevel || !day || !set) {
      return NextResponse.json({ error: 'Missing required parameters: vipLevel, day, or set' }, { status: 400 })
    }

    const fileName = `vip${vipLevel}Set${set}.js`
    const folderPath = `vip${vipLevel}/day${day}`

    let filePath = path.join(process.cwd(), 'data', folderPath, fileName)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'data-source', folderPath, fileName)
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Configuration file not found: ${folderPath}/${fileName}` }, { status: 404 })
    }

    let items
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const cleanJsonString = fileContent
        .replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '')
        .trim()
        .replace(/;$/, '')
      items = Function(`"use strict"; return (${cleanJsonString})`)()
    } catch (err) {
      console.error('File compilation error:', err)
      return NextResponse.json({ error: `File ${fileName} has syntax error` }, { status: 500 })
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: `File ${fileName} did not resolve into array` }, { status: 500 })
    }

    const formattedItems = items.map((item, idx) => {
      const taskNum = item.taskOrder || item.id || (idx + 1)
      return {
        ...item,
        id: taskNum,
        taskOrder: taskNum,
        name: item.name || `Product Slot ${taskNum}`,
        price: parseFloat(item.price || 0),
        profitPercent: item.profitPercent,
        bonusMultiplier: item.bonusMultiplier,
        rating: item.rating || 5.0,
        // IMPORTANT: This requires photos in /public/vipX/dayY/setZ/photoN.jpg
        image: `/vip${vipLevel}/day${day}/set${set}/photo${taskNum}.jpg`
      }
    })

    return NextResponse.json({ items: formattedItems })
  } catch (e) {
    console.error('Fetch Task Set API Crash:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}