'use client'
import { useRouter } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()

  return (
    <nav style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      background: '#000', 
      display: 'flex', 
      justifyContent: 'space-around', 
      alignItems: 'center', 
      padding: '12px 0 24px', 
      zIndex: 1000, 
      borderTop: '1px solid #222' 
    }}>
      <div onClick={() => router.push('/dashboard')} style={{ textAlign: 'center', cursor: 'pointer' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Home</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div 
          onClick={() => router.push('/starting')} 
          style={{ 
            width: '56px', 
            height: '56px', 
            background: '#cc0000', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: '-28px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
            cursor: 'pointer', 
            border: '3px solid #fff',
            overflow: 'hidden'
          }}
        >
          <img 
            src="/logo.png" 
            alt="Starting" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }} 
          />
        </div>
        <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300' }}>Starting</div>
      </div>

      <div onClick={() => router.push('/records')} style={{ textAlign: 'center', cursor: 'pointer' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
        <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', fontWeight: '300' }}>Records</div>
      </div>
    </nav>
  )
}