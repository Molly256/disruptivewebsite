'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('reviewing') // reviewing | success | reject
  const [transactions, setTransactions] = useState([])

  const [withdrawAmount, setWithdrawAmount] = useState('0')
  const [txPassConfirm, setTxPassConfirm] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { router.push('/login'); return }
    setUser(JSON.parse(savedUser))
  }, [router])

  useEffect(() => {
    if(showHistory && user) {
      fetchTransactions()
    }
  }, [showHistory, activeTab, user])

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/transactions?userId=${user.id}&type=all`)
      const data = await res.json()
      if(res.ok) setTransactions(data.transactions || [])
    } catch(e) { console.error(e) }
  }

  const handleWithdraw = async () => {
    setMsg('')
    const amount = withdrawAmount === 'ALL'? Number(user.walletBalance) : Number(withdrawAmount)
    if(amount <= 0) { setMsg(t('pleaseEnterAmount')); return }
    if(!user.boundWallet) { setMsg(t('pleaseBindWallet')); return }
    if(!txPassConfirm) { setMsg(t('enterTxPass')); return }

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userId: user.id, type: 'withdraw', amount, txPass: txPassConfirm})
    })
    const data = await res.json()

    if(res.ok) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      setMsg(t('withdrawRequestSent'))
      setWithdrawAmount('0')
      setTxPassConfirm('')
      fetchTransactions()
    } else {
      setMsg(data.error || t('withdrawFailed'))
    }
  }

  if(!user) return null

  const totalBalance = Number(user.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const freezeAmount = Number(user.freezeAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const filteredTx = transactions.filter(tx => {
    if(tx.type!== 'withdraw' && tx.type!== 'deposit' && tx.type!== 'special_bonus') return false
    if(activeTab === 'reviewing') return tx.status === 'pending'
    if(activeTab === 'success') return tx.status === 'completed'
    if(activeTab === 'reject') return tx.status === 'rejected'
    return false
  })

  const formatUSDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+)/, '$3/$1/$2/$4')
  }

  const getTxLabel = (type) => {
    if(type === 'special_bonus') return 'special bonus'
    return type
  }

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1,
        padding: '10px 0',
        border: 'none',
        borderRadius: 8,
        background: activeTab === id? '#FF0000' : 'transparent',
        color: activeTab === id? '#FFF' : '#000',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>{t('withdraw')}</h1>
        </div>

        {/* CARD 1: BALANCE */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#FF6B00', fontWeight: 700 }}>{t('totalBalance')}</span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={() => router.push('/withdraw')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                <span>💸</span> {t('withdraw')}
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: '#000', fontSize: 14, fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}
              >
                <span>📜</span> History
              </button>
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#000', marginBottom: 4 }}>{totalBalance} <span style={{ fontSize: 16, fontWeight: 600 }}>USD</span></div>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>You will receive your withdrawal within an hour</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#666' }}>{t('freeze')}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#FF0000' }}>{freezeAmount} USD</span>
          </div>

          {/* HISTORY TABS */}
          {showHistory && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #EEE' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <TabBtn id="reviewing" label="Reviewing" />
                <TabBtn id="success" label="Success" />
                <TabBtn id="reject" label="Reject" />
              </div>

              {filteredTx.length === 0? (
                <p style={{ textAlign: 'center', color: '#999', fontSize: 13 }}>{t('noRecords')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filteredTx.map(tx => (
                    <div key={tx.id} style={{ background: '#F8F8F8', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#000', textTransform: 'lowercase' }}>{getTxLabel(tx.type)}</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: tx.type === 'withdraw'? '#FF0000' : '#00A86B' }}>
                          {tx.type === 'withdraw'? '-' : '+'}{Number(tx.amount).toFixed(2)} USD
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#999' }}>{formatUSDate(tx.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CARD 2: WITHDRAW ACCOUNT */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('withdrawAccount')}</div>
          {user.boundWallet? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{user.boundWallet.type} - {user.boundWallet.name}</div>
              <div style={{ fontSize: 13, color: '#333', wordBreak: 'break-all' }}>{user.boundWallet.address}</div>
            </div>
          ) : (
            <div style={{ color: '#FF0000', fontSize: 14 }}>{t('noWalletBound')}</div>
          )}
        </div>

        {/* CARD 3: WITHDRAW FORM */}
        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('withdrawAmount')}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="0"
              type="number"
              style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: '1px solid #EEE', fontSize: 15 }}
            />
            <button
              onClick={() => setWithdrawAmount(String(user.walletBalance))}
              style={{ background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('all')}
            </button>
          </div>

          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{t('transactionPassword')}</div>
          <input
            value={txPassConfirm}
            onChange={e => setTxPassConfirm(e.target.value)}
            type="password"
            placeholder={t('enterTxPassword')}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #EEE', fontSize: 15, boxSizing: 'border-box', marginBottom: 16 }}
          />

          {msg && <p style={{color:'#FF0000', fontSize:12, margin: '0 0 16px'}}>{msg}</p>}

          <button
            onClick={handleWithdraw}
            style={{ width: '100%', background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
          >
            {t('submit')}
          </button>

          <p style={{ fontSize: 11, color: '#999', marginTop: 12 }}>
            {t('withdrawNote')}
          </p>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>{t('copyright')}</p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}