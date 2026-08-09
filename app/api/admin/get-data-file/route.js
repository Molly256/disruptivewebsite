import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipSet = searchParams.get('vipSet')
    if(!vipSet) return NextResponse.json({ error: 'Missing vipSet' }, { status: 400 })

    const vipMatch = vipSet.match(/vip(\d+)/i)
    const setMatch = vipSet.match(/Set(\d+)/i)
    
    if(!vipMatch || !setMatch) {
      return NextResponse.json({ error: 'Invalid vipSet format' }, { status: 400 })
    }

    const vip = vipMatch[1]
    const set = setMatch[1]
    
    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)
    console.log("LOOKING FOR:", dataPath)

    if(!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: `File not found: ${dataPath}` }, { status: 404 })
    }

    // Read the JavaScript file text contents
    const fileContent = fs.readFileSync(dataPath, 'utf8')
    
    // REGEX FIX: Extracts everything inside the main outer array brackets [ ... ]
    const arrayMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/)
    if (!arrayMatch) {
      return NextResponse.json({ error: 'Could not parse clean array data from file' }, { status: 500 })
    }

    // Safely parse the extracted data string as clean JSON
    const dataArr = JSON.parse(arrayMatch[0])

    return NextResponse.json(dataArr)
  } catch (e) {
    console.error('ERROR:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
