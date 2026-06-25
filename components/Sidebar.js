'use client'
import { useState } from 'react'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu? null : menu)
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
    setContactOpen(false)
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
      {/* TOP BAR - DESKTOP TABS + MOBILE 3 DASHES */}
      <header className="topbar" style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        {/* LOGO LEFT */}
        <img src="/logo.png" alt="Disruptive" className="logo-img" style={{ height: '40px' }} />

        {/* DESKTOP NAV - CENTER/RIGHT ON DESKTOP, CSS hides on mobile */}
        <nav className="desktop-nav">
          <div className="desktop-nav-item" onClick={() => scrollTo('what-we-do')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHAT WE DO<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-help')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE HELP<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('results')} style={{ color: '#000' }}>RESULTS</div>
          <div className="desktop-nav-item" onClick={() => scrollTo('who-we-are')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>WHO WE ARE<span className="dropdown-arrow" /></div>
          <div className="desktop-nav-item" onClick={() => scrollTo('resources')} style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>RESOURCES<span className="dropdown-arrow" /></div>
          <button className="desktop-talk-btn" onClick={() => scrollTo('contact-us')} style={{ background: '#cc0000', color: '#fff', border: 'none' }}>LET'S TALK</button>
        </nav>

        {/* 3 DASHES RIGHT - MOBILE ONLY, CSS hides on desktop */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#000', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
      </header>

      {/* OVERLAY - MOBILE ONLY */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* SIDEBAR - SLIDES FROM LEFT - MOBILE ONLY */}
      <div className={`sidebar ${menuOpen? 'open' : ''}`} style={{ background: '#fff' }}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Disruptive" className="sidebar-logo-img" style={{ height: '32px' }} />
        </div>

        <div className="menu-list">
          {Object.keys(menuData).map((title) => (
            <div key={title} className="menu-item">
              <div
                className="menu-header"
                onClick={() => menuData[title].length > 0? toggleMenu(title) : scrollTo(title.toLowerCase().replace(' ', '-'))}
              >
                <span className="menu-title" style={{ color: '#000' }}>{title}</span>
                {menuData[title].length > 0 && (
                  <span className={`dropdown-arrow ${activeMenu === title? 'active' : ''}`} />
                )}
              </div>

              {activeMenu === title && menuData[title].length > 0 && (
                <div className="submenu">
                  {menuData[title].map((sub) => (
                    <a key={sub} onClick={() => scrollTo(title.toLowerCase().replace(' ', '-'))} style={{ color: '#333' }}>
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-buttons">
          {!contactOpen && (
            <button className="btn-talk-main" onClick={() => setContactOpen(true)} style={{ background: '#cc0000', color: '#fff' }}>LET'S TALK</button>
          )}

          {contactOpen && (
            <>
              <a href="https://t.me/Disruptive01" target="_blank" className="btn-telegram">TELEGRAM</a>
              <a href="https://wa.me/13475439616" target="_blank" className="btn-whatsapp">WHATSAPP</a>
              <button className="btn-back" onClick={() => setContactOpen(false)}>← BACK</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}