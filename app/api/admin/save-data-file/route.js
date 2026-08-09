import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipSet, data } = await req.json()

    if(!vipSet || !data || data.length === 0) {
      return NextResponse.json({ error: 'Missing vipSet or data' }, { status: 400 })
    }

    const vipMatch = vipSet.match(/vip(\d+)/i)
    const setMatch = vipSet.match(/Set(\d+)/i)
    
    if(!vipMatch || !setMatch) {
      return NextResponse.json({ error: 'Invalid vipSet format' }, { status: 400 })
    }

    const vip = vipMatch[1]
    const set = setMatch[1]
    const varName = `vip${vip}Set${set}`
    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)

    console.log("SAVING TO:", dataPath)

    if(!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: `File not found: ${dataPath}` }, { status: 404 })
    }

    // 1. Read existing file as text instead of require()
    const fileContent = fs.readFileSync(dataPath, 'utf8')
    
    // 2. Safely extract raw array data
    const arrayMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/)
    if (!arrayMatch) {
      return NextResponse.json({ error: 'Could not parse data array from file' }, { status: 500 })
    }
    
    let dataArr = JSON.parse(arrayMatch[0])

    // 3. Update matching items by searching for matching taskOrder safely
    data.forEach(updatedItem => {
      const targetIndex = dataArr.findIndex(item => item.taskOrder === updatedItem.taskOrder)
      
      if (targetIndex !== -1) {
        dataArr[targetIndex] = {
          ...dataArr[targetIndex],
          name: updatedItem.name,
          price: parseFloat(updatedItem.price)
        }
      }
    })

    // 4. Overwrite back into the JS file matching your format
    const newFileContent = `export const ${varName} = ${JSON.stringify(dataArr, null, 2)};\n`
    fs.writeFileSync(dataPath, newFileContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('SAVE DATA ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
