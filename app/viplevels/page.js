'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

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
      try {
        const res = await fetch(`/api/user?id=${localUser.id}`)
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('user')
          router.push('/login')
        }
      } catch (e) {
        console.error(e)
        setUser(localUser)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading ||!user) return null

  const vipData = [
    {
      id: 1,
      title: 'VIP1',
      price: '100 USD',
      badgeColor: '#5BC0BE',
      innerBadgeColor: '#A3E2E2',
      perks: [
        'Suitable for most data capture scenarios involving light to medium usage',
        'Profit of 0.5% per product data',
        '40 product data per set',
        'Up to 80 data submissions per day',
        'Can complete 2 sets of data submissions per day',
        'No access to other Premium features'
      ]
    },
    {
      id: 2,
      title: 'VIP2',
      price: '500 USD',
      badgeColor: '#4A90E2',
      innerBadgeColor: '#F5A623',
      perks: [
        'Premium user have limited access to all features of the platform',
        'Deposit according to our events',
        'Profit of 1.0% per product data',
        '45 product data per set',
        'Up to 90 data submissions per day',
        'Can complete 2 sets of data submissions per day',
        'Better profit and permission',
        'Full access to all other premium features'
      ]
    },
    {
      id: 3,
      title: 'VIP3',
      price: '1600 USD',
      badgeColor: '#1ABC9C',
      innerBadgeColor: '#F39C12',
      perks: [
        'Premium user have limited access to all features of the platform',
        'Deposit according to our events',
        'Profit of 1.5% per product data',
        '50 product data per set',
        'Up to 100 data submissions per day',
        'Can complete 2 sets of data submissions per day'
      ]
    },
    {
      id: 4,
      title: 'VIP4',
      price: '5500 USD',
      badgeColor: '#F39C12',
      innerBadgeColor: '#F1C40F',
      perks: [
        'Premium user have limited access to all features of the platform',
        'Deposit according to our events',
        'Profit of 2.0% per product data',
        '55 product data per set',
        'Up to 110 product data per day',
        'Can complete 2 sets of data submissions per day',
        'Better profit and permission',
        'Full access to all other premium features'
      ]
    },
    {
      id: 5,
      title: 'VIP5',
      price: '10000 USD',
      badgeColor: '#E74C3C',
      innerBadgeColor: '#F39C12',
      perks: [
        'Supreme user gets unlimited access to all features of the platform',
        'Deposits according to our events',
        'Profit of 2.5% per product data',
        '60 product data per set',
        'Up to 120 product data per day',
        'Can complete 2 set of data submissions per day',
        'Better profits and permissions',
        'Full access to all other premium features'
      ]
    }
  ]

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '20px 16px' }}>

      {/* 1. BACK BUTTON & TITLE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: '#000',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#000000',
          margin: '0 auto',
          transform: 'translateX(-16px)'
        }}>
          Vip Levels
        </h1>
      </div>

      {/* 2. VIP CARDS CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {vipData.map((vip) => (
          <div
            key={vip.id}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '24px 20px',
              position: 'relative',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Top Info Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', margin: '0 0 12px 0' }}>
                  {vip.title}
                </h2>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#E67E22', marginBottom: '16px' }}>
                  {vip.price}
                </div>
              </div>
            </div>

            {/* Main Content Info Flex Row */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

              {/* Custom Ribbon Graphic Medals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', flexShrink: 0, marginTop: '4px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: vip.badgeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    background: vip.innerBadgeColor,
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>★</span>
                  </div>
                </div>
                {/* Ribbon Tails */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '-8px', zIndex: 1 }}>
                  <div style={{ width: '10px', height: '24px', background: vip.badgeColor, transform: 'rotate(5deg)', borderRadius: '2px' }} />
                  <div style={{ width: '10px', height: '24px', background: vip.badgeColor, transform: 'rotate(-5deg)', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Bulleted Perk Lists */}
              <ul style={{ margin: 0, padding: 0, listStyleType: 'none', flex: 1 }}>
                {vip.perks.map((perk, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '13px',
                      color: '#333333',
                      lineHeight: '1.5',
                      marginBottom: '6px',
                      position: 'relative',
                      paddingLeft: '12px',
                      fontWeight: '500'
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0, color: '#000000' }}>•</span>
                    {perk}
                  </li>
                ))}
              </ul>

            </div>

          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '80px' }}>
        <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>
          Copyrights 2026 © Disruptive Advertising Agency
        </p>
      </div>

      <BottomNav />
    </div>
  )
}