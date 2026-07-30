'use client' // needed for usePathname
import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import { usePathname } from 'next/navigation'

export const metadata = {
  title: 'Disruptive - Digital Marketing That Actually Works',
  description: 'Paid Search, Paid Social, SEO, Amazon & more. We grow brands that scale.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

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

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  // LIST OF ALL "INSIDE APP" PAGES. Add more here
  const appRoutes = ['/dashboard', '/profile', '/viplevels', '/deposit', '/withdraw', '/login', '/register']
  
  // Check if current route starts with any app route
  const isAppPage = appRoutes.some(route => pathname?.startsWith(route))

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {isAppPage ? (
          <AppShell>
            {children}
            <ChatWidget />
          </AppShell>
        ) : (
          <>
            {children}
            <ChatWidget />
          </>
        )}
      </body>
    </html>
  )
}