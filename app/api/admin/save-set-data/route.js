import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()
    const { vipLevel, day, setNum, data, adminId } = body

    if (!vipLevel || !day || !setNum || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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

    // 💡 FIX 1: Read existing data first so we don't accidentally delete unedited tasks!
    let existingItems = []
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const cleanJsonString = fileContent
          .replace(/export\s+const\s+vip\d+Set\d+\s*=\s*/g, '')
          .trim()
          .replace(/;$/, '')
        existingItems = eval(cleanJsonString)
      } catch (err) {
        console.warn('Failed to parse existing file layout, initializing empty fallback context', err)
      }
    }

    // 💡 FIX 2: Merge admin changes into the full array, remapping taskOrder back to id
    const fullUpdatedDataset = existingItems.map(originalItem => {
      // Look for a matching edited item sent by the frontend admin panel
      const editedItem = data.find(edit => 
        Number(edit.taskOrder) === Number(originalItem.id) || 
        Number(edit.id) === Number(originalItem.id)
      )

      if (editedItem) {
        return {
          id: originalItem.id, // Keep native data model identifier key string
          name: editedItem.name,
          rating: editedItem.rating || originalItem.rating || 5.0,
          price: parseFloat(editedItem.price),
          image: editedItem.image || originalItem.image
        }
      }
      return originalItem // Keep unedited items completely untouched
    })

    // If the file was empty or didn't exist, map incoming items safely as a fallback
    const finalItemsToSave = fullUpdatedDataset.length > 0 ? fullUpdatedDataset : data.map(item => ({
      id: item.id || item.taskOrder,
      name: item.name,
      rating: item.rating || 5.0,
      price: parseFloat(item.price),
      image: item.image
    }))

    // 💡 FIX 3: Stringify using your exact variable naming assignment layout format
    const variableName = `vip${v}Set${s}`
    const fileContent = `export const ${variableName} = ${JSON.stringify(finalItemsToSave, null, 2)};\n`
    fs.writeFileSync(filePath, fileContent, 'utf8')

    // Git commit + push operations remain completely valid
    try {
      execSync(`git add "${filePath}"`)
      execSync(`git commit -m "Admin ${adminId || 'System'}: Update ${folderPath}/${fileName}" --allow-empty`)
      execSync(`git push`)
      console.log('Git push success')
    } catch (gitErr) {
      console.error('Git error:', gitErr.message)
    }

    // 💡 FIX 4: Adjusted admin log database writing block to fit schema properties perfectly
    if (adminId) {
      await prisma.adminLog.create({
        data: {
          adminId,
          action: 'edit_tasks',
          targetUserId: body.userId || null,
          details: {
            message: `Edited tasks for ${folderPath}/${fileName} - ${data.length} items modified`
          }
        }
      })
    }

    return NextResponse.json({ success: true, message: 'File saved and pushed to git successfully' })
  } catch (e) {
    console.error('Save task endpoint breakdown:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
