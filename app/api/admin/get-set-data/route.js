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

    if (!vipLevel ||!day ||!set) {
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

    // FIX: wrap require in try/catch + clear cache
    let items
    try {
      delete require.cache[require.resolve(filePath)]
      items = require(filePath)
    } catch (err) {
      console.error('Require error:', err)
      return NextResponse.json({
        error: `File ${fileName} has syntax error. Fix it in /data/`
      }, { status: 500 })
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: `File ${fileName} does not export an array` }, { status: 500 })
    }

    // ensure we only return 40/45/50/55/60 items per set
    const expectedCount = {1:40, 2:45, 3:50, 4:55, 5:60}[vipLevel] || 40
    if (items.length!== expectedCount) {
      console.warn(`Warning: ${fileName} has ${items.length} items, expected ${expectedCount}`)
    }

    return NextResponse.json({ items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}