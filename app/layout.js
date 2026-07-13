import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/DashboardHeader' // Imports your new header safely
import { headers } from 'next/headers'

export const metadata = {
  title: 'Disruptive - Digital Marketing That Actually Works',
  description: 'Paid Search, Paid Social, SEO, Amazon & more. We grow brands that scale.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'
  
  // Kept exactly as you wrote it to protect your homepage header rules
  const isLoggedIn = pathname !== '/' && pathname !== '/login' && pathname !== '/registration'

  // NEW RULE: Only true if the user is explicitly inside the dashboard paths
  const isDashboardRoute = pathname.startsWith('/dashboard')

  return (
    <html lang="en">
      <body>
        {/* Renders your dashboard layout rules ONLY on dashboard paths, completely leaving your home page header alone */}
        {isDashboardRoute && <DashboardHeader />}
        
        <Sidebar logged={isLoggedIn} />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}