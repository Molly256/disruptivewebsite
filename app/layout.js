import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import Sidebar from '@/components/Sidebar' // <-- add this

export const metadata = {
  title: 'Disruptive - Digital Marketing That Actually Works',
  description: 'Paid Search, Paid Social, SEO, Amazon & more. We grow brands that scale.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar /> {/* <-- add this */}
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}