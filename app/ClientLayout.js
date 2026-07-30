'use client' // needed for usePathname
import { usePathname } from 'next/navigation'

function AppShell({ children }) {
  return (
    <div style={{
      background: '#F5F5F5', // grey outside like phone
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '430px', // iphone width
        minHeight: '100vh',
        margin: '0 auto',
        background: '#FFFFFF',
        position: 'relative',
        boxShadow: '0 0 30px rgba(0,0,0,0.15)' // phone look
      }}>
        {children}
      </div>
    </div>
  )
}

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  
  const appRoutes = ['/dashboard', '/profile', '/viplevels', '/deposit', '/withdraw', '/login', '/register']
  const isAppPage = appRoutes.some(route => pathname?.startsWith(route))

  return isAppPage ? <AppShell>{children}</AppShell> : <>{children}</>
}