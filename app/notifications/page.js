'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { router.push('/login'); return }
    const u = JSON.parse(savedUser)
    setUser(u)
    fetchNotifications(u.id)
  }, [router])

  const fetchNotifications = async (userId) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`)
      const data = await res.json()
      if(res.ok) {
        setNotifications(data.notifications || [])
        // 1. Mark as read only after we successfully loaded them
        await markAsRead(userId)
      } else {
        setError(data.error || 'Failed to load notifications')
      }
    } catch(e) {
      console.error(e)
      setError('Network error')
    }
    setLoading(false)
  }

  const markAsRead = async (userId) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({userId})
      })
      // update local state so unread bubble disappears on profile
      setNotifications(prev => prev.map(n => ({...n, read: true})))
    } catch(e) {
      console.error('Mark as read failed', e)
    }
  }

  if(!user) return null

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>Notifications</h1>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading? (
            <p style={{textAlign:'center', color:'#999'}}>Loading...</p>
          ) : error? (
            <p style={{textAlign:'center', color:'#FF0000'}}>{error}</p>
          ) : notifications.length > 0? (
            notifications.map((n) => (
              <div key={n.id || n.createdAt} style={{
                background: '#FFF',
                padding: 16,
                borderRadius: 12,
                borderLeft: n.read? '3px solid #CCC' : '3px solid #FF0000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#000', marginBottom: 6 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: '#999' }}>
                  {new Date(n.createdAt).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ background: '#FFF', padding: 40, borderRadius: 12, textAlign: 'center', color: '#999' }}>
              No notifications yet
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}