import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipLevel = Number(searchParams.get('vipLevel'))
    const day = Number(searchParams.get('day'))
    const set = Number(searchParams.get('set'))

    // 💡 VALIDATION: Ensures all critical directory navigation fields exist
    if (!vipLevel || !day || !set) {
      return NextResponse.json({ error: 'Missing required parameters: vipLevel, day, or set' }, { status: 400 })
    }

    // 💡 DYNAMIC FILE MAPPING: Targets files like /data/vip2/day4/vip2Set1.js seamlessly
    const fileName = `vip${vipLevel}Set${set}.js`
    const folderPath = `vip${vipLevel}/day${day}`

    // 1. Check live editable data folder path
    let filePath = path.join(process.cwd(), 'data', folderPath, fileName)

    // 2. Fallback to backup source directory if the primary location hasn't been instantiated yet
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'data-source', folderPath, fileName)
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Configuration file not found: ${folderPath}/${fileName}` }, { status: 404 })
    }

    // Read the specific script file as a text string and clean it up to allow seamless evaluation
    let items
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Strips away modern ES module declarations like "export const vip1Set1 =" automatically
      const cleanJsonString = fileContent
        .replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '')
        .trim()
        .replace(/;$/, '') // Cleans off trailing semicolons
        
      // Safely resolves the cleaned string array into executable memory objects
      items = eval(cleanJsonString) 
    } catch (err) {
      console.error('File compilation error:', err)
      return NextResponse.json({
        error: `File ${fileName} has a syntax error. Please inspect it inside your /data/ folder.`
      }, { status: 500 })
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: `File ${fileName} did not resolve into a standard iterable array` }, { status: 500 })
    }

    // 💡 FIXED: Dynamically matches up names, prices, and forces the true image path matching your assets!
    const formattedItems = items.map(item => {
      // Safely extract the position order slot (e.g. photo1.jpg up to photo40.jpg)
      const taskNum = item.taskOrder || item.id || 1;
      
      return {
        ...item,
        id: taskNum, // Ensures identifier consistency across admin select states
        taskOrder: taskNum,
        name: item.name || `Product Slot ${taskNum}`,
        price: parseFloat(item.price || 0),
        
        // 🎯 DYNAMIC ASSET PATH: Generates /vip2/day4/set1/photo12.jpg completely dynamically!
        image: `/vip${vipLevel}/day${day}/set${set}/photo${taskNum}.jpg`
      }
    })

    // Validate if the counts match the specific tier's structural expectations
    const expectedCount = {1:40, 2:45, 3:50, 4:55, 5:60}[vipLevel] || 40
    if (formattedItems.length !== expectedCount) {
      console.warn(`Warning: ${fileName} contains ${formattedItems.length} items, but expected count is ${expectedCount}`)
    }

    return NextResponse.json({ items: formattedItems })
  } catch (e) {
    console.error('Fetch Task Set API Crash:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
