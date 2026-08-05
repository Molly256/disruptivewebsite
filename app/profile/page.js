'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const vipData = [
  { id: 1, title: 'VIP1', price: '100 USD', badgeColor: '#5BC0BE', innerBadgeColor: '#A3E2E2' },
  { id: 2, title: 'VIP2', price: '500 USD', badgeColor: '#4A90E2', innerBadgeColor: '#F5A623' },
  { id: 3, title: 'VIP3', price: '1600 USD', badgeColor: '#1ABC9C', innerBadgeColor: '#F39C12' },
  { id: 4, title: 'VIP4', price: '5500 USD', badgeColor: '#F39C12', innerBadgeColor: '#F1C40F' },
  { id: 5, title: 'VIP5', price: '10000 USD', badgeColor: '#E74C3C', innerBadgeColor: '#F39C12' }
]

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/login')
      return
    }
    let u = JSON.parse(savedUser)
    if (!u.vipLevel) u.vipLevel = 'VIP1'
    if (!u.creditScore) u.creditScore = 100
    if (!u.vipId) u.vipId = 1
    setUser(u)
    setAvatar(u.avatar || '')

    const refresh = async () => {
      try {
        const res = await fetch(`/api/user?id=${u.id}`)
        const data = await res.json()
        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch(e) { console.error(e) }
    }
    refresh()
  }, [router])

  const handleAvatarClick = () => fileInputRef.current.click()
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const newAvatar = event.target.result
      setAvatar(newAvatar)
      const updatedUser = {...user, avatar: newAvatar }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    reader.readAsDataURL(file)
  }

  const copyReferral = () => {
    if (!user) return
    const referralCode = user.inviteCode || ''
    navigator.clipboard.writeText(referralCode)
    alert('Referral Code Copied!')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  const phone = user.phone || ''
  const referralCode = user.inviteCode || ''
  const vipLevel = user.vipLevel || 'VIP1'
  const vipId = user.vipId || 1
  const currentVip = vipData.find(v => v.id === vipId) || vipData[0]
  const todayProfit = user.todayProfit || '0.00'
  const totalBalance = user.walletBalance || '0.00' // CHANGED: use walletBalance
  const creditScore = user.creditScore || 100

  const MenuItem = ({ icon, title, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: '#FF0000',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
        <span style={{ color: '#FFF', fontSize: '15px', fontWeight: '600' }}>{title}</span>
      </div>
      <span style={{ color: '#FFF', fontSize: '18px', fontWeight: '800' }}>▼</span>
    </div>
  )

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <AppHeader />

      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', margin: 0, flex: 1, textAlign: 'center' }}>My Profile</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 24px' }}>
        <div onClick={handleAvatarClick} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed #CCC', background: avatar? '#000' : '#F1F1F1', overflow: 'hidden', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {avatar? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px', color: '#AAA', fontWeight: '200' }}>+</span>}
        </div>
        <div onClick={handleAvatarClick} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <span>✏️</span>
          <span style={{ color: '#000', fontSize: '14px', fontWeight: '600' }}>{avatar? 'Edit Profile Image' : 'Upload Profile Image'}</span>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ background: '#000', borderRadius: '16px', padding: '20px', color: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#FFF', fontSize: '14px', margin: '0 0 2px' }}>Hello,</p>
              <h2 style={{ color: '#FF0000', fontSize: '28px', fontWeight: '800', margin: 0 }}>{user.username}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: currentVip.innerBadgeColor, fontSize: '18px', fontWeight: '800' }}>{vipLevel}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentVip.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '24px', height: '24px', background: currentVip.innerBadgeColor, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFF', fontSize: '12px', fontWeight: 'bold' }}>★</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#AAA', margin: '0 0 8px' }}>My Referral Code</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>{referralCode}</span>
                <button onClick={copyReferral} style={{ background: '#FFF', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>📋</button>
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid #333', borderRight: '1px solid #333' }}>
              <p style={{ fontSize: '12px', color: '#AAA', margin: '0 0 8px' }}>Today's Profit (USD)</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', margin: 0 }}>{todayProfit}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#AAA', margin: '0 0 8px' }}>Total Balance (USD)</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', margin: 0 }}>{totalBalance}</p>
              {/* REMOVED: Budget: {currentVip.price} */}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#FFF', fontWeight: '600' }}>Credit Score:</span>
              <span style={{ fontSize: '13px', color: '#FFF', fontWeight: '700' }}>{creditScore}%</span>
            </div>
            <div style={{ background: '#333', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#FF0000', width: `${creditScore}%`, height: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', margin: '0 0 16px' }}>My Profile</h3>
        <MenuItem icon="👤" title="Account Info" onClick={() => router.push('/account-info')} />
        <MenuItem icon="🔗" title="Bind Wallet" onClick={() => router.push('/bind-wallet')} />

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', margin: '24px 0 16px' }}>My Financial</h3>
        <MenuItem icon="🏦" title="Deposit" onClick={() => router.push('/deposit')} />
        <MenuItem icon="💸" title="Withdraw" onClick={() => router.push('/withdraw')} />

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', margin: '24px 0 16px' }}>Other</h3>
        <MenuItem icon="🔔" title="Notifications" onClick={() => router.push('/notifications')} />
        <MenuItem icon="⚙️" title="Change Language" onClick={() => router.push('/language')} />
        <MenuItem icon="⏻" title="Logout" onClick={handleLogout} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '80px' }}>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
      </div>

      <BottomNav />
    </div>
  )
}