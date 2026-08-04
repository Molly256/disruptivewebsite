'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react' // <-- ADDED
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function CertificatePage() {
  const router = useRouter()
  const [user, setUser] = useState(null) // <-- ADDED
  const [loading, setLoading] = useState(true) // <-- ADDED

  useEffect(() => { // <-- ADDED WHOLE BLOCK
    const fetchUser = async () => {
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        router.push('/login')
        return
      }

      const localUser = JSON.parse(savedUser)
      setUser(localUser) // SHOW IMMEDIATELY SO NO BOUNCE

      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        // IMPORTANT: if API fails, we still keep localUser. No logout.
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading ||!user) return null // <-- ADDED

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