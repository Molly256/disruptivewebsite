'use client'
import { useState } from 'react'

export default function AdminTransactPasswordModal({ isOpen, onClose, adminId }) {
  const [query, setQuery] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showNewPassInput, setShowNewPassInput] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [saving, setSaving] = useState(false)

  const search = async () => {
    if(!query.trim()) return
    setLoading(true)
    setMsg('')
    setUserData(null)
    setShowNewPassInput(false)
    try{
      const res = await fetch(`/api/admin/search-user?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if(res.ok && data.user){
        setUserData(data.user)
      }else{
        setMsg(data.error || 'User not found')
      }
    }catch{
      setMsg('Network error')
    }finally{ setLoading(false) }
  }

  const handleSave = async () => {
    if(!newPass.trim() || newPass.length < 4){
      setMsg('Password must be at least 4 chars')
      return
    }
    setSaving(true)
    setMsg('')
    try{
      const res = await fetch('/api/admin/reset-transact-password',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: userData.id, newPassword: newPass, adminId })
      })
      const data = await res.json()
      if(res.ok){
        setMsg('Transaction password reset successfully')
        setShowNewPassInput(false)
        setNewPass('')
      }else{
        setMsg(data.error || 'Failed to reset')
      }
    }catch{
      setMsg('Save failed')
    }finally{ setSaving(false) }
  }

  if(!isOpen) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', width:'100%', maxWidth:520, borderRadius:16, overflow:'hidden', maxHeight:'90vh', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'#000', color:'#fff', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <b>Transact Password</b>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', fontSize:22, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding:16, overflowY:'auto' }}>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <input 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
              onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder="Username or phone"
              style={{ flex:1, border:'1px solid #ddd', borderRadius:10, padding:'12px 14px', outline:'none' }}
            />
            <button onClick={search} disabled={loading} style={{ width:48, height:48, borderRadius:10, border:'none', background:'#000', color:'#fff', fontSize:20, cursor:'pointer' }}>
              {loading?'…':'🔍'}
            </button>
          </div>

          {msg && <div style={{ background:'#ffecec', color:'#c00', padding:'8px 12px', borderRadius:8, fontSize:13, marginBottom:12 }}>{msg}</div>}

          {userData && (
            <div style={{ border:'1px solid #eee', borderRadius:12, padding:14 }}>
              <div style={{ fontSize:13, lineHeight:'22px' }}>
                <div><b>Username:</b> {userData.username}</div>
                <div><b>Phone:</b> {userData.phone}</div>
                <div><b>Country:</b> {userData.countryName} ({userData.countryCode})</div>
                <div><b>VIP:</b> {userData.vipLevel}</div>
                <div><b>Balance:</b> {userData.walletBalance}</div>
                <div><b>Created:</b> {new Date(userData.createdAt).toLocaleString()}</div>
              </div>

              <div style={{ marginTop:16, paddingTop:14, borderTop:'1px dashed #ddd' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>Transaction Password</span>
                  <button 
                    onClick={()=>setShowNewPassInput(!showNewPassInput)}
                    style={{ background:'#FF0000', color:'#000', border:'none', padding:'6px 16px', borderRadius:8, fontWeight:800, cursor:'pointer' }}
                  >
                    Reset
                  </button>
                </div>

                {showNewPassInput && (
                  <div style={{ background:'#f9f9f9', padding:12, borderRadius:10 }}>
                    <input 
                      type="text"
                      value={newPass}
                      onChange={e=>setNewPass(e.target.value)}
                      placeholder="Enter new transact password"
                      style={{ width:'100%', border:'1px solid #ddd', borderRadius:8, padding:'10px 12px', marginBottom:10, outline:'none' }}
                    />
                    <button 
                      onClick={handleSave} 
                      disabled={saving}
                      style={{ background:'#FF0000', color:'#fff', border:'none', padding:'8px 18px', borderRadius:8, fontWeight:800, cursor:'pointer', fontSize:13 }}
                    >
                      {saving?'Saving...':'Save'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}