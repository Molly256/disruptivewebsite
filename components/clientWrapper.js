'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import ChatWidget from './ChatWidget'

export default function ClientWrapper({ children }) {
  const [logged, setLogged] = useState(false)
  const [mount, setMount] = useState(false)
  const rawPath = usePathname()

  // Clean trailing slashes and cast to lowercase to prevent string mismatch
  const path = (rawPath.replace(/\/$/, '') || '/').toLowerCase()

  useEffect(() => {
    setMount(true)
    // Safely check authorization tokens in the browser
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, [path])

  // Route definitions for authentication pages and support channels
  const isAuthPage = path === '/registration' || path === '/login'
  const isSupportPage = path === '/support' || path.startsWith('/support/')

  // Strictly hide header, logo, and widgets for unauthenticated guests on these routes
  const shouldHideWidgets = !logged && (isAuthPage || isSupportPage)

  // Prevent server/client hydration layout flashes before the component mounts
  if (!mount) {
    return (
      <main className={`main-content ${shouldHideWidgets ? 'no-widgets' : ''}`}>
        {children}
      </main>
    )
  }

  return (
    <>
      {/* Header and Logo only show if shouldHideWidgets evaluates to false */}
      {!shouldHideWidgets && <Sidebar />}
      
      {/* no-widgets class instantly wipes out the 84px ghost margin and white background */}
      <main className={`main-content ${shouldHideWidgets ? 'no-widgets' : ''}`}>
        {children}
      </main>
      
      {!shouldHideWidgets && <ChatWidget />}
    </>
  )
}