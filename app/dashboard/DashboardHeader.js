'use client'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{
      background: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '84px',
      borderBottom: 'none',
      boxShadow: 'none',
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
            background: '#cc0000',
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
    </header>
  )
}