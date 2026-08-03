'use client'
import { usePathname } from 'next/navigation'

function AppShell({ children }) {
  return (
    <div style={{
      background: '#F5F5F5',
      minHeight: '100vh'
    }}>
      {/* 
        We use a standard CSS custom property (variable) inside a style tag 
        to change the width dynamically based on desktop vs mobile.
      */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 430px; /* Default for Mobile */
        }
        @media (min-width: 1024px) {
          .app-container {
            max-width: 100% !important; /* Full coverage for Desktop */
          }
        }
      `}</style>

      <div 
        className="app-container"
        style={{
          minHeight: '100vh',
          margin: '0 auto',
          background: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 0 30px rgba(0,0,0,0.15)'
        }}
      >
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
    '/event',
    '/about',      // fixed: was '/About Us'
    '/terms',      // T&C's
    '/faqs',       // fixed: was '/faq'
    '/admin'       // <-- ADDED: so admin panel gets mobile coverage shell
  ]
  
  const isAppPage = appRoutes.some(route => pathname?.startsWith(route))

  return isAppPage ? <AppShell>{children}</AppShell> : <>{children}</>
}
