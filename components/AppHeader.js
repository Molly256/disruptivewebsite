'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AppHeader() {
  const router = useRouter()

  return (
    <div style={{ 
      background: '#FFFFFF',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      height: '64px',
      borderBottom: '1px solid #F0F0F0', // CHANGED: add subtle line
      position: 'fixed',
      top: 0,
      left: 0,                    // CHANGED: was '50%'
      width: '100%',              // CHANGED: full width
      maxWidth: '100%',           // CHANGED: was 430px
      zIndex: 99999,
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        maxWidth: '1400px',         // CHANGED: content max width for desktop
        margin: '0 auto',           // CHANGED: center content inside full width header
        justifyContent: 'space-between'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <Link href="/dashboard">
            <img
              src="/logo.png"
              alt="Disruptive"
              style={{
                height: '32px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
          </Link>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          height: '100%'
        }}>
          <button
            onClick={() => router.push('/contact')}
            style={{
              background: '#e60000',
              color: '#fff',
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
              width: '40px',              // CHANGED: was 64px, too big
              height: '40px',             // CHANGED: was 64px
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"> {/* CHANGED: was 64 */}
              <path d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}