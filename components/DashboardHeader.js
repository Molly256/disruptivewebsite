'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <header style={{
      background: '#ffffff', // Pure hot white
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px', // Side spacing matching the layout image
      height: '64px', // Compact mobile header height matching your screenshot
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      {/* Left Side: Logo */}
      <div 
        onClick={() => router.push('/dashboard')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative', 
          height: '32px', 
          width: '110px', 
          cursor: 'pointer' 
        }}
      >
        <Image
          src="/logo.png" // Custom local file logo
          alt="Logo"
          fill
          sizes="110px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Right Side: Contact Button + Solid Profile Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px' // Clean, precise spacing matching the reference picture
      }}>
        {/* Hot Red Contact Button */}
        <button
          onClick={() => router.push('/contact')}
          style={{
            background: '#ff0000', // Absolute hot red
            color: '#ffffff',
            fontWeight: '500', // Medium font weight
            fontSize: '14px', // Crisp medium font size for mobile
            padding: '8px 18px', // Visual proportions match the screenshot button shape
            border: 'none',
            borderRadius: '6px', // Balanced rounded corners
            cursor: 'pointer',
            whiteSpace: 'nowrap' // Keeps text on a single line
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
          {/* Solid fill silhouette icon matching your reference layout style */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
          </svg>
        </button>
      </div>
    </header>
  )
}