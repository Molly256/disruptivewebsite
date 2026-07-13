'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const headerHeight = 48

  // ONLY RENDER ON HOMEPAGE
  if (pathname!== '/') return null

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

  return (
    <>
      <style>{`
      .desktop-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }
      .menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
        }
        @media (max-width: 1024px) {
        .desktop-nav { display: none!important; }
        .menu-btn { display: flex!important; }
        }
      .desktop-nav-item {
          color: #000;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
      .desktop-talk-btn {
          background: #cc0000;
          color: #fff;
          font-weight: 500;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>

      <header className="topbar" style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        height: `${headerHeight}px`,
        borderBottom: 'none',
        boxShadow: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1002
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <img
            src="/logo.png"
            alt="Disruptive"
            className="logo-img"
            style={{
              height: '28px',
              width: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>

        <nav className="desktop-nav">
          <div className="desktop-nav-item" onClick={() => scrollTo('what-we-do')}>
            WHAT WE DO
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-help')}>
            WHO WE HELP
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="desktop-nav-item" onClick={() => scrollTo('results')}>RESULTS</div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-are')}>
            WHO WE ARE
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="desktop-nav-item" onClick={() => scrollTo('resources')}>
            RESOURCES
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button className="desktop-talk-btn" onClick={goToRegistration}>GET STARTED</button>
        </nav>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen? (
            <span style={{ color: '#000', fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>✕</span>
          ) : (
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
              <rect y="0" width="26" height="3.5" rx="1.75" fill="#000"/>
              <rect y="8.25" width="26" height="3.5" rx="1.75" fill="#000"/>
              <rect y="16.5" width="26" height="3.5" rx="1.75" fill="#000"/>
            </svg>
          )}
        </button>
      </header>

      {menuOpen && (
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
              cursor: 'pointer'
            }}
          >
            GET STARTED
          </button>
        </div>
      )}

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
    </>
  )
}