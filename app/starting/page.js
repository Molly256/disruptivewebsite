'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { vip1Set1 } from '@/data/vip1Set1'

const VIP_PROFIT = { 1: 0.005, 2: 0.01, 3: 0.015, 4: 0.02, 5: 0.025 } // 0.5% to 2.5%

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

function StartingDetail({ products, onBack, onSubmit, vipLevel, walletBalance }) {
  // Enforce a strict 0.5% calculation rate for VIP 1
  const profitRate = 0.005 
  
  const totalPrice = products.reduce((s, p) => s + p.price, 0)
  const totalProfit = products.reduce((s, p) => s + (p.price * profitRate), 0)
  const totalReserve = products.reduce((s, p) => s + p.reserveAmount, 0)
  
  // Create an overall invoice code using the first product in the active queue
  const taskCode = `20260729${String(products[0]?.id || 0).padStart(10, '0')}`
  const createdAt = new Date().toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  // Submit blocks cleanly if the user's overall balance drops to a negative deficit
  const isLocked = walletBalance < 0

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      {/* Header Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#FFF', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ position: 'absolute', left: 16, background: 'none', border: 'none', fontSize: 24 }}>‹</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Starting Detail</h1>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Renders each item in the product queue sequentially (handles both single products and merged combos seamlessly) */}
        {products.map(product => (
          <div key={product.id} style={{ background: '#FFF', margin: '12px 0', borderRadius: 12, padding: '16px' }}>
            {/* Uses dynamic background tracking image paths */}
            <img src={product.image || `/vip1/set1/photo${product.id}.jpg`} alt="" style={{ width: '100%', height: 220, objectFit: 'contain', background: '#FFF', marginBottom: 12 }} /> 
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{product.name}</div>
              <div style={{ marginBottom: 4 }}>⭐ {product.rating}</div>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>{product.price.toFixed(2)} x1 USD</div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px', border: '1px solid #EEE', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ color: '#FF6A00', fontWeight: 700, fontSize: 12 }}>TOTAL AMOUNT</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{product.price.toFixed(2)} <span style={{fontSize:12}}>USD</span></div>
              </div>
              <div style={{ flex: 1, minWidth: '140px', border: '1px solid #EEE', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ color: '#FF6A00', fontWeight: 700, fontSize: 12 }}>PROFIT {(profitRate * 100).toFixed(1)}%</div> 
                <div style={{ fontSize: 16, fontWeight: 800 }}>{(product.price * profitRate).toFixed(2)} <span style={{fontSize:12}}>USD</span></div> 
              </div>
            </div>
            {/* CLEAN: Warning boxes, notes, and red border flags completely removed */}
          </div>
        ))}

        {/* Shared Invoice Summary Card & Submit Trigger Actions */}
        <div style={{ background: '#FFF', margin: '12px 0', borderRadius: 12, padding: '16px' }}>
          <div style={{ border: '1px solid #EEE', borderRadius: 8, padding: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Created At</span><span>{createdAt}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Task Code</span><span>{taskCode}</span></div>
            
            {/* CLEAN: Deficits and negative pending values display inside this row natively (e.g. -$300.00 USD) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: isLocked ? '#FF0000' : '#000', fontWeight: isLocked ? '700' : '400' }}>
              <span>AVAILABLE BALANCE</span>
              <span>{(walletBalance || 0).toFixed(2)} USD</span>
            </div>
            
            <hr style={{margin: '8px 0'}}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>TOTAL PRICE</span><span>{totalPrice.toFixed(2)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#FF6A00' }}><span>TOTAL PROFIT</span><span>{totalProfit.toFixed(2)} USD</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}><span>TO PAY/HOLD</span><span>{totalReserve.toFixed(2)} USD</span></div>
          </div>

          {/* Submit button locks up automatically if user balance is short, unlocking instantly once they deposit */}
          <button 
            onClick={onSubmit} 
            disabled={isLocked}
            style={{ 
              width: '100%', 
              background: isLocked ? '#CCCCCC' : '#FF0000', 
              color: '#FFF', 
              border: 'none', 
              borderRadius: 12, 
              padding: '16px', 
              fontSize: 16, 
              fontWeight: 500,
              cursor: isLocked ? 'not-allowed' : 'pointer'
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default function StartingPage() {
  const router = useRouter()
  // FIXED: Repaired broken bracket syntax parser errors on state definitions
  const [showDetail, setShowDetail] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const setSize = vip1Set1.length
  const setFinished = user ? user.taskCompleted >= setSize : false

  useEffect(() => {
    const fetchUser = async () => {
      const saved = localStorage.getItem('user')
      if(!saved) { router.push('/login'); return }
      const localUser = JSON.parse(saved)
      
      // REMOVED: Do not set loading to false here prematurely
      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()
        if(res.ok && data.user) {
          let u = data.user
          const lastReset = new Date(u.lastProfitReset)
          const nowNY = new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
          const todayNY = new Date(nowNY).toDateString()
          const lastResetNY = lastReset.toLocaleString("en-US", { timeZone: "America/New_York" })
          const lastResetDay = new Date(lastResetNY).toDateString()
          if (todayNY !== lastResetDay) {
            await fetch('/api/user/reset-today', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId: u.id}) })
            u.todayProfit = 0
            u.lastProfitReset = new Date()
          }
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
          if(u.currentTaskProducts && u.currentTaskProducts.length > 0) {
            setShowDetail(true)
          }
        } else {
          // Fallback to local profile snapshot cache memory state data parameters if API query drops
          setUser(localUser)
        }
      } catch(e) { 
        console.error(e) 
        setUser(localUser) // Error fallback safety parameters assignment assignment rule
      } finally {
        // FIXED: Only release the initialization load screen layout block now that all parameters exist
        setLoading(false) 
      }
    }
    fetchUser()
  }, [router])


  const allMessages = [...winnerMessages,...winnerMessages,...winnerMessages]

  const handleStart = async () => {
    if (setFinished) { setMsg('Set completed. Contact Customer Service to reset.'); return }
    setMsg('Starting...')
    const res = await fetch('/api/start-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
    const data = await res.json()
    if(res.ok) { setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user)); setShowDetail(true); setMsg('') }
    else { setMsg(data.error) }
  }

  const handleSubmit = async () => {
    setMsg('Submitting...')
    const res = await fetch('/api/submit-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
    const data = await res.json()
    if(res.ok) { setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user)); setShowDetail(false); setMsg('Task Completed! Payout Received') }
    else { setMsg(data.error) }
  }

  if (loading || !user) return null
  if (showDetail && user.currentTaskProducts && user.currentTaskProducts.length > 0) {
    return (
      <StartingDetail 
        products={user.currentTaskProducts} 
        onBack={() => setShowDetail(false)} 
        onSubmit={handleSubmit} 
        vipLevel={user.vipLevel} 
        walletBalance={user.walletBalance || 0} // FIXED: Explicitly maps the active user wallet state directly into the interface calculations
      />
    )
  }

  const totalBalance = (user.walletBalance || 0) + (user.holdAmount || 0) + (user.specialBonus || 0)

  return (
    <>
      <AppHeader />

      <div className="starting-wrapper" style={{ paddingTop: '64px', paddingBottom: '90px', background: '#F2F2F2', width: '100%' }}>
        <div className="marquee-container" style={{ margin: 0, padding: 0, background: '#cc0000', overflow: 'hidden' }}>
          <div className="marquee-content" style={{ display: 'flex', animation: 'scroll 600s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
            {allMessages.map((msg, i) => (
              <span key={i} className="marquee-item" style={{ padding: '8px 40px 8px 0', fontSize: '13px', fontWeight: '500', color: '#FFF', flexShrink: 0 }}>{msg}</span>
            ))}
          </div>
        </div>

        <style jsx>{` @keyframes scroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); }}`}</style>

       <div className="user-bar" style={{ width: '100%', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF', borderBottom: '1px solid #F0F0F0', boxSizing: 'border-box' }}>
          <div>
            <p className="user-greeting" style={{ margin: 0, fontSize: '14px', fontWeight: '400', color: '#666' }}>Hello,</p>
            <p className="user-name" style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#CC0000' }}>{user.username}</p>
          </div>
          <div className="vip-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="vip-text" style={{ fontSize: '15px', fontWeight: '700', color: '#FF7A00' }}>VIP{user.vipLevel}</span>
            <svg style={{ width: '22px', height: '22px', color: '#3B82F6' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        <div style={{ width: '100%', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <video
            src="/product-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata" // FIXED: loads fast
            style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
          />
        </div>

        <div className="starting-btn-container" style={{ padding: '24px 20px 40px 20px', position: 'relative', zIndex: 10, background: '#000', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <button onClick={handleStart} disabled={setFinished} className="starting-btn" style={{ width: 'min(320px, 85vw)', background: setFinished? '#555' : '#FF0000', color: '#FFF', border: 'none', borderRadius: '25px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: setFinished? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
            {setFinished? 'Contact Customer Service to Reset' : `Starting (${user.tasksInCurrentSet || 0} / ${setSize})`}
          </button>
          {msg && <p style={{ textAlign: 'center', color: '#FF0000', marginTop: 8, fontSize: 13 }}>{msg}</p>}
        </div>

        <div style={{ background: '#FFF', padding: '20px 16px', marginTop: '8px', maxWidth: '1200px', margin: '8px auto 0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px', color: '#FF6A00' }}>⚡</div>
            <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>TODAY'S COMMISSION</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 8px 0' }}>{(user.todayProfit || 0).toFixed(2)} USD</div>
            <div style={{ fontSize: '12px', color: '#999' }}>The displayed amount reflects today's earned commissions.</div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px', color: '#FF6A00' }}>👛</div>
              <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px' }}>BALANCE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 8px 0' }}>{totalBalance.toFixed(2)} USD</div>
              <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.4' }}>The total balance reflects deposited + hold + special bonus.</div>
            </div>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px', color: '#FF6A00' }}>🧊</div>
              <div style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px' }}>HOLD AMOUNT</div>
              <div style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 8px 0' }}>{(user.holdAmount || 0).toFixed(2)} USD</div>
              <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.4' }}>Money for tasks not yet submitted.</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Special Bonus</div>
            <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{(user.specialBonus || 0).toFixed(2)} USD</div>
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