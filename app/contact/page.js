'use client'
import { useRouter } from 'next/navigation'

export default function Contact() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '120px 20px 40px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => router.back()}
            style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer' }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Contact Us</h1>
        </div>

        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
          Looking to get in touch? You can reach us with the info below
        </p>

        <div
          onClick={() => router.push('/support/chat')}
          style={{
            background: '#cc0000', // red button like you asked
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/support-avatar.jpg"
              alt="Support"
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <span style={{ color: '#000', fontSize: '16px', fontWeight: '600' }}>Online Customer Support</span>
          </div>
          <span style={{ color: '#000', fontSize: '20px', fontWeight: '600' }}>›</span>
        </div>
      </div>
    </div>
  )
}