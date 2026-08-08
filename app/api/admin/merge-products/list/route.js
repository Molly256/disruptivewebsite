import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const vipSet = searchParams.get('vipSet') // vip1set1

    if(!vipSet) return NextResponse.json({ error: 'vipSet required' }, { status: 400 })

    const vip = vipSet.match(/vip(\d)/)[1]
    const set = vipSet.match(/set(\d)/)[1]

    // 1. Get photos from public/vip1/set1/
    const photoDir = path.join(process.cwd(), 'public', `vip${vip}`, `set${set}`)
    let photos = []
    if(fs.existsSync(photoDir)) {
      const files = fs.readdirSync(photoDir).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
      photos = files.map((f, i) => ({
        id: `${vipSet}-photo-${i+1}`,
        type: 'photo',
        url: `/vip${vip}/set${set}/${f}`,
        title: f.split('.')[0],
        price: 0, // photos don't have price
        taskOrder: i + 1
      }))
    }

    // 2. Get data from /data/vip1Set1.js
    const dataPath = path.join(process.cwd(), 'data', `vip${vip}Set${set}.js`)
    let dataItems = []
    if(fs.existsSync(dataPath)) {
      delete require.cache[require.resolve(dataPath)] // clear cache
      const dataModule = require(dataPath)
      const arr = dataModule.default || []
      dataItems = arr.map((d, i) => ({
        id: `${vipSet}-data-${i+1}`,
        type: 'data',
        url: '', // data has no image
        title: d.title || `Task ${i+1}`,
        price: parseFloat(d.price || 0),
        taskOrder: i + 1
      }))
    }

    return NextResponse.json({ photos: [...photos,...dataItems] })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}