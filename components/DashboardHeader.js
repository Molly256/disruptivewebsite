'use client'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{
      background: '#000000', // Changed to pure black so the light logo is visible
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px', 
      height: '66px', 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      boxSizing: 'border-box',
      borderBottom: '1px solid #1c1c1e'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.png" 
          alt="Logo"
          style={{
            height: '32px', 
            width: 'auto', 
            display: 'block',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/dashboard')}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => router.push('/contact')}
          style={{
            background: '#ff0000', 
            color: '#ffffff',
            fontWeight: '500', 
            fontSize: '14px', 
            padding: '8px 18px', 
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Contact
        </button>

        <button
          onClick={() => router.push('/profile')}
          aria-label="User Profile"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px'
          }}
        >
          {/* Changed profile icon fill to white so it's visible on the black header */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
          </svg>
        </button>
      </div>
    </header>
  )
}