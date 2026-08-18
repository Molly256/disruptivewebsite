import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { prisma } from '@/lib/prisma' // ADD

export async function POST(req) {
  try {
    const body = await req.json()
    const { vipLevel, day, setNum, data, adminId } = body

    if (!vipLevel ||!day ||!setNum ||!data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // FIX 1: Validate to prevent path traversal
    const v = Number(vipLevel), d = Number(day), s = Number(setNum)
    if (![1,2,3,4,5].includes(v) || d < 1 || d > 5 || s < 1 || s > 3) {
      return NextResponse.json({ error: 'Invalid vipLevel, day, or setNum' }, { status: 400 })
    }
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'data must be an array' }, { status: 400 })
    }

    const fileName = `vip${v}Set${s}.js`
    const folderPath = `vip${v}/day${d}`
    
    const dirPath = path.join(process.cwd(), 'data', folderPath)
    const filePath = path.join(dirPath, fileName)

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Write file
    const fileContent = `module.exports = ${JSON.stringify(data, null, 2)}\n`
    fs.writeFileSync(filePath, fileContent, 'utf8')

    // FIX 2: Git commit + push
    try {
      execSync(`git add "${filePath}"`) // quotes = safe
      execSync(`git commit -m "Admin ${adminId}: Update ${folderPath}/${fileName}" --allow-empty`)
      execSync(`git push`)
      console.log('Git push success')
    } catch (gitErr) {
      console.error('Git error:', gitErr.message)
      // don't fail request, file is still saved
    }

    // FIX 3: Log to DB
    if (adminId) {
      await prisma.adminLog.create({
        data: {
          adminId,
          action: `Edited tasks for ${folderPath}/${fileName} - ${data.length} items`
        }
      })
    }

    return NextResponse.json({ success: true, message: 'File saved and pushed to git' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}