'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react' // <-- ADDED
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function EventPage() {
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

  const rewards = [
    { tier: 'Basic', amount: 'USD 100', extra: 'USD 10' },
    { tier: 'Standard', amount: 'USD 500', extra: 'USD 60' },
    { tier: 'Hot Pick', amount: 'USD 1,000', extra: 'USD 120' },
    { tier: 'Best Deal', amount: 'USD 1,600', extra: 'USD 200' },
    { tier: 'Recommended', amount: 'USD 5,500', extra: 'USD 1,200' },
    { tier: 'Premium', amount: 'USD 10,000', extra: 'USD 2,400' },
  ]

  const vipLevels = [
    { level: 'VIP 1', icon: '⭐', profit: '0.5%', work: '40 products/ set', deposit: 'usd 100-499', bg: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' },
    { level: 'VIP 2', icon: '💎', profit: '1.0%', work: '45 products/ set', deposit: 'usd 500-1,599', bg: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' },
    { level: 'VIP 3', icon: '💚', profit: '1.5%', work: '50 products/ set', deposit: 'usd 1,600-5,499', bg: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' },
    { level: 'VIP 4', icon: '💗', profit: '2.0%', work: '55 products/ set', deposit: 'usd 5,500-9,999', bg: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' },
    { level: 'VIP 5', icon: '💠', profit: '2.5%', work: '60 products/ set', deposit: 'usd 10,000-above', bg: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' },
  ]

  const workdays = [
    { days: 2, salary: 'USD 120' },
    { days: 5, salary: 'USD 1,000' },
    { days: 10, salary: 'USD 1,400' },
    { days: 20, salary: 'USD 1,600' },
    { days: 30, salary: 'USD 2,000' },
  ]

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>

      <AppHeader />

      {/* TITLE */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', margin: 0, flex: 1, textAlign: 'center' }}>
          EVENT
        </h1>
      </div>

      {/* LOGO + TITLE SECTION */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <img src="/logo.png" alt="Disruptive" style={{ width: '90px', height: 'auto' }} />
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#FF0000', fontSize: '12px', fontWeight: '600', margin: 0, fontStyle: 'italic' }}>
            3rd Anniversary<br/>Thanksgiving Feedback
          </p>
          <p style={{ color: '#000', fontSize: '14px', fontWeight: '700', margin: '4px 0 0' }}>
            Advances Activities.
          </p>
        </div>
      </div>

      {/* 1ST BLOCK: RESET ADVANCE REWARDS */}
      <div style={{ margin: '0 20px 24px', background: '#000', borderRadius: '12px', padding: '16px' }}>
        <h2 style={{ color: '#FFF', fontSize: '14px', fontWeight: '700', margin: '0 0 12px' }}>
          Reset Advance Rewards <span style={{ color: '#FF0000' }}>.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {rewards.map((item) => (
            <div key={item.tier} style={{ background: '#FFF', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ background: '#FF0000', color: '#000', textAlign: 'center', padding: '6px 4px', fontSize: '11px', fontWeight: '700' }}>
                {item.tier}
              </div>
              <div style={{ padding: '8px 4px', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 2px' }}>Amount</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#000', margin: '0 0 6px' }}>{item.amount}</p>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 2px' }}>Get Extra</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#000', margin: 0 }}>{item.extra}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2ND BLOCK: ACCUMULATED DEPOSIT REWARDS */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ color: '#000', fontSize: '16px', fontWeight: '700', margin: '0 0 16px', textAlign: 'center' }}>
          Accumulated Deposit Rewards For The Day <span style={{ color: '#FF0000' }}>.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { range: '1,500 - 9,999', percent: '4%', color: '#FF00FF' },
            { range: '10,000 - 19,999', percent: '8%', color: '#00FF00' },
            { range: '20,000 - 49,999', percent: '12%', color: '#00FFFF' },
            { range: '50,000 - above', percent: '20%', color: '#FFFF00' }
          ].map((item) => (
            <div key={item.range} style={{ background: '#000', borderRadius: '10px', padding: '12px', position: 'relative' }}>
              <p style={{ color: '#AAA', fontSize: '9px', margin: '0 0 4px' }}>Advances On Day (USD)</p>
              <p style={{ color: item.color, fontSize: '12px', fontWeight: '700', margin: '0 0 4px' }}>{item.range}</p>
              <p style={{ color: '#AAA', fontSize: '9px', margin: '0 0 2px' }}>Will Get (USD)</p>
              <p style={{ color: '#FFF', fontSize: '9px', margin: 0 }}>Advance Reward</p>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#FFF', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#000', fontSize: '16px', fontWeight: '800' }}>{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER FOR FIRST 2 BLOCKS */}
      <div style={{ margin: '0 20px 24px', background: '#000', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px' }}>
        <p style={{ color: '#AAA', fontSize: '9px', margin: 0 }}>Copyrights 2026 © Disruptive</p>
        <p style={{ color: '#AAA', fontSize: '9px', margin: 0, textAlign: 'right' }}>*The final interpretation right belongs to Disruptive platform</p>
      </div>

      {/* 3RD BLOCK: VIP LEVEL CHART */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <img src="/logo.png" alt="Disruptive" style={{ width: '100px', height: 'auto' }} />
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ color: '#000', fontSize: '16px', fontWeight: '800', margin: '0 0 4px' }}>VIP Level Chart<span style={{ color: '#FF0000' }}>.</span></h2>
            <p style={{ color: '#FF0000', fontSize: '10px', fontWeight: '500', margin: 0 }}>The More You Recharge • The Higher You Rise</p>
          </div>
        </div>
        <div style={{ background: '#000', borderRadius: '12px', padding: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1.4fr', gap: '4px', padding: '8px 4px', color: '#FFF', fontSize: '10px', fontWeight: '600' }}>
            <span>VIP Level</span><span>Profit Rate/<br/>Deal</span><span>Daily Work<br/>Opportunities</span><span>Unlock Condition/<br/>First Deposit Amount</span>
          </div>
          {vipLevels.map((vip) => (
            <div key={vip.level} style={{ background: vip.bg, borderRadius: '8px', padding: '10px', marginBottom: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1.4fr', gap: '4px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '18px' }}>{vip.icon}</span><span style={{ color: '#FFF', fontSize: '11px', fontWeight: '700' }}>{vip.level}</span></div>
              <span style={{ color: '#FFF', fontSize: '11px', fontWeight: '700' }}>{vip.profit}</span>
              <span style={{ color: '#FFF', fontSize: '11px', fontWeight: '700' }}>{vip.work}</span>
              <span style={{ color: '#FFF', fontSize: '11px', fontWeight: '700', textTransform: 'lowercase' }}>{vip.deposit}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ color: '#000', fontSize: '12px', fontWeight: '700', margin: '0 0 8px' }}>Notice to all users:</h3>
          <p style={{ color: '#444', fontSize: '10px', lineHeight: '1.5', margin: '0 0 12px' }}>All advance for the above mentioned unlocked VIP levels will be credited to the account and all deposits can be withdrawn by the user after completing the daily works.</p>
          <h3 style={{ color: '#000', fontSize: '12px', fontWeight: '700', margin: '0 0 6px' }}>Benefits of Upgrading Your VIP Level:</h3>
          <ul style={{ color: '#444', fontSize: '10px', lineHeight: '1.6', margin: '0 0 12px', paddingLeft: '16px' }}>
            <li>Higher Daily Profits</li><li>More Work Opportunities</li><li>Priority Access to Special Events</li><li>Bonus Rewards for Top-tier Members</li>
          </ul>
          <p style={{ color: '#000', fontSize: '10px', fontWeight: '700', fontStyle: 'italic', margin: 0 }}>Upgrade today and maximize your earning power!</p>
        </div>
      </div>

      {/* 4TH BLOCK: WORKDAY REWARDS SCHEME - LAST BLOCK */}
      <div style={{ padding: '0 20px 20px' }}>
        {/* LOGO LEFT + TITLE RIGHT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <img src="/logo.png" alt="Disruptive" style={{ width: '100px', height: 'auto' }} />
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ color: '#000', fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>Workday Rewards Scheme<span style={{ color: '#FF0000' }}>.</span></h2>
            <p style={{ color: '#FF0000', fontSize: '10px', fontWeight: '600', margin: 0 }}>Sign In • Show Up • Get Paid</p>
          </div>
        </div>

        {/* BLACK TABLE */}
        <div style={{ background: '#000', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: '#FFF', fontSize: '12px', fontWeight: '700', margin: 0 }}>Days Worked</h3>
            <h3 style={{ color: '#FFF', fontSize: '12px', fontWeight: '700', margin: 0 }}>Salary Earned</h3>
          </div>

          {workdays.map((item) => (
            <div key={item.days} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
              {/* LEFT BLUE → HOT RED */}
              <div style={{ background: '#FF0000', borderRadius: '6px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#FFF', fontSize: '10px', fontWeight: '600' }}>Sign in</span>
                <span style={{ color: '#FFF', fontSize: '16px', fontWeight: '800' }}>{item.days}</span>
                <span style={{ color: '#FFF', fontSize: '10px', fontWeight: '600' }}>working days</span>
              </div>

              {/* LIGHTNING + SALARY */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <div style={{ background: '#FFF', border: '2px solid #FF0000', borderRadius: '6px', padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                  <span style={{ color: '#FF0000', fontSize: '11px', fontWeight: '600' }}>USD </span>
                  <span style={{ color: '#FF0000', fontSize: '14px', fontWeight: '800' }}>{item.salary.replace('USD ', '')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ color: '#000', fontSize: '12px', fontWeight: '700', margin: '0 0 6px' }}>How It Works:</h3>
          <p style={{ color: '#444', fontSize: '10px', lineHeight: '1.5', margin: '0 0 8px' }}>
            For everyday you sign in and complete your work, you earn guaranteed income!<br/>
            The more you show up, the more you earn. Simple as that!
          </p>
          <p style={{ color: '#FF0000', fontSize: '10px', fontWeight: '700', margin: 0 }}>
            Perfect attendance will earn up to USD 6,120 per month.
          </p>
        </div>
      </div>

      {/* FINAL FOOTER */}
      <div style={{ margin: '0 20px 20px', background: '#000', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px' }}>
        <p style={{ color: '#AAA', fontSize: '9px', margin: 0 }}>Copyrights 2026 © Disruptive</p>
        <p style={{ color: '#AAA', fontSize: '9px', margin: 0, textAlign: 'right' }}>*The final interpretation right belongs to Disruptive platform</p>
      </div>

      <BottomNav />
    </div>
  )
}