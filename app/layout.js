import './globals.css'
import ClientWrapper from '../components/ClientWrapper'

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
        {/* The ClientWrapper safely checks layout path constraints */}
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}