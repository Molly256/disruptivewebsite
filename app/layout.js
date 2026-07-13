import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import Sidebar from '@/components/Sidebar'
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
  
  // Show logged-in header on all pages except home, login, registration
  const isLoggedIn = pathname !== '/' && pathname !== '/login' && pathname !== '/registration'

  return (
    <html lang="en">
      <body>
        <Sidebar logged={isLoggedIn} />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}