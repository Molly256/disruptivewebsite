'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function LogoutPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null) // 'cancel' | 'logout'

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { router.push('/login'); return }
  }, [router])

  const handleCancel = () => {
    setSelected('cancel')
    setTimeout(() => router.push('/'), 200) // go to dashboard
  }

  const handleLogout = () => {
    setSelected('logout')
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
    cursor: 'pointer',
    transition: 'all 0.2s'
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
              onClick={handleCancel}
              style={{
               ...btnBase,
                background: selected === 'cancel'? '#FF0000' : '#E0E0E0',
                color: selected === 'cancel'? '#FFF' : '#000'
              }}
            >
              {t('cancel')}
            </button>

            <button
              onClick={handleLogout}
              style={{
               ...btnBase,
                background: selected === 'logout'? '#FF0000' : '#E0E0E0',
                color: selected === 'logout'? '#FFF' : '#000'
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