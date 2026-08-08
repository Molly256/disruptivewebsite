'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function DepositPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      {/* HEADER */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', margin: 0, flex: 1, textAlign: 'center' }}>DEPOSIT</h1>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="Disruptive" style={{ width: '120px', height: 'auto' }} />
        </div>

        {/* INFO CARD */}
        <div style={{ background: '#F5F5F5', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ color: '#000', fontSize: '18px', fontWeight: '800', margin: '0 0 12px', textAlign: 'center' }}>
            Deposit Through Customer Service
          </h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px', textAlign: 'center' }}>
            For security reasons, all deposits must be processed through our customer service team.
          </p>

          {/* RED BUTTON TO CONTACT */}
          <button
            onClick={() => router.push('/contact')}
            style={{
              background: '#FF0000',
              color: '#000',
              fontWeight: '800',
              fontSize: '16px',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            Contact Customer Service
          </button>
        </div>

        {/* EVENT INFO */}
        <div style={{ background: '#000', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF0000', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>Current Deposit Rewards <span style={{ color: '#FFF' }}>.</span></h3>
          <p style={{ color: '#AAA', fontSize: '12px', margin: '0 0 4px' }}>1,500 - 9,999 USD: <span style={{ color: '#FF00FF', fontWeight: '700' }}>4% Bonus</span></p>
          <p style={{ color: '#AAA', fontSize: '12px', margin: '0 0 4px' }}>10,000 - 19,999 USD: <span style={{ color: '#00FF00', fontWeight: '700' }}>8% Bonus</span></p>
          <p style={{ color: '#AAA', fontSize: '12px', margin: '0 0 4px' }}>20,000 - 49,999 USD: <span style={{ color: '#00FFFF', fontWeight: '700' }}>12% Bonus</span></p>
          <p style={{ color: '#AAA', fontSize: '12px', margin: 0 }}>50,000+ USD: <span style={{ color: '#FFFF00', fontWeight: '700' }}>20% Bonus</span></p>
        </div>

        {/* NOTICE */}
        <p style={{ color: '#999', fontSize: '11px', textAlign: 'center' }}>
          *The final interpretation right belongs to Disruptive platform
        </p>
      </div>

      <BottomNav />
    </div>
  )
}