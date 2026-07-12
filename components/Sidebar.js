'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [logged, setLogged] = useState(false)
  const [mount, setMount] = useState(false)
  const router = useRouter()
  const rawPath = usePathname()

  // Fix: usePathname can return '' on homepage
  const path = rawPath === ''? '/' : (rawPath.replace(/\/$/, '') || '/').toLowerCase()

  useEffect(() => {
    setMount(true)
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, [path])

  if (!mount) return null

  // Route group definitions matching app/registration/page.js and app/login/page.js
  const isAuthPage = path === '/registration' || path === '/login'
  const isSupportPage = path === '/support' || path.startsWith('/support/')

  // Completely hide the component for unauthenticated users on auth or support paths
  const hide =!logged && (isAuthPage || isSupportPage)

  // Apply simple navbar style strictly when not hidden and not on the home route
  const simple = path!== '/' &&!hide
  const home = path === '/'

  // Only show Sidebar on homepage
  if (!home) return null

  const go = r => router.push(r)
  const scroll = id => (document.getElementById(id)?.scrollIntoView({behavior:'smooth'}), setOpen(false))

  if (hide) return null

  const menu = {
    'WHAT WE DO': ['All Services','Paid Search','Paid Social','SEO','Amazon','Lifecycle Marketing','CRO','Creative','Data Analytics','Lead Generation'],
    'WHO WE HELP': ['B2B','B2C','eCommerce','Local','Garage Door','SaaS','Online Education','Outdoor Sporting Goods','High AOV Brands'],
    'WHO WE ARE': ['About Us','Why Disruptive','Meet Our Team','Our Mission','Giving Back','Careers'],
    'RESULTS': [],
    'RESOURCES': ['General','Blog','Partners','Webinars/Trainings','Reviews','Contact Us']
  }

  const drag = e => {
    const el = e.currentTarget, sX = e.clientX - el.getBoundingClientRect().left, sY = e.clientY - el.getBoundingClientRect().top
    const move = e => Object.assign(el.style, {left: e.clientX - sX + 'px', top: e.clientY - sY + 'px', right: 'auto', bottom: 'auto', cursor: 'grabbing'})
    const up = () => (document.removeEventListener('mousemove', move), document.removeEventListener('mouseup', up), el.style.cursor = 'grab')
    document.addEventListener('mousemove', move), document.addEventListener('mouseup', up)
  }

  return <>
    <header style={{background:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 20px',height:84,position:'fixed',top:0,left:0,right:0,zIndex:1002}}>
      <img src="/logo.png" alt="Disruptive" style={{height:84}}/>
      {simple? (
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={() => go(logged? '/support/chat' : '/support/guest')} style={{background:'#cc0000',color:'#000',fontWeight:600,fontSize:16,padding:'12px 24px',border:'none',borderRadius:8,cursor:'pointer'}}>Contact</button>
          {logged && <div onClick={() => go('/profile')} style={{width:48,height:48,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>}
        </div>
      ) : <>
        <nav className="desktop-nav">
          {Object.keys(menu).map(t => (
            <div key={t} onClick={() => scroll(t.toLowerCase().replace(/ /g,'-'))} style={{color:'#000',display:'flex',alignItems:'center',gap:6}}>
              {t}{t!=='RESULTS'&&<span className="dropdown-arrow"/>}
            </div>
          ))}
          {home && <button onClick={() => go('/registration')} style={{background:'#cc0000',color:'#000',fontWeight:500,border:'none'}}>GET STARTED</button>}
        </nav>
        <button onClick={() => setOpen(!open)} style={{color:'#000',fontSize:36,fontWeight:900,background:'none',border:'none',cursor:'pointer'}}>{open?'✕':'☰'}</button>
      </>}
    </header>

    {!simple && open && (
      <div style={{position:'fixed',top:84,left:0,right:0,bottom:0,background:'#fff',zIndex:1001,overflowY:'auto',padding:'40px 20px'}}>
        {Object.entries(menu).map(([t,subs]) => (
          <div key={t} style={{marginBottom:20}}>
            <div onClick={() => subs.length?setActive(active===t?null:t):scroll(t.toLowerCase().replace(/ /g,'-'))} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 0',cursor:'pointer'}}>
              <span style={{fontSize:20,fontWeight:700,color:'#000',letterSpacing:.5}}>{t}</span>
              {subs.length>0&&<span style={{color:'#cc0000',fontSize:18,transform:active===t?'rotate(180deg)':'rotate(0deg)',transition:'transform.2s'}}>⌄</span>}
            </div>
            {active===t&&subs.length>0&&<div style={{paddingLeft:20,paddingBottom:10}}>
              {subs.map(s => <a key={s} onClick={() => scroll(t.toLowerCase().replace(/ /g,'-'))} style={{display:'block',padding:'12px 0',color:'#333',fontSize:16,cursor:'pointer'}}>{s}</a>)}
            </div>}
          </div>
        ))}
        {home && <button onClick={() => go('/registration')} style={{background:'#cc0000',color:'#000',border:'none',padding:'16px 32px',fontWeight:500,fontSize:16,letterSpacing:1,marginTop:30,cursor:'pointer'}}>GET STARTED</button>}
      </div>
    )}

    {home && <div onClick={() => go('/registration')} onMouseDown={drag} style={{position:'fixed',bottom:20,right:20,zIndex:1000,background:'#e60000',color:'#000',fontWeight:500,fontSize:14,letterSpacing:1,padding:'16px 24px',borderRadius:50,cursor:'grab',boxShadow:'0 4px 12px rgba(0,0,0,0.3)',userSelect:'none',touchAction:'none'}}>GET STARTED</div>}
  </>
}