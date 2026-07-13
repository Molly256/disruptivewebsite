'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const clicks = [
    { name: 'Event', icon: 'calendar', url: '/event' },
    { name: 'VIP Level', icon: 'diamond', url: '/vip' },
    { name: 'FAQs', icon: 'chat', url: '/faqs' },
    { name: "T&C's", icon: 'terms', url: '/terms' },
    { name: 'Certificate', icon: 'cert', url: '/certificate' },
    { name: 'About Us', icon: 'globe', url: '/about' }
  ]

  const getIcon = (type) => {
    const props = { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "#000", strokeWidth: "1.5" }
    if (type === 'calendar') return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#000">30</text></svg>
    if (type === 'diamond') return <svg {...props}><path d="M6 3h12l4 6-10 12L2 9l4-6zM2 9h20M8.5 9l3.5 12M15.5 9l-3.5 12M6 3l6 6 6-6"/></svg>
    if (type === 'chat') return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></svg>
    if (type === 'terms') return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    if (type === 'cert') return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#000" strokeWidth="2"><path d="M16 4 L26 8 V16 C26 22 16 28 C16 28 6 22 6 16 V8 L16 4 Z"/><polyline points="12 16 15 19 21 13"/></svg>
    if (type === 'globe') return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      
      {/* DASHBOARD HEADER - 64PX PROFILE ICON */}
      <div style={{ 
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        height: '64px',
        borderBottom: '1px solid #eee',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <img
            src="/logo.png"
            alt="Disruptive"
            style={{
              height: '32px',
              width: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          height: '100%'
        }}>
          <button
            onClick={() => router.push('/contact')}
            style={{
              background: '#e60000',
              color: '#fff',
              fontWeight: '600',
              fontSize: '15px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Contact
          </button>
          <div
            onClick={() => router.push('/profile')}
            style={{
              width: '64px',
              height: '64px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#000">
              <path d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 1. HERO VIDEO SECTION */}
      <div style={{ 
        position: 'relative', 
        height: isDesktop ? 'calc(100vh - 64px)' : '50vh', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#000', 
        overflow: 'hidden',
        zIndex: 1
      }}>
        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
          <source src="/videos/work-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. TEXT INTRO */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ color: '#000', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px', fontWeight: '300' }}>
          We are a digitally native design agency evolving brands through creative vision & technology.
        </p>
        <button onClick={() => router.push('/work')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '25px', padding: '12px 24px', fontSize: '14px', fontWeight: '300', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          View ALL Work <span>→</span>
        </button>
      </div>

      {/* 3. QUICK CLICKS GRID */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: '400', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>QUICK CLICKS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {clicks.map((item) => (
            <button key={item.name} onClick={() => router.push(item.url)} style={{ background: '#cc0000', border: 'none', borderRadius: '12px', padding: '20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              {getIcon(item.icon)}
              <span style={{ fontSize: '13px', fontWeight: '300', color: '#000' }}>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FOOTER */}
      <div style={{ background: '#000', padding: '40px 20px 140px', textAlign: 'center' }}>
        <div style={{ color: '#fff', fontSize: '12px', fontWeight: '300' }}>Copyright 2026 © disruptiveadvertising</div>
      </div>

      {/* 5. FIXED BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#000', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 0 24px', zIndex: 1000, borderTop: '1px solid #222' }}>
        <div onClick={() => router.push('/dashboard')} style={{ textAlign: 'center', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Home</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => router.push('/start')} style={{ width: '56px', height: '56px', background: '#cc0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-28px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', border: '3px solid #fff' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'repeating-radial-gradient(circle at center, #000 0px, #000 1px, #cc0000 1px, #cc0000 3px)' }}/>
          </div>
          <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300' }}>start</div>
        </div>
        <div onClick={() => router.push('/records')} style={{ textAlign: 'center', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Records</div>
        </div>
      </nav>

    </div>
  )
}