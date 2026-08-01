import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipSet = searchParams.get('vipSet') // "vip1set1"

    if(!vipSet) return NextResponse.json({ error: 'vipSet required' }, { status: 400 })

    const vipLevel = vipSet.replace('set1','').replace('set2','') // "vip1"
    const setNum = vipSet.includes('set1')? 'set1' : 'set2' // "set1"

    const imgDir = path.join(process.cwd(), 'public', vipLevel, setNum)
    const dataFile = path.join(process.cwd(), 'data', `${vipSet}.json`)

    // 1. Load JSON data
    const imageData = fs.existsSync(dataFile)? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : []

    // 2. Load images from public folder
    if (!fs.existsSync(imgDir)) return NextResponse.json({ photos: [] })

    const files = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))

    const photos = files.map(filename => {
      const data = imageData.find(d => d.id === filename) || { price: 0, title: filename, commission: 0 }
      return {
        id: filename, // "shoe1.jpg"
        url: `/${vipLevel}/${setNum}/${filename}`, // "/vip1/set1/shoe1.jpg"
        title: data.title || filename,
        price: data.price || 0,
        commission: data.commission || 0
      }
    })

    return NextResponse.json({ photos })
  } catch (e) {
    console.error('List merge error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}