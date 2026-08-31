'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function VipLevels() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        router.push('/login')
        return
      }
      const localUser = JSON.parse(savedUser)
      setUser(localUser)
      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()
        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  if (loading ||!user) return null

  const currentVip = Number(user.vipLevel) || 1 // VIP1 is default

  const vipData = [
    { id: 1, title: 'VIP1', price: '100 USD', badgeColor: '#5BC0BE', innerBadgeColor: '#A3E2E2', perks: ['Suitable for most data capture scenarios involving light to medium usage','Profit of 0.5% per product data','40 product data per set','Up to 80 data submissions per day','Can complete 3 sets of data submissions per day','No access to other Premium features'] },
    { id: 2, title: 'VIP2', price: '500 USD', badgeColor: '#4A90E2', innerBadgeColor: '#F5A623', perks: ['Premium user have limited access to all features of the platform','Deposit according to our events','Profit of 1.0% per product data','45 product data per set','Up to 90 data submissions per day','Can complete 3 sets of data submissions per day','Better profit and permission','Full access to all other premium features'] },
    { id: 3, title: 'VIP3', price: '1600 USD', badgeColor: '#1ABC9C', innerBadgeColor: '#F39C12', perks: ['Premium user have limited access to all features of the platform','Deposit according to our events','Profit of 1.5% per product data','50 product data per set','Up to 100 data submissions per day','Can complete 3 sets of data submissions per day'] },
    { id: 4, title: 'VIP4', price: '5500 USD', badgeColor: '#F39C12', innerBadgeColor: '#F1C40F', perks: ['Premium user have limited access to all features of the platform','Deposit according to our events','Profit of 2.0% per product data','55 product data per set','Up to 110 product data per day','Can complete 3 sets of data submissions per day','Better profit and permission','Full access to all other premium features'] },
    { id: 5, title: 'VIP5', price: '10000 USD', badgeColor: '#E74C3C', innerBadgeColor: '#F39C12', perks: ['Supreme user gets unlimited access to all features of the platform','Deposits according to our events','Profit of 2.5% per product data','60 product data per set','Up to 120 product data per day','Can complete 3 set of data submissions per day','Better profits and permissions','Full access to all other premium features'] }
  ]

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: '90px 16px 0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => router.back()} style={{ background: '#000', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style={{ background: '#FF0000', color: '#000', fontSize: '16px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 18px', borderRadius: '12px', flex: 1, textAlign: 'center', boxShadow: '0 3px 8px rgba(255,0,0,0.25)' }}>
            VIP LEVELS
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {vipData.map((vip) => {
            const isCurrent = currentVip === vip.id
            return (
              <div key={vip.id} style={{ background: '#FFFFFF', border: `2px solid ${isCurrent ? '#FF0000' : '#E2E8F0'}`, borderRadius: '16px', padding: '24px 20px', position: 'relative', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)' }}>
                
                {/* CURRENT BUTTON TOP RIGHT */}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: '#FF0000', color: '#FFF', fontSize: '12px', fontWeight: '800', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    Current
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', margin: '0 0 12px 0' }}>{vip.title}</h2>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#E67E22', marginBottom: '16px' }}>{vip.price}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', flexShrink: 0, marginTop: '4px' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: vip.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2 }}>
                      <div style={{ width: '34px', height: '34px', background: vip.innerBadgeColor, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>★</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '-8px', zIndex: 1 }}>
                      <div style={{ width: '10px', height: '24px', background: vip.badgeColor, transform: 'rotate(5deg)', borderRadius: '2px' }} />
                      <div style={{ width: '10px', height: '24px', background: vip.badgeColor, transform: 'rotate(-5deg)', borderRadius: '2px' }} />
                    </div>
                  </div>

                  <ul style={{ margin: 0, padding: 0, listStyleType: 'none', flex: 1 }}>
                    {vip.perks.map((perk, index) => (
                      <li key={index} style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', marginBottom: '6px', position: 'relative', paddingLeft: '12px', fontWeight: '500' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#000' }}>•</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '80px' }}>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
      </div>

      <BottomNav />
    </div>
  )
}