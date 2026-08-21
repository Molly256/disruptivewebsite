import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipLevel, day, setNum, data, adminId } = await req.json()

    if (!vipLevel || !day || !setNum || !data) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const v = Number(vipLevel)
    const d = Number(day)
    const s = Number(setNum)

    const fileName = `vip${v}Set${s}.js`
    const folderPath = path.join(process.cwd(), 'data', `vip${v}`, `day${d}`)
    const filePath = path.join(folderPath, fileName)

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    // load existing file
    let existingItems = []
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const clean = content.replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '').trim().replace(/;$/, '')
        existingItems = Function(`"use strict"; return (${clean})`)()
      } catch {
        existingItems = []
      }
    }

    // merge edited prices
    const editedMap = new Map(data.map(i => [Number(i.taskOrder || i.id), i]))
    
    let merged = []
    if (existingItems.length > 0) {
      merged = existingItems.map(item => {
        const num = Number(item.taskOrder || item.id)
        if (editedMap.has(num)) {
          const edit = editedMap.get(num)
          return {
            ...item,
            name: edit.name ?? item.name,
            price: parseFloat(edit.price ?? item.price)
          }
        }
        return item
      })
    } else {
      merged = data
    }

    const fileContent = `export const vip${v}Set${s} = ${JSON.stringify(merged, null, 2)};\n`
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      message: `File ${fileName} saved for ALL users` 
    })

  } catch (e) {
    console.error('SAVE FILE ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}