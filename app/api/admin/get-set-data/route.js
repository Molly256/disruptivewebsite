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
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const fileName = `vip${vipLevel}Set${set}.js`
    const folderPath = `vip${vipLevel}/day${day}`

    let filePath = path.join(process.cwd(), 'data', folderPath, fileName)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'data-source', folderPath, fileName)
    }
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Not found: ${folderPath}/${fileName}` }, { status: 404 })
    }

    let items
    try {
      let fileContent = fs.readFileSync(filePath, 'utf8')
      fileContent = fileContent.replace(/^\uFEFF/, '')
      
      // FIX: extract only array [ ... ], ignore // comments and export lines
      const start = fileContent.indexOf('[')
      const end = fileContent.lastIndexOf(']')
      if (start === -1 || end === -1) {
        throw new Error('No array found in file')
      }
      const arrayStr = fileContent.substring(start, end + 1)

      items = Function(`"use strict"; return (${arrayStr})`)()
    } catch (err) {
      console.error('File compilation error at', filePath, err)
      return NextResponse.json({ error: `File ${fileName} parse failed: ${err.message}` }, { status: 500 })
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
        rating: item.rating || 5.0,
        image: `/vip${vipLevel}/day${day}/set${set}/photo${taskNum}.jpg`
      }
    })

    return NextResponse.json({ items: formattedItems })
  } catch (e) {
    console.error('Fetch Task Set API Crash:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}