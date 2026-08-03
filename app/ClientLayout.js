'use client'
import { usePathname } from 'next/navigation'

function AppShell({ children }) {
  return (
    <div style={{
      background: '#F5F5F5',
      minHeight: '100vh'
    }}>
      {/* 
        This global block ensures both the main app wrapper AND any fixed bottom nav
        elements break out of the 430px limit when displayed on desktop screens.
      */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 430px; /* Default for Mobile */
        }
        
        @media (min-width: 1024px) {
          /* Force layout wrapper to span full width */
          .app-container {
            max-width: 100% !important; 
          }
          
          /* 
            Target your bottom navigation (handles typical fixed position classes/elements)
            and forces them to break out to full viewport screen margins.
          */
          .app-container footer,
          .app-container [class*="nav"],
          .app-container [class*="footer"],
          .app-container [style*="position: fixed"],
          .app-container [style*="position: fixed"] div {
            max-width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            transform: none !important;
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
