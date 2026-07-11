'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import ChatWidget from './ChatWidget'

export default function ClientWrapper({ children }) {
  const [logged, setLogged] = useState(false)
  const [mount, setMount] = useState(false)
  const rawPath = usePathname()

  // Clean trailing slashes and convert path string to lowercase
  const path = (rawPath.replace(/\/$/, '') || '/').toLowerCase()

  useEffect(() => {
    setMount(true)
    // Read the authorization tokens safely on the client window
    setLogged(!!(localStorage.getItem('token') || localStorage.getItem('user')))
  }, [path])

  // Explicitly target app/registration/page.js and app/login/page.js routes
  const isAuthPage = path === '/registration' || path === '/login'
  const isSupportPage = path === '/support' || path.startsWith('/support/')

  // Determine if layouts should completely disappear for logged out users
  const shouldHideWidgets = !logged && (isAuthPage || isSupportPage)

  // Prevent hydration errors by matching server structure before component mount
  if (!mount) {
    return <main className="main-content">{children}</main>
  }

  return (
    <>
      {!shouldHideWidgets && <Sidebar />}
      <main className="main-content">
        {children}
      </main>
      {!shouldHideWidgets && <ChatWidget />}
    </>
  )
}