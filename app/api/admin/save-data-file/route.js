import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { vipSet, data } = await req.json()
    // data: [{taskOrder: 1, name: "New", price: 10}]

    if(!vipSet ||!data) return NextResponse.json({ error: 'Missing' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/)[1]
    const set = vipSet.match(/set(\d)/)[1]
    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)

    if(!fs.existsSync(dataPath)) return NextResponse.json({ error: 'File not found' }, { status: 404 })

    delete require.cache[require.resolve(dataPath)]
    let dataArr = require(dataPath).default

    data.forEach(u => {
      const idx = u.taskOrder - 1 // taskOrder 1 = index 0
      if(dataArr[idx]) dataArr[idx] = {...dataArr[idx], name: u.name, price: u.price }
    })

    const fileContent = `export default ${JSON.stringify(dataArr, null, 2)}`
    fs.writeFileSync(dataPath, fileContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}