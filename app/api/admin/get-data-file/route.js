import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipSet = searchParams.get('vipSet') // "vip1Set1"

    if(!vipSet) return NextResponse.json({ error: 'Missing vipSet' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/i)[1]
    const set = vipSet.match(/Set(\d)/i)[1]
    const varName = `vip${vip}Set${set}`

    // FIX: Go up 3 levels from /app/api/admin/get-data-file to project root
    const dataPath = path.join(process.cwd(), '..', '..', '..', 'data', `vip${vip}Set${set}.js`)

    if(!fs.existsSync(dataPath)) {
      console.log("Trying path:", dataPath)
      return NextResponse.json({ error: `File not found: ${dataPath}` }, { status: 404 })
    }

    delete require.cache[require.resolve(dataPath)]
    const dataArr = require(dataPath)[varName] || []

    return NextResponse.json(dataArr)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}