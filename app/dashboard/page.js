'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function Dashboard() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDepositPopup, setShowDepositPopup] = useState(false)
  // 🎯 STEP 1: Add a dedicated state hook for the post-login image popup card
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)

    const fetchUser = async () => {
      try {
        const savedUser = localStorage.getItem('user')
        if (!savedUser) {
          router.push('/login')
          return
        }

        const localUser = JSON.parse(savedUser)
        setUser(localUser) 

        // Call your existing /api/user?id= to get fresh data
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user) 
          localStorage.setItem('user', JSON.stringify(data.user)) 

          // 🎯 STEP 2: Check the session flag immediately on fresh landing!
          const hasJustLoggedIn = sessionStorage.getItem('showLoginNotice')
          if (hasJustLoggedIn === 'true') {
            setShowLoginPopup(true)
            sessionStorage.removeItem('showLoginNotice') // Clear it out instantly so it won't loop on refresh
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    return () => window.removeEventListener('resize', checkScreen)
  }, [router])

  const baseClicks = [
    { name: 'Deposit', emoji: '💰', action: 'deposit' },
    { name: 'Withdraw', emoji: '🏦', url: '/withdraw' },
    { name: 'Event', emoji: '📅', url: '/event' },
    { name: 'VIP Levels', emoji: '💎', url: '/viplevels' },
    { name: 'FAQs', emoji: '❓', url: '/faqs' },
    { name: "T&C's", emoji: '📄', url: '/terms' },
    { name: 'Certificate', emoji: '🏆', url: '/certificate' },
    { name: 'About Us', emoji: 'ℹ️', url: '/about' }
  ]

  const isSuperAdmin = user?.username === 'Admin256' && user?.phone === '+256712345678'

  const adminButton = { name: 'Admin Panel', emoji: '👑', url: '/admin' }
  const clicks = isSuperAdmin? [adminButton,...baseClicks] : baseClicks

  // 🎯 PRESERVED EXACTLY: Deposit button operates its own normal popup independently!
  const handleClick = (item) => {
    if (item.action === 'deposit') {
      setShowDepositPopup(true)
    } else {
      router.push(item.url)
    }
  }

  if (loading ||!user) return null

  const services = [
    'eCommerce Website Design',
    'Search Engine Optimization',
    'Social Media Marketing',
    'Pay-Per-Click (PPC)',
    'Digital Marketing Strategy',
    'Influencer Marketing'
  ]

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>

      {/* 🎯 STEP 3: LOGIN OVERLAY POPUP LAYER MODAL */}
        {/* 🎯 FIXED: FULL-SCREEN DESKTOP COVERAGE WITH SMALL RED BUTTON | MOBILE PHONE UNTOUCHED */}
      {showLoginPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)', // Solid dark background overlay for desktop focus
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999, // Floats safely over everything including headers
          padding: isDesktop ? '0' : '24px 16px 16px' 
        }}>
          <div style={{
            position: 'relative', 
            // 💡 FIXED: Expands wide on desktop for full coverage, stays compact on phone
            width: isDesktop ? '95vw' : '100%',
            maxWidth: isDesktop ? '1200px' : '340px', 
            background: 'transparent', 
            padding: 0,                
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
            {/* ✕ THE SOLE FLOATING CLOSE ANCHOR BUTTON - PHONE ONLY */}
            {!isDesktop && (
              <button 
                onClick={() => setShowLoginPopup(false)} 
                style={{
                  position: 'absolute',
                  top: '-46px', 
                  right: '4px', 
                  background: 'rgba(0,0,0,0.6)', 
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: '#FFFFFF', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  zIndex: 2
                }}
              >
                ✕
              </button>
            )}
            
            {/* RAW IMAGE FROM PUBLIC/LOGIN.JPG RENDERING WITH FULL DESKTOP SCALE */}
            <img 
              src="/login.jpg" 
              alt="Welcome Notice" 
              onError={(e) => { e.target.src = '/placeholder.jpg' }}
              style={{
                // 💡 FIXED: Changed from 'auto' to '100%' so desktop stretches it completely full screen wide!
                width: '100%',
                height: 'auto',
                maxHeight: isDesktop ? '75vh' : '70vh', 
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                padding: 0,
                borderRadius: '12px' 
              }} 
            />

            {/* 🚨 SOLID RED ACTION CLOSING BUTTON - DESKTOP ONLY */}
            {isDesktop && (
              <button 
                onClick={() => setShowLoginPopup(false)} 
                style={{
                  // 💡 FIXED: Stripped full-width. Set to a small, professional centered button size block
                  width: '160px', 
                  padding: '12px 0',
                  background: '#FF0000',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '900',
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  boxShadow: '0 4px 12px rgba(255,0,0,0.3)'
                }}
              >
                Close
              </button>
            )}

          </div>
        </div>
      )}
        
         <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
     .notice-marquee {
          display: flex;
          animation: scroll 15s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <AppHeader />

      {/* 1. HERO VIDEO SECTION */}
      <div style={{
        position: 'relative',
        height: isDesktop? 'calc(100vh - 64px)' : '50vh',
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

      {/* 2. TEXT SECTION */}
      <div style={{ background: '#FFFFFF', padding: '32px 20px 20px' }}>
        <p style={{ color: '#000', fontSize: '11px', fontWeight: '400', letterSpacing: '1px', marginBottom: '8px' }}>WE WANT YOU TO</p>
        <h1 style={{ color: '#000', fontSize: '28px', fontWeight: '800', lineHeight: '1.1', margin: 0 }}>
          DREAM BIG<br/>
          SCALE FAST<br/>
          BUILD BOLDLY
        </h1>
      </div>

      {/* 3. NOTICE BAR */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#cc0000',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <span style={{ fontSize: '20px', lineHeight: '1', flexShrink: 0 }}>🔔</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="notice-marquee">
              <p style={{ color: '#000', fontSize: '13px', fontWeight: '500', margin: 0, paddingRight: '50px' }}>
                Thank you for your support on the disruptive advertising platform. kindly read rules and regulations. Thank you.
              </p>
              <p style={{ color: '#000', fontSize: '13px', fontWeight: '500', margin: 0, paddingRight: '50px' }}>
                Thank you for your support on the disruptive advertising platform. kindly read rules and regulations. Thank you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK CLICKS GRID */}
      <div style={{ background: '#FFFFFF', padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: '400', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>QUICK CLICKS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {clicks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              style={{
                background: item.name === 'Admin Panel'? '#FF1493' : '#cc0000', // HOT PINK FOR ADMIN
                border: 'none',
                borderRadius: '12px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#000', textAlign: 'center' }}>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. WE SPECIALIZE SECTION */}
      <div style={{ background: '#FFFFFF', padding: '40px 20px' }}>
        <h1 style={{ color: '#000', fontSize: '22px', fontWeight: '800', lineHeight: '1.3', marginBottom: '16px', textAlign: 'center' }}>
          WE SPECIALIZE IN HELPING B2B<br/>AND ECOMMERCE BUSINESSES<br/>DOMINATE THE DIGITAL SPACE.
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <button style={{ background: 'none', border: '1px solid #000', color: '#000', borderRadius: '20px', padding: '6px 16px', fontSize: '12px' }}>About us</button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
          <h2 style={{ color: '#000', fontSize: '26px', fontWeight: '800', margin: 0, lineHeight: '1.1' }}>OUR<br/>SERVICES<span style={{color:'#FF6A00'}}>.</span></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>Web Design</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>SEO</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>Social Media Marketing</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>Shopify Brand Development</span>
          </div>
        </div>

        <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
          At Disruptive, we don't just offer services—we deliver <span style={{fontWeight:700, color:'#000'}}>strategic solutions</span> designed to drive your business forward. Whether you're looking to build a brand from scratch or scale an established one, our expert team is ready to help you spark real growth.
        </p>

        {/* 6. 6 HOT RED ROWS */}
        <div>
          {services.map((s, i) => (
            <div key={i} style={{
              background: '#FF0000',
              color: '#000',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>⚡ {s}</span>
              <span style={{ fontSize: '18px' }}>↗</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LOGO + COPYRIGHT FOOTER */}
      <div style={{ background: '#FFFFFF', padding: '40px 20px 140px', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '120px', height: 'auto', marginBottom: '12px' }} />
        <div style={{ color: '#000', fontSize: '12px', fontWeight: '300' }}>
          Copyrights 2026 © Distruptive Advertising Agency
        </div>
      </div>

      {/* DEPOSIT POPUP */}
      {showDepositPopup && (
        <div
          onClick={() => setShowDepositPopup(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#000', margin: '0 0 12px' }}>
              Contact Customer Service
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 20px' }}>
              To make a deposit, please contact our customer service team and they will assist you.
            </p>
            <button
              onClick={() => router.push('/contact')}
              style={{ background: '#FF0000', color: '#000', fontWeight: '800', fontSize: '16px', border: 'none', borderRadius: '10px', padding: '12px', width: '100%', cursor: 'pointer' }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}