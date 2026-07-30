'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function CertificatePage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      
      <AppHeader />

      {/* TITLE */}
      <div style={{ padding: '24px 20px 16px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          color: '#000', 
          margin: 0,
          letterSpacing: '1px'
        }}>
          CERTIFICATE
        </h1>
      </div>

      {/* CERTIFICATE IMAGE */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: '#F1F1F1',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <img 
            src="/certificate.jpg" 
            alt="Certificate" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: '8px',
              display: 'block'
            }} 
          />
        </div>

        {/* REMOVED DOWNLOAD BUTTON */}
      </div>

      <BottomNav />
    </div>
  )
}