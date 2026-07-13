'use client'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{
      background: '#ffffff', // Pure hot white
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px', 
      height: '66px', 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999, // Guarantees it stays in front of the video
      boxSizing: 'border-box',
      borderBottom: '1px solid #f2f2f7'
    }}>
      {/* Left Side: Logo Area - Flex alignment ensures it doesn't collapse */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.png" // Exact same source that works in your footer
          alt="Logo"
          style={{
            height: '32px', // Explicit height matching your footer layout
            width: 'auto', // Lets width scale naturally so it never hits 0px
            display: 'block',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/dashboard')}
        />
      </div>

      {/* Right Side: Contact Button + Profile Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Hot Red Contact Button */}
        <button
          onClick={() => router.push('/contact')}
          style={{
            background: '#ff0000', // Absolute hot red
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

        {/* User Profile Icon */}
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
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
          </svg>
        </button>
      </div>
    </header>
  )
}