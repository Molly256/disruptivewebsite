'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { setLang, getCurrentLang } from '@/lib/i18n'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Francais', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'ru', name: 'PycckNN', flag: '🇷🇺' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sk', name: 'Slovencina', flag: '🇸🇰' },
]

export default function ChangeLanguagePage() {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState('en')

  useEffect(() => {
    setSelectedLang(getCurrentLang())
  }, [])

  const handleSelect = (code) => {
    setLang(code)
    setSelectedLang(code)
    // FORCE full reload so t() re-reads new language for entire app
    setTimeout(() => {
      window.location.href = '/profile'
    }, 100)
  }

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />
      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>Change Language</h1>
        </div>
        <div style={{ background: '#FFF', borderRadius: 12, padding: 12 }}>
          {LANGUAGES.map(lang => {
            const isSelected = selectedLang === lang.code
            return (
              <button key={lang.code} onClick={() => handleSelect(lang.code)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginBottom: 8, borderRadius: 10, border: 'none', background: isSelected? '#FF0000' : '#F5F5F5', color: isSelected? '#FFF' : '#000', fontSize: 15, fontWeight: isSelected? 700 : 600, cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{lang.flag}</span>
                <span>{lang.name}</span>
                {isSelected && <span style={{ marginLeft: 'auto' }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}