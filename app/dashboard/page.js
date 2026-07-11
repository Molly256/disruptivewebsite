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

  const quickClicks = [
    { name: 'Event', icon: 'calendar' },
    { name: 'VIP Level', icon: 'diamond' },
    { name: 'FAQs', icon: 'chat' },
    { name: "T&C's", icon: 'docs' },
    { name: 'Certificate', icon: 'shield' },
    { name: 'About Us', icon: 'globe' }
  ]

  const getIcon = (type) => {
    const icons = {
      calendar: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill="#000">30</text>
        </svg>
      ),
      diamond: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
          <path d="M2 9h20M8.5 9l3.5 12M15.5 9l-3.5 12M6 3l6 6 6-6"/>
        </svg>
      ),
      chat: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <line x1="9" y1="10" x2="15" y2="10"/>
          <line x1="9" y1="14" x2="13" y2="14"/>
        </svg>
      ),
      docs: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M10 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H10"/>
        </svg>
      ),
      shield: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#000" strokeWidth="2">
          <path d="M16 4 L26 8 V16 C26 22 16 28 16 28 C16 28 6 22 6 16 V8 L16 4 Z"/>
          <polyline points="12 16 15 19 21 13"/>
        </svg>
      ),
      globe: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 0 0 1-4 10 15.3 0 0 1-4-10 15.3 0 0 1 4-10z"/>
        </svg>
      )
    }
    return icons[type]
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Work Video Section - 50vh mobile, 100vh desktop */}
      <div style={{
        position: 'relative',
        height: isDesktop? '100vh' : '50vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000'
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        >
          <source src="videos/work-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text + Button below video */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{
          color: '#000',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '16px',
          fontWeight: '300'
        }}>
          We are a digitally native design agency evolving brands through creative vision & technology.
        </p>
        <button
          onClick={() => router.push('/work')}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '300',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          View ALL Work <span>→</span>
        </button>
      </div>

      {/* QUICK CLICKS Section */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '400',
          color: '#666',
          letterSpacing: '1px',
          marginBottom: '16px'
        }}>
          QUICK CLICKS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {quickClicks.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Event') router.push('/event')
                else if (item.name === 'VIP Level') router.push('/vip')
                else console.log(item.name)
              }}
              style={{
                background: '#cc0000',
                border: 'none',
                borderRadius: '12px',
                padding: '20px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              {getIcon(item.icon)}
              <span style={{
                fontSize: '13px',
                fontWeight: '300',
                color: '#000'
              }}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Nav - Black background */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#000',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 0 20px',
        zIndex: 1000
      }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Home</div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#cc0000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-28px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            border: '3px solid #fff'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle at center, #000 0px, #000 1px, #cc0000 1px, #cc0000 3px)'
            }}/>
          </div>
          <div style={{
            fontSize: '10px',
            color: '#fff',
            fontWeight: '300',
            textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.5)'
          }}>
            start
          </div>
        </div>

        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
          <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Records</div>
        </div>
      </div>
    </div>
  )
}