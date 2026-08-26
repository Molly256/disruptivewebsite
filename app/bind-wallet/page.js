'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function BindWalletPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')

  const [withdrawType, setWithdrawType] = useState('BTC')
  const [walletName, setWalletName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { router.push('/login'); return }
    const u = JSON.parse(savedUser)
    setUser(u)
    if(u.boundWallet){
      setWithdrawType(u.boundWallet.type || 'BTC')
      setWalletName(u.boundWallet.name || '')
      setWalletAddress(u.boundWallet.address || '')
    }
  }, [router])

  const saveToDB = async () => {
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        userId: user.id,
        boundWallet: { type: withdrawType, name: walletName, address: walletAddress }
      })
    })
    const data = await res.json()
    if(res.ok) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      setShowForm(false)
      setMsg(t('walletBound'))
    } else {
      setMsg(data.error || 'Error')
    }
  }

  const handleBindWallet = async () => {
    setMsg('')
    if(!walletName ||!walletAddress) { setMsg(t('fillAllFields')); return }
    await saveToDB()
  }

  if(!user) return null

  const networks = ['BTC','ETH','ERC-USDT','TRC-USDT']

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      <style jsx>{`
      .page-wrapper {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 16px;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
        .page-wrapper {
            max-width: 700px;
            padding: 24px;
          }
        }
        @media (min-width: 1200px) {
        .page-wrapper {
            max-width: 800px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>{t('bindWallet')}</h1>
        </div>

        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#000', margin: '0 0 16px' }}>{t('paymentMethods')}</h3>

          {!user.boundWallet &&!showForm && (
            <>
              <p style={{ textAlign: 'center', color: '#999', padding: '40px 0 20px', fontSize: 14 }}>{t('noMoreData')}</p>
              <button onClick={() => setShowForm(true)} style={{ width: '100%', background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {t('create')}
              </button>
            </>
          )}

          {user.boundWallet &&!showForm && (
            <div style={{ background: '#F5F5F5', padding: 16, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#FF0000' }}>{user.boundWallet.type}</span>
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}><b>{t('walletName')}:</b> {user.boundWallet.name}</div>
              <div style={{ fontSize: 13, color: '#666', wordBreak: 'break-all' }}><b>{t('walletAddress')}:</b> {user.boundWallet.address}</div>
              <button onClick={() => setShowForm(true)} style={{ width: '100%', background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
                {t('edit')}
              </button>
            </div>
          )}

          {showForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#F5F5F5', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('withdrawType')}</div>
                <select value={withdrawType} onChange={e => setWithdrawType(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #DDD', fontSize: 15, background: '#FFF', fontWeight: 600 }}>
                  {networks.map(tw => (<option key={tw} value={tw}>{tw} {withdrawType === tw && '✓'}</option>))}
                </select>
                <div style={{ fontSize: 11, color: '#FF0000', marginTop: 6 }}>{t('selected')}: {withdrawType} ✓</div>
              </div>

              <div style={{ background: '#F5F5F5', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('walletName')}</div>
                <input value={walletName} onChange={e => setWalletName(e.target.value)} placeholder="e.g. My Binance Wallet" style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #DDD', fontSize: 15, boxSizing: 'border-box', marginBottom: 16 }} />
                <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('walletAddress')}</div>
                <input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Paste your wallet address here" style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #DDD', fontSize: 15, boxSizing: 'border-box' }} />
              </div>

              {msg && <p style={{color:'#FF0000', fontSize:12, margin: 0}}>{msg}</p>}

              <button onClick={handleBindWallet} style={{ width: '100%', background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {t('submit')}
              </button>
              <button onClick={() => setShowForm(false)} style={{ width: '100%', background: '#E0E0E0', color: '#000', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {t('cancel')}
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}