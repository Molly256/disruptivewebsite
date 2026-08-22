'use client'
import { useState } from 'react'

export default function AdminCreditScoreModal({ isOpen, onClose, adminId }) {
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [showDecreaseBox, setShowDecreaseBox] = useState(false)
  const [showIncreaseBox, setShowIncreaseBox] = useState(false)
  const [inputScore, setInputScore] = useState('')

  const search = async () => {
    if(!query.trim()) return
    setLoading(true)
    setNotFound(false)
    setUser(null)
    const res = await fetch(`/api/admin/credit/search?q=${encodeURIComponent(query.trim())}`)
    const data = await res.json()
    setLoading(false)
    if(!data.found) setNotFound(true)
    else setUser(data.user)
  }

  const saveScore = async (type) => {
    const num = parseInt(inputScore)
    if(isNaN(num)){ alert('Enter valid number'); return }
    if(num < 0 || num > 100){ alert('0-100 only'); return }

    // validation for decrease/increase logic
    if(type==='decrease' && num >= user.creditScore){
      if(!confirm(`Current is ${user.creditScore}, you want to set to ${num} which is higher. Continue?`)) return
    }
    if(type==='increase' && num > 100){
      alert('Max is 100'); return
    }

    const res = await fetch('/api/admin/credit/update', {
      method:'POST',
      body: JSON.stringify({ userId: user.id, newScore: num, action: type, adminId })
    })
    const data = await res.json()
    if(data.success){
      setUser({...user, creditScore: data.creditScore})
      setShowDecreaseBox(false)
      setShowIncreaseBox(false)
      setInputScore('')
    }
  }

  if(!isOpen) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'420px', maxWidth:'92vw', background:'#fff', borderRadius:'16px', padding:'20px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
          <h3 style={{ margin:0, fontWeight:'700' }}>Credit Score</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer' }}>✕</button>
        </div>

        {/* Search Input with magnifying glass */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
          <div style={{ flex:1, position:'relative' }}>
            <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}>🔍</span>
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder="Username or phone"
              style={{ width:'100%', padding:'12px 12px 12px 38px', border:'1px solid #ddd', borderRadius:'12px', outline:'none' }}
            />
          </div>
          <button onClick={search} style={{ background:'#000', color:'#fff', border:'none', borderRadius:'12px', padding:'0 20px', cursor:'pointer', fontWeight:'600' }}>Search</button>
        </div>

        {loading && <div style={{ textAlign:'center', padding:'20px', color:'#888' }}>Searching...</div>}
        {notFound && <div style={{ textAlign:'center', padding:'20px', color:'red' }}>User not found</div>}

        {user && (
          <div style={{ border:'1px solid #eee', borderRadius:'14px', padding:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <div style={{ width:'40px', height:'40px', background:'#ffe6f0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>{user.username[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontWeight:'700', fontSize:'14px' }}>{user.username}</div>
                <div style={{ fontSize:'12px', color:'#666' }}>{user.phone} • VIP {user.vipLevel}</div>
              </div>
            </div>

            {/* Credit Score Display */}
            <div style={{ textAlign:'center', padding:'16px', background:'#f8f8f8', borderRadius:'12px', marginBottom:'16px' }}>
              <div style={{ fontSize:'12px', color:'#888' }}>Current Credit Score</div>
              <div style={{ fontSize:'48px', fontWeight:'800', color: user.creditScore < 60? '#e00' : user.creditScore < 80? '#e6a00a' : '#0a0' }}>{user.creditScore}</div>
              <div style={{ fontSize:'11px', color:'#999' }}>/ 100</div>
            </div>

            {/* Two Buttons */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button
                onClick={()=>{ setShowDecreaseBox(true); setShowIncreaseBox(false); setInputScore('') }}
                style={{ flex:1, background:'#ff4444', color:'#000', border:'none', borderRadius:'10px', padding:'12px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}
              >
                Decrease Credit Score
              </button>
              <button
                onClick={()=>{ setShowIncreaseBox(true); setShowDecreaseBox(false); setInputScore('') }}
                style={{ flex:1, background:'#44ff88', color:'#000', border:'none', borderRadius:'10px', padding:'12px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}
              >
                Increase Credit Score
              </button>
            </div>

            {/* Small Box for Decrease */}
            {showDecreaseBox && (
              <div style={{ marginTop:'14px', padding:'12px', border:'1px dashed #ff4444', borderRadius:'10px', background:'#fff5f5' }}>
                <div style={{ fontSize:'12px', fontWeight:'600', marginBottom:'6px' }}>Enter new credit score (e.g. 1,20,30,80,88):</div>
                <input type="number" min="0" max="100" value={inputScore} onChange={e=>setInputScore(e.target.value)} placeholder="0-100" style={{ width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'8px', marginBottom:'8px' }} />
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>setShowDecreaseBox(false)} style={{ flex:1, padding:'8px', border:'1px solid #ddd', borderRadius:'8px', background:'#fff', cursor:'pointer' }}>Cancel</button>
                  <button onClick={()=>saveScore('decrease')} style={{ flex:1, padding:'8px', border:'none', borderRadius:'8px', background:'#000', color:'#fff', fontWeight:'700', cursor:'pointer' }}>Save</button>
                </div>
              </div>
            )}

            {/* Small Box for Increase */}
            {showIncreaseBox && (
              <div style={{ marginTop:'14px', padding:'12px', border:'1px dashed #44ff88', borderRadius:'10px', background:'#f5fff8' }}>
                <div style={{ fontSize:'12px', fontWeight:'600', marginBottom:'6px' }}>Enter new credit score (max 100):</div>
                <input type="number" min="0" max="100" value={inputScore} onChange={e=>setInputScore(e.target.value)} placeholder="0-100" style={{ width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'8px', marginBottom:'8px' }} />
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>setShowIncreaseBox(false)} style={{ flex:1, padding:'8px', border:'1px solid #ddd', borderRadius:'8px', background:'#fff', cursor:'pointer' }}>Cancel</button>
                  <button onClick={()=>saveScore('increase')} style={{ flex:1, padding:'8px', border:'none', borderRadius:'8px', background:'#000', color:'#fff', fontWeight:'700', cursor:'pointer' }}>Save</button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}