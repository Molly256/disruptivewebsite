'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '64px', 
      background: '#fff', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 20px', 
      zIndex: 1001,
      borderBottom: '1px solid #eee'
    }}>
      {/* Left: Logo */}
      <Image 
        src="/logo.png" 
        alt="Logo" 
        width={120} 
        height={40} 
        style={{ objectFit: 'contain' }}
        priority
      />
      
      {/* Right: Contact + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => router.push('/contact')}
          style={{ 
            background: '#cc0000', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px',
            padding: '8px 16px', 
            fontSize: '14px', 
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Contact
        </button>
        
        <div onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </header>
  )
}