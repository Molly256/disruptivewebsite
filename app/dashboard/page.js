'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function Dashboard() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)

    const fetchUser = async () => {
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        router.push('/login')
        return
      }

      const localUser = JSON.parse(savedUser)
      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('user')
          router.push('/login')
        }
      } catch (e) {
        console.error(e)
        setUser(localUser)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    return () => window.removeEventListener('resize', checkScreen)
  }, [router])

  const clicks = [
    { name: 'Deposit', emoji: '💰', url: '/deposit' }, // NEW
    { name: 'Withdraw', emoji: '🏦', url: '/withdraw' }, // NEW
    { name: 'Event', emoji: '📅', url: '/event' }, // calendar emoji
    { name: 'VIP Levels', emoji: '💎', url: '/viplevels' }, // diamond emoji
    { name: 'FAQs', emoji: '❓', url: '/faqs' }, // question emoji
    { name: "T&C's", emoji: '📄', url: '/terms' }, // document emoji
    { name: 'Certificate', emoji: '🏆', url: '/certificate' }, // trophy emoji
    { name: 'About Us', emoji: 'ℹ️', url: '/about' } // info emoji
  ]

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

      {/* 2. NOTICE BAR ONLY - REMOVED WELCOME TEXT */}
      <div style={{ padding: '20px 20px 0' }}>
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

      {/* 3. SPECIALIZE + SERVICES SECTION */}
      <div style={{ background: '#000', padding: '40px 20px' }}>
        <h1 style={{ color: '#FFF', fontSize: '22px', fontWeight: '800', lineHeight: '1.3', marginBottom: '16px' }}>
          WE SPECIALIZE IN HELPING B2B<br/>AND ECOMMERCE BUSINESSES<br/>DOMINATE THE DIGITAL SPACE.
        </h1>
        <button style={{ background: 'none', border: '1px solid #FFF', color: '#FFF', borderRadius: '20px', padding: '8px 20px', fontSize: '13px', marginBottom: '40px' }}>About us</button>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <h2 style={{ color: '#FFF', fontSize: '28px', fontWeight: '800', margin: 0 }}>OUR<br/>SERVICES<span style={{color:'#FF6A00'}}>.</span></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ background: '#FFF', color: '#000', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>Web Design</span>
            <span style={{ background: '#FFF', color: '#000', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>SEO</span>
            <span style={{ background: '#FFF', color: '#000', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>Social Media Marketing</span>
            <span style={{ background: '#FFF', color: '#000', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>Shopify Brand Development</span>
          </div>
        </div>

        <p style={{ color: '#CCC', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          At Disruptive, we don't just offer services—we deliver <span style={{fontWeight:700, color:'#FFF'}}>strategic solutions</span> designed to drive your business forward. Whether you're looking to build a brand from scratch or scale an established one, our expert team is ready to help you spark real growth.
        </p>

        {/* HOT RED ROWS WITH BLACK TEXT - 6 ROWS */}
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

      {/* 4. LOGO + COPYRIGHT FOOTER */}
      <div style={{ background: '#000', padding: '40px 20px', textAlign: 'center' }}>
        <img src="/public/logo.png" alt="Logo" style={{ width: '120px', height: 'auto', marginBottom: '12px' }} />
        <div style={{ color: '#fff', fontSize: '12px', fontWeight: '300' }}>
          Copyrights 2026 © DistruPtive Advertising Agency
        </div>
      </div>

      {/* 5. QUICK CLICKS GRID - 2 ROWS X 4 BUTTONS */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: '400', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>QUICK CLICKS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {clicks.map((item) => (
            <button key={item.name} onClick={() => router.push(item.url)} style={{ background: '#cc0000', border: 'none', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#000', textAlign: 'center' }}>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}