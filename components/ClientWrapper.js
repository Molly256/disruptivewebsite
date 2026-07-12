'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import ChatWidget from './ChatWidget'

export default function ClientWrapper({ children }) {
  const [logged, setLogged] = useState(false)
  const [mount, setMount] = useState(false)
  const rawPath = usePathname()

  const path = rawPath === '' ? '/' : (rawPath.replace(/\/$/, '') || '/').toLowerCase()

  useEffect(() => {
    setMount(true)
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, )

  // RULE 1: Show header ONLY if logged in
  const showHeader = logged
  
  // RULE 2: Chat widget shows on ALL pages, always
  const showChat = true

  if (!mount) {
    return (
      <div 
        className="main-content"
        style={{
          paddingTop: showHeader ? '48px' : 0, // 0px for guests, 48px for logged in
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
      {showHeader && <Sidebar />}
      
      <div 
        className="main-content"
        style={{
          paddingTop: showHeader ? '48px' : 0, // Only pad when header exists
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