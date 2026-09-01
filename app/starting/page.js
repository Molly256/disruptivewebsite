'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { useT } from '@/lib/i18n'

const VIP_PROFIT = { 1: 0.005, 2: 0.01, 3: 0.015, 4: 0.02, 5: 0.025 }

const winnerMessages = [
  'John56 user wins 102.00 USD prize in the task.',
  'Rebella26 user wins 256.00 USD prize in the task.',
  'Davidma user wins 77.00 USD prize in the task.',
  'Venuezel user wins 88.00 USD prize in the task.',
  'Kennethpa user wins 1,000 USD prize in the task.',
  'Liam user wins 55.00 USD prize in the task.',
  'Olivia user wins 88.00 USD prize in the task.',
  'Noah user wins 2,100 USD prize in the task.',
  'Emma user wins 3,200.00 USD prize in the task.',
  'Oliver user wins 66.95 USD prize in the task.',
  'Amelia user wins 500.00 USD prize in the task.',
  'Theodore user wins 490.00 USD prize in the task.',
  'Charlotte user wins 72.00 USD prize in the task.',
  'James user wins 2500.00 USD prize in the task.',
  'Mia user wins 24.00 USD prize in the task.',
  'Henry user wins 2.00 USD prize in the task.',
  'Sophia user wins 42.00 USD prize in the task.',
  'Mateo user wins 33,500.00 USD prize in the task.',
  'Isabella user wins 770.00 USD prize in the task.',
  'Elijah user wins 7,800.76 USD prize in the task.',
  'Evelyn user wins 37.00 USD prize in the task.',
  'Lucas user wins 550.00 USD prize in the task.',
  'Ava user wins 610.00 USD prize in the task.',
  'William user wins 5,000.00 USD prize in the task.',
  'Sofia user wins 88.00 USD prize in the task.',
  'Benjamin user wins 70.76 USD prize in the task.',
  'Camila user wins 870.95 USD prize in the task.',
  'Levi user wins 30.00 USD prize in the task.',
  'Harper user wins 83.00 USD prize in the task.',
  'Ezra user wins 32.00 USD prize in the task.',
  'Luna user wins 200.00 USD prize in the task.',
  'Sebastian user wins 120.00 USD prize in the task.',
  'Eleanor user wins 65.64 USD prize in the task.',
  'Jack user wins 25.00 USD prize in the task.',
  'Violet user wins 900.00 USD prize in the task.',
  'Daniel user wins 90.00 USD prize in the task.',
  'Aurora user wins 41.00 USD prize in the task.',
  'Samuel user wins 780.00 USD prize in the task.',
  'Elizabeth user wins 52.00 USD prize in the task.',
  'Michael user wins 380.00 USD prize in the task.',
  'Eliana user wins 90.00 USD prize in the task.',
  'Grayson user wins 49.00 USD prize in the task.',
  'Hazel user wins 4,070.00 USD prize in the task.',
  'Ethan user wins 210.00 USD prize in the task.',
  'Chloe user wins 150.00 USD prize in the task.',
  'Asher user wins 679.00 USD prize in the task.',
  'Ellie user wins 40.00 USD prize in the task.',
  'John user wins 51.00 USD prize in the task.',
  'Nora user wins 88.00 USD prize in the task.',
  'Hudson user wins 40.00 USD prize in the task.',
  'Gianna user wins 32.00 USD prize in the task.',
  'Lucas user wins 40,700 USD prize in the task.',
  'Lily user wins 66.00 USD prize in the task.',
  'Leo user wins 1,330.00 USD prize in the task.',
  'Emily user wins 740.81 USD prize in the task.',
  'Elias user wins 27,400.00 USD prize in the task.',
  'Aria user wins 49.00 USD prize in the task.',
  'Kai user wins 2,000.00 USD prize in the task.',
  'Scarlett user wins 980.00 USD prize in the task.',
  'Theo user wins 77.00 USD prize in the task.',
  'Willow user wins 41.00 USD prize in the task.',
  'Owen user wins 54.00 USD prize in the task.',
  'Penelope user wins 122.90 USD prize in the task.',
  'Alexander user wins 32.00 USD prize in the task.',
  'Zoe user wins 80.00 USD prize in the task.',
  'Dylan user wins 7,450.00 USD prize in the task.',
  'Ella user wins 88.00 USD prize in the task.',
  'Gabriel user wins 80.00 USD prize in the task.',
  'Avery user wins 74.00 USD prize in the task.',
  'Santiago user wins 85.00 USD prize in the task.',
  'Elena user wins 15.00 USD prize in the task.',
  'Mason user wins 32,000.00 USD prize in the task.',
  'Abigail user wins 320.00 USD prize in the task.',
  'Julian user wins 8,899.00 USD prize in the task.',
  'Mila user wins 20.98 USD prize in the task.',
  'David user wins 26,500.98 USD prize in the task.',
  'Lucy user wins 73.00 USD prize in the task.',
  'Joseph user wins 200.00 USD prize in the task.',
  'Isla user wins 88.00 USD prize in the task.',
  'Carter user wins 1,550.31 USD prize in the task.',
  'Ivy user wins 94.00 USD prize in the task.',
  'Matthew user wins 400.00 USD prize in the task.',
  'Layla user wins 400.15 USD prize in the task.',
  'Luke user wins 96.00 USD prize in the task.',
  'Delilah user wins 88.00 USD prize in the task.',
  'Aiden user wins 430.00 USD prize in the task.',
  'Riley user wins 81.00 USD prize in the task.',
  'Jackson user wins 30.00 USD prize in the task.',
  'Lainey user wins 25,000.00 USD prize in the task.',
  'Maverick user wins 6,420.00 USD prize in the task.',
  'Nova user wins 300.00 USD prize in the task.',
  'Miles user wins 59,500.00 USD prize in the task.',
  'Grace user wins 6,100.00 USD prize in the task.',
  'Wattle user wins 7,200.00 USD prize in the task.',
  'Goldie user wins 41.00 USD prize in the task.',
  'Thompson user wins 52.00 USD prize in the task.',
  'Winter user wins 31.00 USD prize in the task.',
  'Isaac user wins 36.00 USD prize in the task.',
  'Arabella user wins 7,200 USD prize in the task.',
  'Josiah user wins 22.00 USD prize in the task.',
  'Anastasia user wins 5000.00 USD prize in the task.',
  'Hugo user wins 85.00 USD prize in the task.',
  'Myla user wins 4,900.00 USD prize in the task.',
  'Arthur user wins 8,600.00 USD prize in the task.',
  'Leah user wins 73.00 USD prize in the task.'
]

