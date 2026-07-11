import './globals.css'
import Sidebar from '../components/Sidebar'
import ChatWidget from '../components/ChatWidget'

export const metadata = {
  title: 'Disruptive - Digital Marketing That Actually Works',
  description: 'Paid Search, Paid Social, SEO, Amazon & more. We grow brands that scale.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png', // for iOS home screen
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
        <ChatWidget />
      </body>
    </html>
  )
}