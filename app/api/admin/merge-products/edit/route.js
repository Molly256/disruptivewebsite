import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const { vipSet, imageId, newData } = await req.json() // imageId = vip1set1-data-3

    if(!vipSet ||!imageId) return NextResponse.json({ error: 'vipSet, imageId required' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/)[1]
    const set = vipSet.match(/set(\d)/)[1]
    const taskOrder = parseInt(imageId.split('-').pop()) // get 3 from vip1set1-data-3

    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)

    if(!fs.existsSync(dataPath)) return NextResponse.json({ error: 'Data file not found' }, { status: 404 })

    delete require.cache[require.resolve(dataPath)]
    let dataArr = require(dataPath).default

    // Update the item at taskOrder - 1
    dataArr[taskOrder - 1] = {...dataArr[taskOrder - 1],...newData }

    const fileContent = `export default ${JSON.stringify(dataArr, null, 2)}`
    fs.writeFileSync(dataPath, fileContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}