const SCROLL_TIME = 1000
const HOLD_TIME = 900
const CYCLE_TIME = SCROLL_TIME + HOLD_TIME

const round2 = (n) => {
  const v = Math.round(Number(n) * 100) / 100
  return Math.abs(v) < 0.005? 0 : v
}
const formatMoney = (n) => {
  const num = round2(n)
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
async function loadSetData(day, set, vipLevel = 1) {
  try {
    const mod = await import(`@/data/vip${vipLevel}/day${day}/vip${vipLevel}Set${set}.js`)
    return mod.default || mod[`vip${vipLevel}Set${set}`] || []
  } catch(e) {
    console.error("Failed to load set", day, set, e)
    return []
  }
}
function StartingDetail({ products, onBack, onSubmit, vipLevel, walletBalance, holdAmount, x10Tasks, currentTaskNumber, currentDay, currentSet, isSubmitting }) {
  const [showCombo, setShowCombo] = useState(false)
  const [popupImg, setPopupImg] = useState('')
  if (!products || products.length === 0) return null
  const safeWallet = round2(walletBalance)
  const safeHold = round2(holdAmount)
  const totalPrice = round2(products.reduce((s, p) => s + Number(p.price || 0), 0))
  const totalProfit = round2(products.reduce((s, p) => {
    const baseRate = (Number(p.profitPercent) / 100) || 0.005
    const bonus = Number(p.bonusMultiplier) || 1
    const rate = baseRate * bonus
    return s + Number(p.price * rate || 0)
  }, 0))
  const totalReserve = round2(totalPrice + totalProfit)
  const holdAfter = safeHold
  const canSubmit = safeWallet >= 0
  const productSignature = products.map(p => p.productId || p.id).join('-')
  const taskCode = `${new Date().toISOString().slice(0,10).replace(/-/g,'')}-ID-${productSignature}`
  const createdAt = new Date().toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const handleSubmitClick = () => {
    if (isSubmitting) return
    const isVip1 = Number(vipLevel) === 1
    const day = Number(currentDay)
    const set = Number(currentSet)
    const taskNo = Number(currentTaskNumber)

    if (isVip1 && day === 5 && set === 3 && taskNo === 39) {
      setPopupImg('/combo.jpg')
      setShowCombo(true)
      return
    }
    if (isVip1 && day === 3 && set === 3 && taskNo === 32) {
      setPopupImg('/image50.jpg')
      setShowCombo(true)
      return
    }
    onSubmit()
  }

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#FFF', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', fontSize: 24, color: '#000', cursor: 'pointer' }}>‹</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#000' }}>Starting Detail</h1>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ background: 'transparent', margin: '16px 0', borderRadius: 16, padding: '0' }}>
          {products.map((product, idx) => {
            const d = currentDay || 1
            const s = currentSet || 1
            const t = Number(currentTaskNumber || product.taskOrder || 1)
            const imgSrc = `/vip${vipLevel || 1}/day${d}/set${s}/photo${t}.jpg`
            const baseRate = (Number(product.profitPercent) / 100) || 0.005
            const bonus = Number(product.bonusMultiplier) || 1
            const activeProfitRate = baseRate * bonus
            return (
              <div key={product.id || idx} style={{ background: '#FFF', margin: '12px 0', borderRadius: 12, padding: '16px' }}>
                <img src={imgSrc} alt={product.name || 'product'} style={{ width: '100%', height: 180, objectFit: 'contain', background: '#FFF', marginBottom: 12, display: 'block' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, color: '#333' }}>{product.name}</div>
                  <div style={{ marginBottom: 4, color: '#000' }}>⭐ {product.rating}</div>
                  <div style={{ fontWeight: 700, marginBottom: 16, color: '#000' }}>{formatMoney(product.price)} x1 USD</div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px', border: '1px solid #EEE', borderRadius: 8, padding: 10, textAlign: 'center', background: '#FFF' }}>
                    <div style={{ color: '#666', fontWeight: 700, fontSize: 11 }}>PRODUCT COST</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>{formatMoney(product.price)} <span style={{fontSize:10}}>USD</span></div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px', border: '1px solid #EEE', borderRadius: 8, padding: 10, textAlign: 'center', background: '#FFF' }}>
                    <div style={{ color: '#000', fontWeight: 700, fontSize: 11 }}>PROFIT {(activeProfitRate * 100).toFixed(2)}%</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>{formatMoney(product.price * activeProfitRate)} <span style={{fontSize:10}}>USD</span></div>
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ background: '#FFF', margin: '12px 0', borderRadius: 12, padding: '16px', color: '#000' }}>
          <div style={{ border: '1px solid #EEE', borderRadius: 8, padding: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Created At</span><span>{createdAt}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Task Code</span><span>{taskCode}</span></div>
            <hr style={{margin: '8px 0', borderColor: '#EEE'}}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}><span>BALANCE</span><span style={{ color: safeWallet < 0? '#FF0000' : '#00C853' }}>{formatMoney(safeWallet)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}><span>TOTAL PRICE</span><span>{formatMoney(totalPrice)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}><span>TOTAL PROFIT</span><span>{formatMoney(totalProfit)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}><span>HOLD AMOUNT</span><span>{formatMoney(holdAfter)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}><span>TO PAY/HOLD</span><span>{formatMoney(totalReserve)} USD</span></div>
          </div>
          <button disabled={!canSubmit || isSubmitting} onClick={handleSubmitClick} style={{ width: '100%', background:!canSubmit || isSubmitting? '#CCC' : '#FF0000', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor:!canSubmit || isSubmitting? 'not-allowed' : 'pointer' }}>{isSubmitting? 'Submitting...' : 'Submit'}</button>
        </div>
      </div>
    </div>
    <BottomNav />
    {showCombo && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#FFF', borderRadius: 16, overflow: 'hidden', maxWidth: 400, width: '100%' }}>
          <img src={popupImg} alt="popup" style={{ width: '100%', display: 'block' }} />
          <div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => { setShowCombo(false); onSubmit(); }} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '8px 28px', borderRadius: 999, fontWeight: 800, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

function TVVideo() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const TV_KEY = 'tv_channel_start_v2'
    let isSeeking = false
    const getElapsed = () => {
      let start = localStorage.getItem(TV_KEY)
      if (!start) {
        start = Date.now().toString()
        localStorage.setItem(TV_KEY, start)
      }
      return (Date.now() - parseInt(start)) / 1000
    }
    const syncLive = () => {
      if (!v.duration ||!isFinite(v.duration) || v.duration === 0) return
      if (isSeeking) return
      try {
        isSeeking = true
        const elapsed = getElapsed()
        const target = elapsed % v.duration
        if (Math.abs(v.currentTime - target) > 1.5) {
          v.currentTime = target
        }
        v.play().catch(()=>{})
      } catch {}
      setTimeout(()=>{ isSeeking = false }, 200)
    }
    const forcePlay = () => {
      if (v.paused) v.play().catch(()=>{})
    }
    const handleLoaded = () => {
      syncLive()
      forcePlay()
    }
    v.addEventListener('loadedmetadata', handleLoaded)
    v.addEventListener('canplay', forcePlay)
    v.addEventListener('pause', forcePlay)
    v.addEventListener('ended', () => { syncLive() })
    const visHandler = () => {
      if (document.visibilityState === 'visible') {
        syncLive()
        forcePlay()
      }
    }
    document.addEventListener('visibilitychange', visHandler)
    window.addEventListener('pageshow', syncLive)
    window.addEventListener('focus', syncLive)
    window.addEventListener('touchstart', forcePlay, { passive: true })
    window.addEventListener('click', forcePlay, { passive: true })
    const playInterval = setInterval(forcePlay, 500)
    const syncInterval = setInterval(syncLive, 3000)
    if (v.readyState >= 1) handleLoaded()
    return () => {
      clearInterval(playInterval)
      clearInterval(syncInterval)
      v.removeEventListener('loadedmetadata', handleLoaded)
      v.removeEventListener('canplay', forcePlay)
      v.removeEventListener('pause', forcePlay)
      v.removeEventListener('ended', syncLive)
      document.removeEventListener('visibilitychange', visHandler)
      window.removeEventListener('pageshow', syncLive)
      window.removeEventListener('focus', syncLive)
    }
  }, [])
  return (
    <video
      ref={ref}
      src="/product-video.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      style={{
        width: '100%',
        maxWidth: '800px',
        height: 'auto',
        display: 'block',
        background: '#000',
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    />
  )
}

function WinnerTicker({ messages }){
  const innerRef = useRef(null)
  useEffect(()=>{
    const KEY='winner_ticker_start_v3'
    let start = localStorage.getItem(KEY)
    if(!start){
      start = Date.now().toString()
      localStorage.setItem(KEY, start)
    }
    const elapsed = (Date.now() - parseInt(start)) / 1000
    const DURATION = 600
    const offset = elapsed % DURATION
    if(innerRef.current){
      innerRef.current.style.animation = `scroll ${DURATION}s linear infinite`
      innerRef.current.style.animationDelay = `-${offset}s`
    }
  },[])
  return (
    <div style={{ margin: 0, padding: 0, background: '#cc0000', overflow: 'hidden' }}>
      <div ref={innerRef} style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
        {messages.map((msg, i) => (<span key={i} style={{ padding: '8px 40px 8px 0', fontSize: '13px', fontWeight: '500', color: '#FFF', flexShrink: 0 }}>{msg}</span>))}
      </div>
    </div>
  )
}

export default function StartingPage() {
  const router = useRouter()
  const t = useT()
  const [showDetail, setShowDetail] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [setSize, setSetSize] = useState(40)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const VIP_TASKS_MAP = { 1: 40, 2: 45, 3: 50, 4: 55, 5: 60 }
  const currentVipLevel = Number(user?.vipLevel || 1)
  const targetTotalTasks = Number(user?.totalTasks) || VIP_TASKS_MAP[currentVipLevel] || 40
  const tasksDone = parseInt(user?.taskCompleted || 0)
  const currentSetTasksDone = parseInt(user?.tasksInCurrentSet || 0)
  const setFinished = user? currentSetTasksDone >= targetTotalTasks : false
  const parsedTaskProducts = user && user.activeProducts? (typeof user.activeProducts === 'string'? JSON.parse(user.activeProducts || '[]') : user.activeProducts) : []
  const currentTaskNumber = currentSetTasksDone + 1
  const displayTaskNumber = setFinished? targetTotalTasks : Math.min(currentTaskNumber, targetTotalTasks)
  const x10Tasks = user?.x10TaskNumbers || []

  const getNYDateString = (date) => {
    return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' })
  }

  useEffect(() => {
    const fetchUser = async () => {
      const saved = localStorage.getItem('user')
      if(!saved) { router.push('/login'); return }
      const localUser = JSON.parse(saved)
      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()
        if(res.ok && data.user) {
          let u = data.user
          u.walletBalance = round2(u.walletBalance)
          u.holdAmount = round2(u.holdAmount)
          u.todayProfit = round2(u.todayProfit || 0)
          u.specialBonus = round2(u.specialBonus || 0)
          const now = new Date()
          const todayNY = getNYDateString(now)
          if (u.lastProfitReset) {
            const lastNY = getNYDateString(new Date(u.lastProfitReset))
            if (todayNY!== lastNY) {
              const resetRes = await fetch('/api/user/reset-today', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId: u.id}) })
              const resetData = await resetRes.json()
              if (resetRes.ok && resetData.user) {
                u = resetData.user
                u.walletBalance = round2(u.walletBalance)
                u.holdAmount = round2(u.holdAmount)
                u.todayProfit = 0.00
                u.specialBonus = 0.00
              } else {
                u.todayProfit = 0.00
                u.specialBonus = 0.00
              }
            }
          } else {
            const resetRes = await fetch('/api/user/reset-today', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId: u.id}) }).catch(()=>{})
            if(resetRes){
              try{
                const rd = await resetRes.json()
                if(rd.user){
                  u = rd.user
                  u.walletBalance = round2(u.walletBalance)
                  u.holdAmount = round2(u.holdAmount)
                  u.todayProfit = 0.00
                  u.specialBonus = 0.00
                }
              }catch{}
            }
          }
          localStorage.setItem('user', JSON.stringify(u))
          setUser(u)
          const activeArray = typeof u.activeProducts === 'string'? JSON.parse(u.activeProducts || '[]') : (u.activeProducts || [])
          if(activeArray.length > 0) { setShowDetail(true) }
          const day = u.currentDay || 1
          const set = u.currentSet || 1
          const arr = await loadSetData(day, set, u.vipLevel)
          if (arr && arr.length) setSetSize(arr.length)
        } else {
          setUser(localUser)
        }
      } catch(e) {
        console.error(e)
        setUser(JSON.parse(localStorage.getItem('user') || '{}'))
      } finally { setLoading(false) }
    }
    fetchUser()
  }, [router])

  useEffect(() => {
    if (!user?.id) return
    const checkMidnight = async () => {
      const saved = localStorage.getItem('user')
      if (!saved) return
      const localUser = JSON.parse(saved)
      const now = new Date()
      const todayNY = getNYDateString(now)
      const lastResetStr = localUser.lastProfitReset || user.lastProfitReset
      if (!lastResetStr) return
      const lastNY = getNYDateString(new Date(lastResetStr))
      if (todayNY!== lastNY) {
        try {
          const resetRes = await fetch('/api/user/reset-today', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({userId: localUser.id})
          })
          const resetData = await resetRes.json()
          if (resetRes.ok && resetData.user) {
            let u = resetData.user
            u.walletBalance = round2(u.walletBalance)
            u.holdAmount = round2(u.holdAmount)
            u.todayProfit = 0.00
            u.specialBonus = 0.00
            localStorage.setItem('user', JSON.stringify(u))
            setUser(u)
          } else {
            const updated = {...localUser, todayProfit: 0.00, specialBonus: 0.00, lastProfitReset: new Date().toISOString() }
            localStorage.setItem('user', JSON.stringify(updated))
            setUser(updated)
          }
        } catch {}
      }
    }
    const interval = setInterval(checkMidnight, 30000)
    checkMidnight()
    return () => clearInterval(interval)
  }, [user?.id])

  const allMessages = [...winnerMessages,...winnerMessages,...winnerMessages]

  const handleStart = async () => {
    if (isStarting || isSubmitting) return
    if (currentSetTasksDone >= targetTotalTasks) {
      setToastMsg('Contact customer service')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
      return
    }
    if (parsedTaskProducts.length > 0) { setShowDetail(true); return }
    const balance = round2(user.walletBalance || 0)
    if (tasksDone === 0 && balance < 50.00) {
      setToastMsg('Balance below 50 unable to continue trading')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
      return
    }
    setIsStarting(true)
    setMsg('Starting...')
    try {
      const res = await fetch('/api/start-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
      const data = await res.json()
      if(res.ok && data.user) {
        data.user.walletBalance = round2(data.user.walletBalance)
        data.user.holdAmount = round2(data.user.holdAmount)
        data.user.todayProfit = round2(data.user.todayProfit || 0)
        data.user.specialBonus = round2(data.user.specialBonus || 0)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        const day = data.user.currentDay || 1
        const set = data.user.currentSet || 1
        const arr = await loadSetData(day, set, data.user.vipLevel)
        if (arr && arr.length) setSetSize(arr.length)
        setMsg('')
        setShowDetail(true)
      } else {
        if (data.error && data.error.toLowerCase().includes('completed')) {
          setToastMsg('Contact customer service')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
          setMsg('')
        } else { setMsg(data.error || 'Failed to start task') }
      }
    } catch (err) {
      console.error(err)
      setMsg('Network failure during start sequence')
    } finally {
      setIsStarting(false)
    }
  }

  const handleSubmit = async () => {
    if(!user ||!user.id) { setMsg('User not loaded. Refresh page.'); return }
    if(isSubmitting || isStarting) return
    setIsSubmitting(true)
    setMsg('Submitting...')
    try {
      const res = await fetch('/api/submit-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
      const data = await res.json()
      if(res.ok && data.user) {
        data.user.walletBalance = round2(data.user.walletBalance)
        data.user.holdAmount = round2(data.user.holdAmount)
        data.user.todayProfit = round2(data.user.todayProfit || 0)
        data.user.specialBonus = round2(data.user.specialBonus || 0)
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowDetail(false);
        if(data.isSetComplete){
          setToastMsg('Contact customer service')
          setShowToast(true)
          setTimeout(()=>setShowToast(false), 4000)
          setMsg('Set completed - Contact customer service')
        } else { setMsg('Task Completed! Payout Received'); }
      } else { setMsg(data.error || `Error ${res.status}`) }
    } catch(e) {
      console.error('submit fetch error', e)
      setMsg('Network error. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading ||!user) return null
  if (showDetail && parsedTaskProducts.length > 0) {
    return (<StartingDetail products={parsedTaskProducts} onBack={() => setShowDetail(false)} onSubmit={handleSubmit} vipLevel={user.vipLevel} walletBalance={user.walletBalance || 0} holdAmount={user.holdAmount || 0} x10Tasks={x10Tasks} currentTaskNumber={displayTaskNumber} currentDay={user.currentDay} currentSet={user.currentSet} isSubmitting={isSubmitting} />)
  }
   return (
    <>
      <AppHeader />
      {showToast && (<div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'black', color: '#FFF', padding: '12px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', zIndex: 99999, boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>{toastMsg}</div>)}
       <div className="starting-wrapper" style={{ paddingTop: '64px', paddingBottom: '90px', background: '#F2F2F2', width: '100%' }}>
        <WinnerTicker messages={allMessages} />
        <style jsx>{`@keyframes scroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); }} @keyframes fadeInOut { 0% {opacity: 0; transform: translateX(-50%) translateY(-10px)} 10% {opacity: 1; transform: translateX(-50%) translateY(0)} 90% {opacity: 1} 100% {opacity: 0; transform: translateX(-50%) translateY(-10px)} }`}</style>
       <div className="user-bar" style={{ width: '100%', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF', borderBottom: '1px solid #F0F0F0', boxSizing: 'border-box' }}>
          <div>
            <p className="user-greeting" style={{ margin: 0, fontSize: '14px', fontWeight: '400', color: '#666' }}>Hello,</p>
            <p className="user-name" style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#CC0000' }}>{user.username}</p>
          </div>
          {(() => {
            const vipLevel = Number(user.vipLevel) || 1
            const COLORS = { 1: { bg: '#5BC0BE', star: '#A3E2E2' }, 2: { bg: '#4A90E2', star: '#F5A623' }, 3: { bg: '#1ABC9C', star: '#F39C12' }, 4: { bg: '#F39C12', star: '#F1C40F' }, 5: { bg: '#E74C3C', star: '#F39C12' } }
            const c = COLORS[vipLevel]
            return (<div className="vip-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: c.bg, padding: '4px 10px', borderRadius: '8px' }}><span className="vip-text" style={{ fontSize: '15px', fontWeight: '700', color: '#FFF' }}>VIP{vipLevel}</span><svg style={{ width: '22px', height: '22px' }} fill={c.star} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>)
          })()}
        </div>
        <div style={{ width: '100%', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TVVideo />
        </div>
        <div className="starting-btn-container" style={{ padding: '24px 20px 40px 20px', position: 'relative', zIndex: 10, background: '#000', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <button onClick={handleStart} disabled={isStarting || isSubmitting} className="starting-btn" style={{ width: 'min(320px, 85vw)', background: setFinished? '#000' : isStarting? '#666' : '#FF0000', color: '#FFF', border: 'none', borderRadius: '25px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: isStarting || isSubmitting? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
            {setFinished? 'Contact Customer Service to Reset' : isStarting? 'Starting...' : `Starting (${displayTaskNumber} / ${targetTotalTasks})`}
          </button>
          {msg && <p style={{ textAlign: 'center', color: '#FF0000', marginTop: 8, fontSize: 13 }}>{msg}</p>}
        </div>
        <div style={{ background: '#FFF', padding: '20px 16px', marginTop: '8px', maxWidth: '1200px', margin: '8px auto 0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px', color: '#FF6A00' }}>⚡</div>
            <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>TODAY'S COMMISSION</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 8px 0' }}>{formatMoney(user.todayProfit || 0)} USD</div>
            <div style={{ fontSize: '12px', color: '#999' }}>The displayed amount reflects today's earned commissions.</div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px', color: '#FF6A00' }}>👛</div>
              <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px' }}>BALANCE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 8px 0', color: round2(user.walletBalance) < 0? '#FF0000' : '#000' }}>{formatMoney(user.walletBalance)} USD</div>
              <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.4' }}>The total balance reflects deposited + hold + special bonus.</div>
            </div>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px', color: '#FF6A00' }}>🧊</div>
              <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px' }}>HOLD AMOUNT</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 8px 0' }}>{formatMoney(user.holdAmount)} USD</div>
              <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.4' }}>Money for tasks not yet submitted.</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Special Bonus</div>
            <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{formatMoney(user.specialBonus)} USD</div>
          </div>
        </div>
        <div style={{ background: '#FFF', padding: '20px 16px', marginTop: '12px', textAlign: 'center', maxWidth: '1200px', margin: '12px auto 0 auto' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Important Notice</div>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Online Support Hours 09:45 - 23:10</div>
          <div style={{ fontSize: '13px' }}>Please contact online support for your assistance</div>
        </div>
        <div style={{ textAlign: 'center', padding: '30px 16px 20px 16px', background: '#000', width: '100%' }}>
          <img src="/logo.png" alt="logo" style={{ width: '120px', marginBottom: '12px' }} />
          <div style={{ fontSize: '13px', color: '#FFF' }}>Copyrights 2026 © Disruptive Advertising Agency</div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}