'use client'
import { usePathname } from 'next/navigation'

function AppShell({ children }) {
  return (
    <div style={{
      background: '#F5F5F5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '430px',
        minHeight: '100vh',
        margin: '0 auto',
        background: '#FFFFFF',
        position: 'relative',
        boxShadow: '0 0 30px rgba(0,0,0,0.15)'
      }}>
        {children}
      </div>
    </div>
  )
}

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  
  // PAGES WITH MOBILE APP SHELL
  const appRoutes = [
    '/dashboard', 
    '/profile', 
    '/viplevels', 
    '/deposit', 
    '/withdraw',
    '/certificate', 
    '/events',
    '/about-us', 
    '/terms',    // T&C's
    '/faq'       // FAQs
  ]
  
  const isAppPage = appRoutes.some(route => pathname?.startsWith(route))

  return isAppPage ? <AppShell>{children}</AppShell> : <>{children}</>
}