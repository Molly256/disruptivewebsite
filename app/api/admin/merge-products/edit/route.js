import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const { vipSet, imageId, newData } = await req.json() // imageId = "shoe1.jpg"

    if(!vipSet ||!imageId) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

    const filePath = path.join(process.cwd(), 'data', `${vipSet}.json`)

    // 1. Create file if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]')
    }

    // 2. Read current data
    const oldData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // 3. Update or Add item
    const itemIndex = oldData.findIndex(item => item.id === imageId)
    if(itemIndex > -1){
      oldData[itemIndex] = {...oldData[itemIndex],...newData }
    } else {
      oldData.push({ id: imageId,...newData })
    }

    // 4. Write back
    fs.writeFileSync(filePath, JSON.stringify(oldData, null, 2))

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Edit merge error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}