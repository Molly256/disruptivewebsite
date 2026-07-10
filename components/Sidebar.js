'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const router = useRouter()
  const headerHeight = 84

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
      {/* TOP BAR - 84PX EXACT */}
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

        <nav className="desktop-nav">
          <div className="desktop-nav-item" onClick={() => scrollTo('what-we-do')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHAT WE DO<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-help')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE HELP<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('results')} style={{ color: '#000' }}>RESULTS</div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-are')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE ARE<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('resources')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>RESOURCES<span className="dropdown-arrow" /></div>
          <button className="desktop-talk-btn" onClick={goToRegistration} style={{ background: '#cc0000', color: '#fff', border: 'none' }}>GET STARTED</button>
        </nav>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#000', fontSize: '36px', fontWeight: '900', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
          {menuOpen? '✕' : '☰'}
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
              fontWeight: '700',
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

      {/* FLOATING DRAGGABLE GET STARTED BUTTON */}
      <div
        onClick={goToRegistration}
        style={{
          position:'fixed',
          bottom:'20px',
          right:'20px',
          zIndex:1000,
          background:'#e60000',
          color:'#000',
          fontWeight:'300',
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
    </>
  )
}