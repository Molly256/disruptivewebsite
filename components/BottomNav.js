'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BottomNav() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)

  // check screen size on mount + resize
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // MOBILE: centered 430px pill
  // DESKTOP: full width bar
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: isDesktop ? 0 : '50%',
    right: 0,
    width: '100%',
    maxWidth: isDesktop ? '100%' : '430px',
    margin: isDesktop ? '0' : '0 auto',
    transform: isDesktop ? 'none' : 'translateX(-50%)',
    background: '#000',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: isDesktop ? '14px 0' : '12px 0 24px',
    zIndex: 1000,
    borderTop: '1px solid #222'
  }

  const iconStyle = { 
    textAlign: 'center', 
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  }

  const labelStyle = { 
    fontSize: isDesktop ? '12px' : '10px', 
    color: '#fff', 
    fontWeight: '300' 
  }

  return (
    <nav style={navStyle}>
      {/* HOME */}
      <div onClick={() => router.push('/dashboard')} style={iconStyle}>
        <svg width={isDesktop ? "28" : "24"} height={isDesktop ? "28" : "24"} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <div style={labelStyle}>Home</div>
      </div>

      {/* STARTING BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div 
          onClick={() => router.push('/starting')} 
          style={{ 
            width: isDesktop ? '68px' : '56px', 
            height: isDesktop ? '68px' : '56px', 
            background: '#cc0000', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: isDesktop ? '-34px' : '-28px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
            cursor: 'pointer', 
            border: '3px solid #fff',
            padding: '3px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              color: '#cc0000',
              fontSize: isDesktop ? '9.5px' : '8.5px',
              fontWeight: '500',
              letterSpacing: '-0.5px',
              fontFamily: 'system-ui, sans-serif'
            }}>
              disruptive
            </span>
          </div>
        </div>
        <div style={labelStyle}>Starting</div>
      </div>

      {/* RECORDS */}
      <div onClick={() => router.push('/records')} style={iconStyle}>
        <svg width={isDesktop ? "28" : "24"} height={isDesktop ? "28" : "24"} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
        <div style={labelStyle}>Records</div>
      </div>
    </nav>
  )
}