'use client'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()
  const headerHeight = 48

  return (
    <header style={{
      background: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      height: `${headerHeight}px`,
      borderBottom: '1px solid #eee',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1002
    }}>
      {/* Logo left */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <img
          src="/logo.png"
          alt="Disruptive"
          style={{
            height: '28px',
            width: 'auto',
            display: 'block',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/dashboard')}
        />
      </div>

      {/* Contact + Profile right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => router.push('/contact')}
          style={{
            background: '#cc0000', // changed to match Contact page
            color: '#000',
            fontWeight: '600',
            fontSize: '15px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Contact
        </button>
        <div
          onClick={() => router.push('/profile')}
          style={{
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
    </header>
  )
}