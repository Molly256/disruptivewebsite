'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [logged, setLogged] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, [])

  // 1. HIDE ENTIRE HEADER ON AUTH PAGES
  const hideHeaderRoutes = ['/registration', '/login']
  const shouldHideHeader = hideHeaderRoutes.includes(pathname)

  // 2. SIMPLIFIED HEADER: dashboard + icon pages
  const simplifiedHeaderRoutes = ['/dashboard', '/vip', '/activity', '/withdrawal', '/deposit', '/records', '/profile', '/support']
  const useSimplifiedHeader = simplifiedHeaderRoutes.includes(pathname)

  // GET STARTED only on home page
  const showGetStarted = pathname === '/'

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
      <style>{`
       .desktop-nav { display: flex; align-items: center; gap: 20px; }
       .menu-btn { display: none; }
       .dropdown-arrow {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #000;
          display: inline-block;
        }
        @media (max-width: 1024px) {
         .desktop-nav { display: none!important; }
         .menu-btn { display: block!important; }
        }
      `}</style>

      {/* TOP BAR - 56PX FIXED */}
      <header style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        height: '56px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1002
      }}>
        <img src="/logo.png" alt="Disruptive" onClick={() => router.push('/')} style={{ height: '32px', width: 'auto', display: 'block', cursor:'pointer' }} />

        {/* SIMPLIFIED HEADER: DASHBOARD + ICON PAGES */}
        {useSimplifiedHeader? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push(logged? '/support/chat' : '/support/guest')}
              style={{
                background: '#cc0000',
                color: '#fff',
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
            {logged && <div
              onClick={() => router.push('/profile')}
              style={{
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>}
          </div>
        ) : (
          <>
            {/* FULL HEADER: HOME PAGE + NORMAL PAGES */}
            <nav className="desktop-nav">
              {Object.keys(menuData).map(t => (
                <div key={t} onClick={() => scrollTo(t.toLowerCase().replace(/ /g,'-'))} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px', cursor:'pointer', fontWeight:500, fontSize:14 }}>
                  {t}{t!=='RESULTS'&&<span className="dropdown-arrow" />}
                </div>
              ))}
              {showGetStarted && (
                <button onClick={goToRegistration} style={{ background: '#cc0000', color: '#fff', fontWeight: '500', border: 'none', padding:'10px 20px', borderRadius:4, cursor:'pointer' }}>GET STARTED</button>
              )}
            </nav>

            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
              {menuOpen? (
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6"/>
                </svg>
              ) : (
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <path d="M0 2H28M0 10H28M0 18H28" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </>
        )}
      </header>

      {/* MOBILE MENU */}
      {!useSimplifiedHeader && menuOpen && (
        <div style={{
          position: 'fixed',
          top: '56px',
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
                color: '#fff',
                border: 'none',
                padding: '16px 32px',
                fontWeight: '500',
                fontSize: '16px',
                letterSpacing: '1px',
                marginTop: '30px',
                cursor: 'pointer',
                borderRadius: 4
              }}
            >
              GET STARTED
            </button>
          )}
        </div>
      )}

      {/* FLOATING DRAGGABLE GET STARTED BUTTON - HOME ONLY */}
      {showGetStarted && (
        <div
          onClick={goToRegistration}
          style={{
            position:'fixed',
            bottom:'20px',
            right:'20px',
            zIndex:1000,
            background:'#e60000',
            color:'#fff',
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
        >
          GET STARTED
        </div>
      )}
    </>
  )
}