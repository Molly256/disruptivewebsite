'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useT } from '@/lib/i18n'

export default function AppHeader() {
  const router = useRouter()
  const t = useT()

  return (
    <div style={{ 
      background: '#FFFFFF',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      height: '64px',
      borderBottom: '1px solid #F0F0F0',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      maxWidth: '100%',
      zIndex: 99999,
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
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
            {t('contactUs')}
          </button>
          <div
            onClick={() => router.push('/profile')}
            style={{
              width: '56px',
              height: '48px',             
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F5F5F5',
              borderRadius: '50%',
              fontSize: '28px',
              lineHeight: 1
            }}
          >
            👤
          </div>
        </div>
      </div>
    </div>
  )
}