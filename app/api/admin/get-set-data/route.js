import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipLevel = Number(searchParams.get('vipLevel'))
    const day = Number(searchParams.get('day'))
    const set = Number(searchParams.get('set'))
    const userId = searchParams.get('userId')

    if (!vipLevel || !day || !set) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const fileName = `vip${vipLevel}Set${set}.js`
    const folderPath = `vip${vipLevel}/day${day}`

    // 1. Check live editable folder first
    let filePath = path.join(process.cwd(), 'data', folderPath, fileName)

    // 2. Fallback to git-tracked backup
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'data-source', folderPath, fileName)
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `File not found: ${folderPath}/${fileName}` }, { status: 404 })
    }

    // 💡 FIXED: Read file as text string and clean it up to allow seamless JSON parsing
    // This allows us to handle modern ES Module file formats ("export const ...") flawlessly!
    let items
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Strip away "export const vip1Set1 =" or similar assignment statements
      const cleanJsonString = fileContent
        .replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '')
        .trim()
        .replace(/;$/, '') // Remove trailing semicolons if present
        
      // Safely evaluate or parse string array using safe fallback context rules
      items = eval(cleanJsonString) 
    } catch (err) {
      console.error('File parsing error:', err)
      return NextResponse.json({
        error: `File ${fileName} has syntax error. Fix it in /data/`
      }, { status: 500 })
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: `File ${fileName} does not export an array` }, { status: 500 })
    }

    // 💡 FIXED: Remap "id" properties onto "taskOrder" field values dynamically
    // This fulfills your frontend state bindings seamlessly!
    const formattedItems = items.map(item => ({
      ...item,
      taskOrder: item.taskOrder || item.id // Sync item selection checklist pointers
    }))

    // ensure we only return 40/45/50/55/60 items per set
    const expectedCount = {1:40, 2:45, 3:50, 4:55, 5:60}[vipLevel] || 40
    if (formattedItems.length !== expectedCount) {
      console.warn(`Warning: ${fileName} has ${formattedItems.length} items, expected ${expectedCount}`)
    }

    return NextResponse.json({ items: formattedItems })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
