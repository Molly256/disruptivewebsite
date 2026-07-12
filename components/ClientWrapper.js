'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import ChatWidget from './ChatWidget'

export default function ClientWrapper({ children }) {
  const [logged, setLogged] = useState(false)
  const [mount, setMount] = useState(false)
  const rawPath = usePathname()

  const path = rawPath === ''? '/' : (rawPath.replace(/\/$/, '') || '/').toLowerCase()

  useEffect(() => {
    setMount(true)
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, )

  // Chat always shows
  const showChat = true

  // Padding only when header will show: logged in OR guest on homepage
  const showHeader = logged || (path === '/' &&!logged)

  if (!mount) {
    return (
      <div
        className="main-content"
        style={{
          paddingTop: showHeader? '48px' : 0,
          background: '#fff',
          color: '#000',
          minHeight: '100vh',
          overflowX: 'hidden',
          width: '100%'
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      <Sidebar logged={logged} />

      <div
        className="main-content"
        style={{
          paddingTop: showHeader? '48px' : 0,
          background: '#fff',
          color: '#000',
          minHeight: '100vh',
          overflowX: 'hidden',
          width: '100%'
        }}
      >
        {children}
      </div>

      {showChat && <ChatWidget />}
    </>
  )
}