'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const headerHeight = 84

  useEffect(() => {
    setMounted(true)
    const checkAuth = () => {
      if (typeof window!== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        setIsLoggedIn(!!token ||!!user)
      }
    }
    checkAuth()
  }, [pathname])

  if (!mounted) return null

  // Strip trailing slash: /login/ becomes /login
  const path = pathname.replace(/\/$/, '') || '/'

  // /support/guest ALWAYS hides - no exceptions
  const alwaysHide = path === '/support/guest'

  // These hide ONLY when logged OUT. When logged IN, show header with logo+Contact+Profile
  const guestOnly = ['/registration', '/login', '/support', '/support/chat'].includes(path)

  const shouldHideHeader = alwaysHide || (!isLoggedIn && guestOnly)

  const useSimplifiedHeader = path!== '/' &&!shouldHideHeader
  const showGetStarted = path === '/'

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu? null : menu)
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const goToRegistration = () => {
    setMenuOpen(false)
    router.push('/registration')
  }

  const handleContactClick = () => {
    if (isLoggedIn) {
      router.push('/support/chat')
    } else {
      router.push('/support/guest')
    }
  }

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }

  const menuData = {
    'WHAT WE DO': ['All Services','Paid Search','Paid Social','SEO','Amazon','Lifecycle Marketing','CRO','Creative','Data Analytics','Lead Generation'],
    'WHO WE HELP': ['B2B','B2C','eCommerce','Local','Garage Door','SaaS','Online Education','Outdoor Sporting Goods','High AOV Brands'],
    'WHO WE ARE': ['About Us','Why Disruptive','Meet Our Team','Our Mission','Giving Back','Careers'],
    'RESULTS': [],
    'RESOURCES': ['General','Blog','Partners','Webinars/Trainings','Reviews','Contact Us']
  }

  if (shouldHideHeader) return null

  return (
    <>
      <header className="topbar" style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        height: `${headerHeight}px`,
        borderBottom: 'none',
        boxShadow: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1002
      }}>
        <img src="/logo.png" alt="Disruptive" className="logo-img" style={{ height: `${headerHeight}px`, width: 'auto', display: 'block' }} />

        {useSimplifiedHeader? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'visible' }}>
            <button
              onClick={handleContactClick}
              style={{
                background: '#cc0000',
                color: '#000',
                fontWeight: '600',
                fontSize: '16px',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Contact
            </button>
            {isLoggedIn && (
              <div
                onClick={handleProfileClick}
                style={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  borderRadius: '50%',
                  padding: '8px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <>
            <nav className="desktop-nav">
              <div className="desktop-nav-item" onClick={() => scrollTo('what-we-do')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHAT WE DO<span className="dropdown-arrow" /></div>
              <div className="desktop-nav-item" onClick={() => scrollTo('who-we-help')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE HELP<span className="dropdown-arrow" /></div>
              <div className="desktop-nav-item" onClick={() => scrollTo('results')} style={{ color: '#000' }}>RESULTS</div>
              <div className="desktop-nav-item" onClick={() => scrollTo('who-we-are')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE ARE<span className="dropdown-arrow" /></div>
              <div className="desktop-nav-item" onClick={() => scrollTo('resources')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>RESOURCES<span className="dropdown-arrow" /></div>
              {showGetStarted && (
                <button className="desktop-talk-btn" onClick={goToRegistration} style={{ background: '#cc0000', color: '#000', fontWeight: '500', border: 'none' }}>GET STARTED</button>
              )}
            </nav>

            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#000', fontSize: '36px', fontWeight: '900', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
              {menuOpen? '✕' : '☰'}
            </button>
          </>
        )}
      </header>

      {!useSimplifiedHeader && menuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed',
          top: `${headerHeight}px`,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#fff',
          zIndex: 1001,
          overflowY: 'auto',
          padding: '40px 20px'
        }}>
          {Object.keys(menuData).map((title) => (
            <div key={title} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 0',
                  cursor: 'pointer'
                }}
                onClick={() => menuData[title].length > 0? toggleMenu(title) : scrollTo(title.toLowerCase().replace(/ /g, '-'))}
              >
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#000', letterSpacing: '0.5px' }}>{title}</span>
                {menuData[title].length > 0 && (
                  <span style={{
                    color: '#cc0000',
                    fontSize: '18px',
                    transform: activeMenu === title? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}>⌄</span>
                )}
              </div>

              {activeMenu === title && menuData[title].length > 0 && (
                <div style={{ paddingLeft: '20px', paddingBottom: '10px' }}>
                  {menuData[title].map((sub) => (
                    <a key={sub} onClick={() => scrollTo(title.toLowerCase().replace(/ /g, '-'))} style={{
                      display: 'block',
                      padding: '12px 0',
                      color: '#333',
                      textDecoration: 'none',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}>
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {showGetStarted && (
            <button
              onClick={goToRegistration}
              style={{
                background: '#cc0000',
                color: '#000',
                border: 'none',
                padding: '16px 32px',
                fontWeight: '500',
                fontSize: '16px',
                letterSpacing: '1px',
                marginTop: '30px',
                cursor: 'pointer'
              }}
            >
              GET STARTED
            </button>
          )}
        </div>
      )}

      {showGetStarted && (
        <div
          onClick={goToRegistration}
          style={{
            position:'fixed',
            bottom:'20px',
            right:'20px',
            zIndex:1000,
            background:'#e60000',
            color:'#000',
            fontWeight:'500',
            fontSize:'14px',
            letterSpacing:'1px',
            padding:'16px 24px',
            borderRadius:'50px',
            cursor:'grab',
            boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
            userSelect:'none',
            touchAction:'none'
          }}
          onMouseDown={(e)=>{
            const el = e.currentTarget;
            el.style.cursor='grabbing';
            const shiftX = e.clientX - el.getBoundingClientRect().left;
            const shiftY = e.clientY - el.getBoundingClientRect().top;

            const moveAt = (pageX, pageY) => {
              el.style.left = pageX - shiftX + 'px';
              el.style.top = pageY - shiftY + 'px';
              el.style.right = 'auto';
              el.style.bottom = 'auto';
            }

            const onMouseMove = (e) => moveAt(e.clientX, e.clientY);
            document.addEventListener('mousemove', onMouseMove);

            el.onmouseup = () => {
              document.removeEventListener('mousemove', onMouseMove);
              el.onmouseup = null;
              el.style.cursor='grab';
            };
          }}
          onTouchStart={(e)=>{
            const el = e.currentTarget;
            const touch = e.touches[0];
            const shiftX = touch.clientX - el.getBoundingClientRect().left;
            const shiftY = touch.clientY - el.getBoundingClientRect().top;

            const moveAt = (pageX, pageY) => {
              el.style.left = pageX - shiftX + 'px';
              el.style.top = pageY - shiftY + 'px';
              el.style.right = 'auto';
              el.style.bottom = 'auto';
            }

            const onTouchMove = (e) => moveAt(e.touches[0].clientX, e.touches[0].clientY);
            document.addEventListener('touchmove', onTouchMove);

            el.ontouchend = () => {
              document.removeEventListener('touchmove', onTouchMove);
              el.ontouchend = null;
            };
          }}
        >
          GET STARTED
        </div>
      )}
    </>
  )
}