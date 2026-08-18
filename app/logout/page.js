'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react' // removed useEffect
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function LogoutPage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(false) // 'cancel' | 'logout' | false

  const handleCancel = () => {
    if (processing) return
    setProcessing('cancel')
    setTimeout(() => router.push('/'), 200) // go to dashboard
  }

  const handleLogout = () => {
    if (processing) return
    setProcessing('logout')
    setTimeout(() => {
      localStorage.removeItem('user')
      router.push('/login')
    }, 200)
  }

  const btnBase = {
    flex: 1,
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: processing? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: processing? 0.6 : 1
  }

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100vh - 154px)' }}>

        <div style={{ background: '#FFF', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#000', margin: '0 0 12px' }}>{t('logout')}</h1>
          <p style={{ fontSize: 15, color: '#666', margin: '0 0 24px', lineHeight: 1.5 }}>{t('logoutConfirm')}</p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              disabled={!!processing}
              onClick={handleCancel}
              style={{
              ...btnBase,
                background: processing === 'cancel'? '#FF0000' : '#E0E0E0',
                color: processing === 'cancel'? '#FFF' : '#000'
              }}
            >
              {t('cancel')}
            </button>

            <button
              disabled={!!processing}
              onClick={handleLogout}
              style={{
              ...btnBase,
                background: processing === 'logout'? '#FF0000' : '#E0E0E0',
                color: processing === 'logout'? '#FFF' : '#000'
              }}
            >
              {t('logout')}
            </button>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}