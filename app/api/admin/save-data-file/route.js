import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipSet, data } = await req.json()
    // vipSet = "vip1Set1" data = [{taskOrder: 1, name: "New", price: 10}]

    if(!vipSet ||!data || data.length === 0) return NextResponse.json({ error: 'Missing vipSet or data' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/)[1]
    const set = vipSet.match(/Set(\d)/i)[1] // i = case insensitive
    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)
    const varName = `vip${vip}Set${set}`

    if(!fs.existsSync(dataPath)) return NextResponse.json({ error: `File not found: ${dataPath}` }, { status: 404 })

    delete require.cache[require.resolve(dataPath)]
    let dataArr = require(dataPath)[varName] // FIXED: read named export

    data.forEach(u => {
      const idx = u.taskOrder - 1
      if(dataArr[idx]) dataArr[idx] = {...dataArr[idx], name: u.name, price: parseFloat(u.price) }
    })

    const fileContent = `export const ${varName} = ${JSON.stringify(dataArr, null, 2)}` // FIXED: write named export
    fs.writeFileSync(dataPath, fileContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Save data file error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}