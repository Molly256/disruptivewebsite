'use client'
import { useState } from 'react'

export default function AdminRiskControlModal({ isOpen, onClose, adminId }) {
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const search = async () => {
    if(!query.trim()) return
    setLoading(true); setNotFound(false); setUser(null)
    const res = await fetch(`/api/admin/risk/search?q=${encodeURIComponent(query.trim())}`)
    const data = await res.json()
    setLoading(false)
    if(!data.found) setNotFound(true)
    else setUser(data.user)
  }

  const toggle = async (val) => {
    const res = await fetch('/api/admin/risk/toggle', { method:'POST', body: JSON.stringify({ userId: user.id, value: val, adminId }) })
    const data = await res.json()
    if(data.success) setUser({...user, isRiskControlled: data.isRiskControlled})
  }

  if(!isOpen) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'420px', maxWidth:'92vw', background:'#fff', borderRadius:'16px', padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
          <h3 style={{ margin:0, fontWeight:'700' }}>Risk Control</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
          <div style={{ flex:1, position:'relative' }}>
            <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}>🔍</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Username or phone" style={{ width:'100%', padding:'12px 12px 12px 38px', border:'1px solid #ddd', borderRadius:'12px', outline:'none' }} />
          </div>
          <button onClick={search} style={{ background:'#000', color:'#fff', border:'none', borderRadius:'12px', padding:'0 20px', cursor:'pointer', fontWeight:'600' }}>Search</button>
        </div>

        {loading && <div style={{ textAlign:'center', color:'#888' }}>Searching...</div>}
        {notFound && <div style={{ textAlign:'center', color:'red' }}>User not found</div>}

        {user && (
          <div style={{ border:'1px solid #eee', borderRadius:'14px', padding:'16px' }}>
            <div style={{ marginBottom:'12px', fontSize:'13px', lineHeight:'1.8' }}>
              <div><b>Username:</b> {user.username}</div>
              <div><b>Phone:</b> {user.phone}</div>
              <div><b>VIP Level:</b> {user.vipLevel}</div>
              <div><b>Balance:</b> ${user.walletBalance?.toFixed(2)}</div>
              <div><b>Status:</b> <span style={{ color: user.isRiskControlled? '#e00' : '#0a0', fontWeight:'700' }}>{user.isRiskControlled? 'UNDER RISK CONTROL 🔴' : 'Normal 🟢'}</span></div>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              {!user.isRiskControlled ? (
                <button onClick={()=>toggle(true)} style={{ flex:1, background:'#ff4444', color:'#fff', border:'none', borderRadius:'10px', padding:'12px', fontWeight:'700', cursor:'pointer' }}>Put Under Risk Control</button>
              ) : (
                <button onClick={()=>toggle(false)} style={{ flex:1, background:'#44ff88', color:'#000', border:'none', borderRadius:'10px', padding:'12px', fontWeight:'700', cursor:'pointer' }}>Remove Risk Control</button>
              )}
            </div>
            <div style={{ fontSize:'11px', color:'#888', marginTop:'10px', textAlign:'center' }}>When ON, user withdraw will show black toast: "Your account is under risk control please go to customer service now."</div>
          </div>
        )}
      </div>
    </div>
  )
}