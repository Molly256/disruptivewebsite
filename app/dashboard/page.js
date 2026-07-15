'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

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
    if (type === 'cert') return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><circle cx="12" cy="12" r="3"/></svg>
    if (type === 'globe') return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      
      <AppHeader />

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

      {/* 2. TEXT INTRO + RED NOTICE BAR */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ color: '#000', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px', fontWeight: '300' }}>
          We are a digitally native design agency evolving brands through creative vision & technology.
        </p>
        <div style={{ 
          background: '#cc0000', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          position: 'relative'
        }}>
          <span style={{ fontSize: '20px', lineHeight: '1' }}>🔔</span>
          <p style={{ 
            color: '#000', 
            fontSize: '13px', 
            fontWeight: '500', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            Thank you for your support on the disruptive advertising platform. kindly read rules and regulations. Thank you.
          </p>
        </div>
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

      <BottomNav />
    </div>
  )
}