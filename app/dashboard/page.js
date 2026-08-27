'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { useT } from '@/lib/i18n'
import AdminChatModal from '@/components/AdminChatModal'
import AdminCreditScoreModal from '@/components/AdminCreditScoreModal'
import AdminRiskControlModal from '@/components/AdminRiskControlModal'

export default function Dashboard() {
  const router = useRouter()
  const t = useT()
  const [isDesktop, setIsDesktop] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDepositPopup, setShowDepositPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const [showAdminChat, setShowAdminChat] = useState(false)
  const [showCreditScore, setShowCreditScore] = useState(false)
  const [showRiskControl, setShowRiskControl] = useState(false)

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
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()
        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          const hasJustLoggedIn = sessionStorage.getItem('showLoginNotice')
          if (hasJustLoggedIn === 'true') {
            setShowLoginPopup(true)
            sessionStorage.removeItem('showLoginNotice')
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

  useEffect(() => {
    if (!user) return
    const isSuperAdminCheck = user?.username === 'Admin256' && user?.phone === '+256712345678'
    if (!isSuperAdminCheck) return
    const fetchPrismaCount = async () => {
      try{
        const res = await fetch('/api/chat/list')
        const data = await res.json()
        if(Array.isArray(data)){
          const count = data.reduce((s,c)=>s+(c.unreadAdmin||0),0)
          setUnreadCount(count)
        }
      }catch{}
    }
    fetchPrismaCount()
    const interval = setInterval(fetchPrismaCount, 3000)
    return () => clearInterval(interval)
  }, [user])

  const baseClicks = [
    { name: t('deposit'), emoji: '💰', action: 'deposit' },
    { name: t('withdraw'), emoji: '🏦', url: '/withdraw' },
    { name: t('event'), emoji: '📅', url: '/event' },
    { name: t('vipLevels'), emoji: '💎', url: '/viplevels' },
    { name: t('faqs'), emoji: '❓', url: '/faqs' },
    { name: t('terms'), emoji: '📄', url: '/terms' },
    { name: t('certificate'), emoji: '🏆', url: '/certificate' },
    { name: t('aboutUs'), emoji: 'ℹ️', url: '/about' }
  ]

  const isSuperAdmin = user?.username === 'Admin256' && user?.phone === '+256712345678'
  const adminButton = { name: t('adminPanel'), emoji: '👑', url: '/admin' }
  const chatAdminButton = { name: 'Chat', emoji: '💬', action: 'adminChat' }
  const creditScoreButton = { name: 'Credit Score', emoji: '📊', action: 'creditScore' }
  const riskControlButton = { name: 'Risk Control', emoji: '🛡️', action: 'riskControl' }
  const clicks = isSuperAdmin? [adminButton, chatAdminButton, creditScoreButton, riskControlButton,...baseClicks] : baseClicks

  const handleClick = (item) => {
    if (item.action === 'deposit') setShowDepositPopup(true)
    else if (item.action === 'adminChat') setShowAdminChat(true)
    else if (item.action === 'creditScore') setShowCreditScore(true)
    else if (item.action === 'riskControl') setShowRiskControl(true)
    else router.push(item.url)
  }

  if (loading ||!user) return null
  const services = [t('service1'),t('service2'),t('service3'),t('service4'),t('service5'),t('service6')]

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      {showLoginPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: isDesktop? '0' : '24px 16px 16px' }}>
          <div style={{ position: 'relative', width: isDesktop? '100vw' : '100%', maxWidth: isDesktop? '1100px' : '340px', background: 'transparent', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {!isDesktop && <button onClick={() => setShowLoginPopup(false)} style={{ position: 'absolute', top: '-46px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 2 }}>✕</button>}
            <img src="/login.jpg" alt="Welcome Notice" onError={(e) => { e.target.src = '/placeholder.jpg' }} style={{ width: '100%', height: 'auto', maxHeight: isDesktop? '90vh' : '70vh', objectFit: 'contain', display: 'block', margin: 0, padding: 0, borderRadius: '12px' }} />
            {isDesktop && <button onClick={() => setShowLoginPopup(false)} style={{ width: '160px', padding: '12px 0', background: '#FF0000', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', marginTop: '24px', boxShadow: '0 4px 12px rgba(255,0,0,0.3)' }}>Close</button>}
          </div>
        </div>
      )}
      <style jsx>{`@keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }.notice-marquee { display: flex; animation: scroll 15s linear infinite; white-space: nowrap; }`}</style>
      <AppHeader />
      <div style={{ position: 'relative', height: isDesktop? 'calc(100vh - 64px)' : '50vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden', zIndex: 1 }}>
        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
          <source src="/videos/work-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div style={{ background: '#FFFFFF', padding: '32px 20px 20px' }}>
        <p style={{ color: '#000', fontSize: '11px', fontWeight: '400', letterSpacing: '1px', marginBottom: '8px' }}>{t('weWantYouTo')}</p>
        <h1 style={{ color: '#000', fontSize: '28px', fontWeight: '800', lineHeight: '1.1', margin: 0 }}>{t('dreamBig')}<br/>{t('scaleFast')}<br/>{t('buildBoldly')}</h1>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ background: '#cc0000', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <span style={{ fontSize: '20px', lineHeight: '1', flexShrink: 0 }}>🔔</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="notice-marquee">
              <p style={{ color: '#000', fontSize: '13px', fontWeight: '500', margin: 0, paddingRight: '50px' }}>{t('noticeText')}</p>
              <p style={{ color: '#000', fontSize: '13px', fontWeight: '500', margin: 0, paddingRight: '50px' }}>{t('noticeText')}</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#FFFFFF', padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: '400', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>{t('quickClicks')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {clicks.map((item) => (
            <button key={item.name} onClick={() => handleClick(item)} style={{ background: (item.name === t('adminPanel') || item.name === 'Chat' || item.name === 'Credit Score' || item.name === 'Risk Control')? '#FF1493' : '#cc0000', border: 'none', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }}>
              <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#000', textAlign: 'center' }}>{item.name}</span>
              {item.name === 'Chat' && unreadCount > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#FF0000', color: '#FFF', minWidth: '20px', height: '20px', borderRadius: '50%', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #FFF' }}>{unreadCount > 99? '99+' : unreadCount}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: '#FFFFFF', padding: '40px 20px' }}>
        <h1 style={{ color: '#000', fontSize: '22px', fontWeight: '800', lineHeight: '1.3', marginBottom: '16px', textAlign: 'center' }}>{t('weSpecialize1')}<br/>{t('weSpecialize2')}<br/>{t('weSpecialize3')}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <button onClick={() => router.push('/about')} style={{ background: 'none', border: '1px solid #000', color: '#000', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', cursor: 'pointer' }}>{t('aboutUs')}</button>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
          <h2 style={{ color: '#000', fontSize: '26px', fontWeight: '800', margin: 0, lineHeight: '1.1', whiteSpace: 'pre-line' }}>{t('ourServices')}<span style={{color:'#FF6A00'}}>.</span></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{t('tagWebDesign')}</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{t('tagSEO')}</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{t('tagSMM')}</span>
            <span style={{ background: '#F1F1F1', color: '#000', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{t('tagShopify')}</span>
          </div>
        </div>
        <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>{t('disruptiveDesc1')} <span style={{fontWeight:700, color:'#000'}}>{t('disruptiveDescBold')}</span> {t('disruptiveDesc2')}</p>
        <div>{services.map((s, i) => (<div key={i} style={{ background: '#FF0000', color: '#000', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderRadius: '4px', fontWeight: '600', fontSize: '14px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>⚡ {s}</span><span style={{ fontSize: '18px' }}>↗</span></div>))}</div>
      </div>
      <div style={{ background: '#FFFFFF', padding: '40px 20px 140px', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '120px', height: 'auto', marginBottom: '12px' }} />
        <div style={{ color: '#000', fontSize: '12px', fontWeight: '300' }}>{t('copyright')}</div>
      </div>
      {showDepositPopup && (
        <div onClick={() => setShowDepositPopup(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#FFF', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#000', margin: '0 0 12px' }}>{t('contactCS')}</h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 20px' }}>{t('depositHelp')}</p>
            <button onClick={() => router.push('/contact')} style={{ background: '#FF0000', color: '#000', fontWeight: '800', fontSize: '16px', border: 'none', borderRadius: '10px', padding: '12px', width: '100%', cursor: 'pointer' }}>{t('ok')}</button>
          </div>
        </div>
      )}
      {showAdminChat && <AdminChatModal isOpen={showAdminChat} onClose={() => setShowAdminChat(false)} />}
      {showCreditScore && <AdminCreditScoreModal isOpen={showCreditScore} onClose={() => setShowCreditScore(false)} adminId={user?.id} />}
      {showRiskControl && <AdminRiskControlModal isOpen={showRiskControl} onClose={() => setShowRiskControl(false)} adminId={user?.id} />}
      <BottomNav />
    </div>
  )
}