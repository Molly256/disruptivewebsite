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
  }, [path])

  const isAuthPage = path === '/registration' || path === '/login'
  const isSupportPage = path === '/support' || path.startsWith('/support/')

  // RULE: Wipe out headers/widgets completely on login, registration, and guest support paths
  const shouldHideWidgets = isAuthPage || (!logged && isSupportPage)

  if (!mount) {
    return (
      <main className={`main-content ${shouldHideWidgets ? 'no-widgets' : ''}`}>
        {children}
      </main>
    )
  }

  return (
    <>
      {!shouldHideWidgets && <Sidebar />}
      
      <main className={`main-content ${shouldHideWidgets ? 'no-widgets' : ''}`}>
        {children}
      </main>
      
      {!shouldHideWidgets && <ChatWidget />}
    </>
  )
}