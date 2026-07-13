'use client'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{
      position: 'fixed',       
      top: 0,
      left: 0,
      right: 0,
      height: '64px',          
      background: '#ffffff',   // Fixed color string
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
      zIndex: 1000,            
      fontFamily: 'sans-serif'
    }}>
      {/* Left Side: Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/logo.png"       
          alt="Logo" 
          style={{ height: '36px', objectFit: 'contain' }} 
          onError={(e) => {
            e.currentTarget.src = 'https://placeholder.com'
          }}
        />
      </div>

      {/* Right Side: Button and Profile Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Hot Red Contact Button */}
        <button
          onClick={() => router.push('/support/chat')}
          style={{
            background: '#ff0000', // Fixed hot red color string
            color: '#000000',      // Fixed black color string
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',   
            fontSize: '15px',
            fontWeight: '600',     
            cursor: 'pointer'
          }}
        >
          Contact
        </button>

        {/* Black User Profile Icon */}
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg 
            width="28"             
            height="28" 
            viewBox="0 0 24 24" 
            fill="#000000"          // Fixed black SVG fill string
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>
    </header>
  )
}