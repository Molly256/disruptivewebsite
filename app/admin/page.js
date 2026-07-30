'use client'
import { useState } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const vipList = [
  { id: 2, name: 'VIP2', price: 500, tasks: 45 },
  { id: 3, name: 'VIP3', price: 1600, tasks: 50 },
  { id: 4, name: 'VIP4', price: 5500, tasks: 55 },
  { id: 5, name: 'VIP5', price: 10000, tasks: 60 }
]

const vipSets = [
  'vip1set1','vip1set2',
  'vip2set1','vip2set2','vip2set3','vip2set4',
  'vip3set1','vip3set2','vip3set3','vip3set4',
  'vip4set1','vip4set2','vip4set3','vip4set4',
  'vip5set1','vip5set2','vip5set3','vip5set4','vip5set5'
]

export default function AdminPage() {
  const [tab, setTab] = useState('upgrade')
  const admin = typeof window!== 'undefined'? JSON.parse(localStorage.getItem('user') || '{}') : {}

  // 1. UPGRADE STATES
  const [search, setSearch] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedVip, setSelectedVip] = useState(null)

  // 2. PASSWORD RESET STATES
  const [passSearch, setPassSearch] = useState('')
  const [passUser, setPassUser] = useState(null)
  const [showPassInput, setShowPassInput] = useState(false)
  const [newPass, setNewPass] = useState('')

  // 3. DEPOSIT STATES
  const [depositAmount, setDepositAmount] = useState('')
  const [depositTarget, setDepositTarget] = useState('')
  const [showDepositConfirm, setShowDepositConfirm] = useState(false)

  // 4. WITHDRAW STATES - fake data for UI
  const [withdrawList] = useState([
    { id:1, username:'testuser', phone:'+2567...', amount:200, status:'pending', date:new Date() }
  ])

  // 5. MERGE STATES
  const [mergeTarget, setMergeTarget] = useState('')
  const [selectedSet, setSelectedSet] = useState('')
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [showPhotos, setShowPhotos] = useState(false)

  const TabBtn = ({ id, label }) => (
    <button onClick={()=>setTab(id)} style={{
      background: tab===id? '#FF1493':'#F1F1F1',
      color: tab===id? '#FFF':'#000',
      border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'800', fontSize:'14px'
    }}>{label}</button>
  )

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '90px', paddingBottom: '90px' }}>
      <AppHeader />

      <div style={{ padding: '0 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', marginBottom: '16px' }}>👑 Admin Panel</h1>

        {/* TABS */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto' }}>
          <TabBtn id='upgrade' label='Upgrade VIP' />
          <TabBtn id='password' label='Reset Password' />
          <TabBtn id='deposit' label='Deposits' />
          <TabBtn id='withdraw' label='Withdraw' />
          <TabBtn id='merge' label='Merge' />
        </div>

        {/* ========== 1. UPGRADE VIP ========== */}
        {tab === 'upgrade' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px' }} />
              <button onClick={()=>alert('Search API next')} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px' }}>🔍</button>
            </div>

            {foundUser && (
              <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
                <p><b>{foundUser.username}</b></p>
                <p>{foundUser.phone}</p>
                <p>Current VIP: <span style={{ color:'#FF1493', fontWeight:'700' }}>{foundUser.vipLevel || 'VIP1'}</span></p>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'800', width:'100%' }}>Upgrade</button>

                {showDropdown && (
                  <div style={{ background:'#222', padding:'12px', marginTop:'12px', borderRadius:'12px' }}>
                    {vipList.map(vip => (
                      <div key={vip.id} onClick={() => setSelectedVip(vip)} style={{ padding:'12px', cursor:'pointer', background: selectedVip?.id === vip.id? '#FF1493' : 'transparent', borderRadius:'8px' }}>
                        {vip.name} - ${vip.price} - {vip.tasks} Tasks
                      </div>
                    ))}
                    <button onClick={()=>alert('Upgrade API next')} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', marginTop:'10px', fontWeight:'800' }}>OK</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== 2. PASSWORD RESET ========== */}
        {tab === 'password' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={passSearch} onChange={e => setPassSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px' }} />
              <button onClick={()=>alert('Search user API next')} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px' }}>🔍</button>
            </div>

            {passUser && (
              <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
                <p><b>{passUser.username}</b></p>
                <p>{passUser.phone}</p>
                <p>{passUser.countryName}</p>
                <p>Gender: {passUser.gender}</p>
                <button onClick={()=>setShowPassInput(true)} style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'800', width:'100%' }}>Reset</button>

                {showPassInput && (
                  <div style={{ marginTop:'12px' }}>
                    <input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New Password" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px' }} />
                    <button onClick={()=>alert('Reset API next')} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800' }}>OK</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== 3. DEPOSITS ========== */}
        {tab === 'deposit' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <p style={{ fontWeight:'800', marginBottom:'12px' }}>Confirm Deposit</p>
            <input value={depositAmount} onChange={e=>setDepositAmount(e.target.value)} placeholder="Amount USD" type="number" style={{ width:'100%', padding:'14px', borderRadius:'12px', marginBottom:'12px' }} />
            <button onClick={()=>setShowDepositConfirm(true)} style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'800', width:'100%' }}>Confirm</button>

            {showDepositConfirm && (
              <div style={{ background:'#222', padding:'12px', marginTop:'12px', borderRadius:'12px' }}>
                <input value={depositTarget} onChange={e=>setDepositTarget(e.target.value)} placeholder="Username or Phone" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px' }} />
                <button onClick={()=>alert('Deposit API next')} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800' }}>OK</button>
              </div>
            )}

            {/* Transaction History Example */}
            <div style={{ marginTop:'20px', background:'#111', padding:'12px', borderRadius:'10px' }}>
              <p style={{ color:'#00C853', fontWeight:'700' }}>deposit</p>
              <p style={{ fontSize:'18px', fontWeight:'700' }}>$100</p>
              <p style={{ color:'#00C853', fontWeight:'700' }}>Success</p>
              <p style={{ fontSize:'12px', color:'#AAA' }}>{new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
            </div>
          </div>
        )}

        {/* ========== 4. WITHDRAW ========== */}
        {tab === 'withdraw' && (
          <div>
            {withdrawList.map(tx => (
              <div key={tx.id} style={{ background:'#000', color:'#FFF', padding:'16px', borderRadius:'16px', marginBottom:'12px' }}>
                <p><b>{tx.username}</b></p>
                <p>{tx.phone}</p>
                <p>Amount: ${tx.amount} USD</p>
                <p style={{ fontSize:'12px', color:'#AAA' }}>{tx.date.toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
                <p style={{ color: tx.status==='pending'? 'red':'#00C853', fontWeight:'700' }}>{tx.status}</p>
                {tx.status==='pending' && (
                  <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                    <button onClick={()=>alert('Confirm API')} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'10px', borderRadius:'10px', flex:1, fontWeight:'800' }}>Confirm</button>
                    <button onClick={()=>alert('Reject API')} style={{ background:'red', color:'#FFF', border:'none', padding:'10px', borderRadius:'10px', flex:1, fontWeight:'800' }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========== 5. MERGE PRODUCTS ========== */}
        {tab === 'merge' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <p style={{ fontWeight:'800', marginBottom:'12px' }}>Merge Product Images</p>

            <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
              <input value={mergeTarget} onChange={e=>setMergeTarget(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'12px', borderRadius:'10px', border:'none' }} />
              <button style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'0 16px', borderRadius:'10px', fontWeight:'800' }}>Merge</button>
            </div>

            <select value={selectedSet} onChange={e=>setSelectedSet(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'12px', background:'#222', color:'#FFF', border:'none' }}>
              <option value="">Select VIP Set</option>
              {vipSets.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button onClick={()=>setShowPhotos(true)} style={{ background:'#FF1493', border:'none', padding:'12px', borderRadius:'10px', width:'100%', marginBottom:'12px' }}>🔍 Load Photos from /data/{selectedSet}</button>

            {showPhotos && (
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                {['photo1','photo2','photo3','photo4','photo5','photo6','photo7'].map(p=>(
                  <div key={p} onClick={()=>setSelectedPhotos(prev=> prev.includes(p)? prev.filter(x=>x!==p): [...prev,p])}
                    style={{ padding:'8px 12px', border:'2px solid', borderColor:selectedPhotos.includes(p)?'#00C853':'#555', borderRadius:'8px', cursor:'pointer' }}>
                    {p} {selectedPhotos.includes(p) && '✓'}
                  </div>
                ))}
              </div>
            )}

            <button onClick={()=>alert('Merge API next')} style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', width:'100%', fontWeight:'800' }}>Merge Selected</button>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  )
}