import './globals.css'
import Sidebar from '../components/Sidebar'

export const metadata = {
  title: 'Disruptive - Digital Marketing That Actually Works',
  description: 'Paid Search, Paid Social, SEO, Amazon & more. We grow brands that scale.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000', color: '#fff' }}>
        <Sidebar />
        <main style={{ paddingTop: '70px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}