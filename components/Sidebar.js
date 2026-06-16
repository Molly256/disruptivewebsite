'use client'
import { useState } from 'react'

export default function Sidebar({ isOpen, onClose }) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu? null : menu)
  }

  const menuData = {
    'WHAT WE DO': ['All Services','Paid Search','Paid Social','SEO','Amazon','Lifecycle Marketing','CRO','Creative','Data Analytics','Lead Generation'],
    'WHO WE HELP': ['B2B','B2C','eCommerce','Local','Garage Door','SaaS','Online Education','Outdoor Sporting Goods','High AOV Brands'],
    'WHO WE ARE': ['About Us','Why Disruptive','Meet Our Team','Our Mission','Giving Back','Careers'],
    'RESULTS': [],
    'RESOURCES': ['General','Blog','Partners','Webinars/Trainings','Reviews','Contact Us']
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: 0,
      width: '100%',
      height: 'calc(100vh - 80px)',
      background: '#fff',
      zIndex: 99,
      padding: '60px 40px',
      overflowY: 'auto'
    }}>
      <nav style={{ maxWidth: '600px', margin: '0 auto' }}>

        {Object.keys(menuData).map((title) => (
          <div key={title} style={{ marginBottom: '45px' }}>
            {/* MENU TITLE - BOLD BLACK + RED ARROW */}
            <div
              onClick={() => menuData[title].length > 0? toggleMenu(title) : onClose()}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#000', letterSpacing: '1px' }}>{title}</span>

              {menuData[title].length > 0 && (
                <span style={{
                  fontSize: '24px',
                  color: '#d40000',
                  fontWeight: '300',
                  transform: activeMenu === title? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s'
                }}>⌄</span>
              )}
            </div>

            {/* DROPDOWN */}
            {activeMenu === title && menuData[title].length > 0 && (
              <div style={{ marginTop: '25px' }}>
                {menuData[title].map((sub) => (
                  <div
                    key={sub}
                    onClick={onClose}
                    style={{
                      fontSize: '20px',
                      color: '#333',
                      fontWeight: '300',
                      cursor: 'pointer',
                      margin: '18px 0',
                      paddingLeft: '10px'
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* LET'S TALK BUTTON - RED GRADIENT */}
        {!contactOpen && (
          <button onClick={() => setContactOpen(true)} style={{
            marginTop: '40px',
            padding: '18px 40px',
            background: 'linear-gradient(180deg, #e60000 0%, #b30000 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '2px',
            cursor: 'pointer'
          }}>
            LET'S TALK
          </button>
        )}

        {contactOpen && (
          <div style={{ marginTop: '40px' }}>
            <a href="https://t.me/Disruptive01" target="_blank" style={{
              display: 'block', padding: '16px', marginBottom: '12px',
              background: '#0088cc', color: '#fff', textAlign: 'center', textDecoration: 'none',
              fontSize: '16px', fontWeight: '700'
            }}>TELEGRAM</a>
            <a href="https://wa.me/13475439616" target="_blank" style={{
              display: 'block', padding: '16px', marginBottom: '12px',
              background: '#25D366', color: '#fff', textAlign: 'center', textDecoration: 'none',
              fontSize: '16px', fontWeight: '700'
            }}>WHATSAPP</a>
            <button onClick={() => setContactOpen(false)} style={{
              width: '100%', padding: '16px', background: '#f0f0f0', color: '#000',
              border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}>← BACK</button>
          </div>
        )}
      </nav>
    </div>
  )
}