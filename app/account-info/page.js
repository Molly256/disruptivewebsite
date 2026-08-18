'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { t } from '@/lib/i18n'

// MOVED OUTSIDE + ADDED EYE TOGGLE
const Input = ({label, value, onChange, type='text', placeholder=''}) => {
  const [show, setShow] = useState(false)
  const inputType = type === 'password' && show? 'text' : type

  return (
    <div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          type={inputType}
          placeholder={placeholder}
          style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 8, border: '1px solid #EEE', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          >
            {show? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  )
}

const ReadOnly = ({label, value}) => (
  <div>
    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{label}</div>
    <div style={{ background: '#F5F5F5', padding: '12px 14px', borderRadius: 8, fontSize: 15, fontWeight: 600 }}>{value || '-'}</div>
  </div>
)

export default function AccountInfoPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState('')
  const [msgTx, setMsgTx] = useState('') // separate for tx

  // password states
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [repeatPass, setRepeatPass] = useState('')

  // tx password states
  const [oldTxPass, setOldTxPass] = useState('')
  const [newTxPass, setNewTxPass] = useState('')
  const [repeatTxPass, setRepeatTxPass] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { router.push('/login'); return }
    setUser(JSON.parse(savedUser))
  }, [router])

  const saveToDB = async (payload) => {
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userId: user.id,...payload})
    })
    const data = await res.json()
    if(res.ok) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  }

  const handleUpdatePassword = async () => {
    setMsg('')
    if(!oldPass ||!newPass ||!repeatPass) { setMsg(t('fillAllFields')); return }
    if(newPass!== repeatPass) { setMsg(t('passwordsDontMatch')); return }
    if(newPass === oldPass) { setMsg(t('newPassDifferent')); return }

    const data = await saveToDB({type: 'password', oldPass, newPass})
    setMsg(data.error || t('passwordUpdated'))
    if(data.user) { setOldPass(''); setNewPass(''); setRepeatPass('') }
  }

  const handleUpdateTxPassword = async () => {
    setMsgTx('')
    if(!oldTxPass ||!newTxPass ||!repeatTxPass) { setMsgTx(t('fillAllFields')); return }
    if(newTxPass!== repeatTxPass) { setMsgTx(t('passwordsDontMatch')); return }

    const data = await saveToDB({type: 'txpassword', oldPass: oldTxPass, newPass: newTxPass})
    setMsgTx(data.error || t('txPasswordUpdated'))
    if(data.user) { setOldTxPass(''); setNewTxPass(''); setRepeatTxPass('') }
  }

  if(!user) return null

  return (
    <div style={{ background: '#F2F2F2', minHeight: '100vh', paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => router.back()} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>{t('accountInfo')}</h1>
        </div>

        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>{t('accountInformation')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ReadOnly label={t('username')} value={user.username} />
            <ReadOnly label={t('phone')} value={user.phone} />
            <ReadOnly label={t('gender')} value={user.gender} />
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>{t('updatePassword')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label={t('insertOldPassword')} value={oldPass} onChange={setOldPass} type="password" placeholder={t('enterCurrentPassword')} />
            <Input label={t('insertNewPassword')} value={newPass} onChange={setNewPass} type="password" placeholder={t('enterNewPassword')} />
            <Input label={t('repeatNewPassword')} value={repeatPass} onChange={setRepeatPass} type="password" placeholder={t('repeatNewPassword')} />
            {msg && <p style={{color:'#FF0000', fontSize:12, margin: 0}}>{msg}</p>}
            <button onClick={handleUpdatePassword} style={{ background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {t('save')}
            </button>
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: 12, padding: 16, marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>{t('updateTxPassword')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label={t('insertOldPassword')} value={oldTxPass} onChange={setOldTxPass} type="password" placeholder={t('enterCurrentTxPassword')} />
            <Input label={t('insertNew')} value={newTxPass} onChange={setNewTxPass} type="password" placeholder={t('enterNewTxPassword')} />
            <Input label={t('repeatNew')} value={repeatTxPass} onChange={setRepeatTxPass} type="password" placeholder={t('repeatNewTxPassword')} />
            {msgTx && <p style={{color:'#FF0000', fontSize:12, margin: 0}}>{msgTx}</p>}
            <button onClick={handleUpdateTxPassword} style={{ background: '#FF0000', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {t('save')}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}