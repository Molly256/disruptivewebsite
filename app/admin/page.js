'use client'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const vipList = [
  { id: 1, name: 'VIP1', price: 100, tasks: 40 },
  { id: 2, name: 'VIP2', price: 500, tasks: 45 },
  { id: 3, name: 'VIP3', price: 1600, tasks: 50 },
  { id: 4, name: 'VIP4', price: 5500, tasks: 55 },
  { id: 5, name: 'VIP5', price: 10000, tasks: 60 }
]

export default function AdminPage() {
  const [tab, setTab] = useState('upgrade')
  const admin = typeof window!== 'undefined'? JSON.parse(localStorage.getItem('user') || '{}') : {}

  const [search, setSearch] = useState(''); const [foundUser, setFoundUser] = useState(null); const [showDropdown, setShowDropdown] = useState(false); const [selectedVip, setSelectedVip] = useState(null);
  const [resetSearch, setResetSearch] = useState(''); const [resetUser, setResetUser] = useState(null);
  const [passSearch, setPassSearch] = useState(''); const [passUser, setPassUser] = useState(null); const [showPassInput, setShowPassInput] = useState(false); const [newPass, setNewPass] = useState('');

  // MERGE STATES
  const [mergeSearch, setMergeSearch] = useState(''); const [mergeUser, setMergeUser] = useState(null); const [selectedMergeSet, setSelectedMergeSet] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]); const [selectedData, setSelectedData] = useState([]); const [mergePhotos, setMergePhotos] = useState([]);
  const [mergeView, setMergeView] = useState('photos'); const [activeSet, setActiveSet] = useState('');
  const [existingMerged, setExistingMerged] = useState([])

  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editData, setEditData] = useState({name:'', price:0})
  const [depositSearch, setDepositSearch] = useState(''); const [depositUser, setDepositUser] = useState(null); const [depositAmount, setDepositAmount] = useState(''); const [showDepositInput, setShowDepositInput] = useState(false);
  const [withdrawList, setWithdrawList] = useState([]);
  const [notifSearch, setNotifSearch] = useState(''); const [notifUser, setNotifUser] = useState(null); const [showNotifInput, setShowNotifInput] = useState(false); const [notifMessage, setNotifMessage] = useState('');
  const [bonusSearch, setBonusSearch] = useState(''); const [bonusUser, setBonusUser] = useState(null); const [showBonusInput, setShowBonusInput] = useState(false); const [bonusAmount, setBonusAmount] = useState('');

  const TabBtn = ({ id, label }) => (
    <button onClick={()=>setTab(id)} style={{ background: tab===id? '#FF1493':'#F1F1F1', color: tab===id? '#FFF':'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'800', fontSize:'14px', whiteSpace:'nowrap', flexShrink:0, cursor:'pointer' }}>{label}</button>
  )

  useEffect(() => { if(tab === 'withdraw') fetchWithdraws() }, [tab])
  const fetchWithdraws = async () => { const res = await fetch('/api/admin/withdraw/list'); const data = await res.json(); setWithdrawList(data.transactions || []) }

  const searchUser = async (q, setter) => {
    if(!q) return alert('Enter username or phone')
    const res = await fetch(`/api/user/search?q=${q}`)
    const data = await res.json()
    if(data.error) return alert(data.error)
    setter(data.user)
  }

  const handleUpgrade = async () => {
    if(!selectedVip ||!foundUser) return alert('Select VIP')
    const totalTasks = vipList.find(v => v.id === selectedVip.id).tasks
    const res = await fetch('/api/admin/upgrade-vip', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: foundUser.id, newVipLevel: selectedVip.id, totalTasks, adminId: admin.id }) })
    const data = await res.json()
    if(res.ok) { setFoundUser(data.user); setShowDropdown(false); alert(`Upgraded to VIP${selectedVip.id}`) } else alert(data.error)
  }

  const handleResetSet = async (setNum) => {
    const res = await fetch('/api/admin/reset-set', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: resetUser.id, setTo: setNum, adminId: admin.id }) })
    const data = await res.json()
    if(res.ok) { setResetUser(data.user); alert(`Reset to Set ${setNum}`) } else alert(data.error)
  }

  const handlePassReset = async () => {
    if(!newPass) return alert('Enter new password')
    const res = await fetch('/api/admin/reset-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: passUser.id, newPassword: newPass, adminId: admin.id }) })
    if(res.ok) { alert('Password Reset'); setShowPassInput(false); setNewPass('') } else alert('Failed')
  }

 const loadMergeSet = async (vipSet, setNum) => {
  if(!mergeUser) return alert('No user selected')
  const targetUserId = mergeUser.id || mergeUser._id;
  if(!targetUserId) return alert('Error: Selected user object has no valid ID structure.')

  const vipLevel = mergeUser.vipLevel || mergeUser.vip
  if(!vipLevel) return alert('Error: User has no vip level')
  if(!setNum) return alert('Error: setNum missing')

  console.log("Loading Set:", {vipLevel, setNum, vipSet}) 

  const vipData = vipList.find(v => v.id === vipLevel)
  if(!vipData) return alert(`VIP level ${vipLevel} not found in vipList`)
  const taskCount = vipData.tasks

  const start = setNum === 1 ? 1 : taskCount + 1
  const end = setNum === 1 ? taskCount : taskCount * 2

  const photos = []
  for(let i = start; i <= end; i++){
    photos.push({ id: `photo-${i}`, type: 'photos', taskOrder: i, url: `/vip${vipLevel}/set${setNum}/photo${i}.jpg`, name: `photo${i}.jpg` })
  }

  let dataItems = []
  try {
    const url = `/api/admin/get-data-file?vipSet=vip${vipLevel}Set${setNum}&userId=${targetUserId}`
    console.log("FETCHING:", url) 
    const dataRes = await fetch(url)
    if(!dataRes.ok) throw new Error(`API returned ${dataRes.status}`)
    const data = await dataRes.json()
    
    dataItems = data.map((p, idx) => {
      // 🎯 FIXED LOOKUP INDEX: Ensures tOrder maps directly to the actual task item ID number
      const tOrder = Number(p.taskOrder || p.id || (start + idx));
      return { 
        id: `data-${tOrder}`, 
        type: 'data', 
        taskOrder: tOrder, 
        price: p.price, 
        name: p.name, 
        image: p.image || `/vip${vipLevel}/set${setNum}/photo${tOrder}.jpg`, 
        rating: p.rating || 5 
      }
    })
  } catch(e) {
    console.error(e);
    alert(`Data layer error for: vip${vipLevel}Set${setNum}\nError: ${e.message}`)
  }

  setMergePhotos([...photos, ...dataItems])

  try {
    const res = await fetch(`/api/admin/merged-tasks?userId=${targetUserId}&vipSet=${vipSet}`)
    const mData = await res.json()
    setExistingMerged(mData.tasks || [])
  } catch(e) {
    console.error("merged-tasks error:", e)
  }
}

const handleMerge = async () => {
  if(selectedPhotos.length < 2) return alert('Select at least 2 photos to merge')
  const targetUserId = mergeUser.id || mergeUser._id;
  if(!targetUserId) return alert('Error: Missing tracking user parameter ID value.')

  // 🎯 THE FIX: Maps using numeric types to align perfectly with your schema keys
  const populatedPairs = selectedPhotos.map(taskOrder => {
    const numericOrder = Number(taskOrder);
    // Find matching metadata inside your mergePhotos state using numerical comparison
    const dataMatch = mergePhotos.find(p => p.type === 'data' && Number(p.taskOrder) === numericOrder) || {}
    
    return {
      photoId: numericOrder,
      dataId: numericOrder,
      taskOrder: numericOrder,
      name: dataMatch.name || `Product Item #${numericOrder}`,
      price: dataMatch.price ? parseFloat(dataMatch.price) : 0
    }
  })

  const res = await fetch('/api/admin/merge-products', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ 
      userId: targetUserId, 
      vipSet: selectedMergeSet, 
      pairs: populatedPairs, // 🎯 THE FIX: Sends under 'pairs' to match schema.prisma Json column exactly
      adminId: admin.id || admin._id || 'system' 
    })
  })
  if(res.ok) {
    alert(`Merged ${selectedPhotos.length} photos with real prices into 1 task. Saved to DB`);
    setSelectedPhotos([]);
    setSelectedData([]);
    const match = selectedMergeSet.match(/Set(\d+)/i);
    loadMergeSet(selectedMergeSet, match ? parseInt(match[1]) : 1)
  } else {
    const errText = await res.json();
    alert(`Failed: ${errText.error || 'Check server logs'}`);
  }
}

const handleSaveDataFile = async () => {
  if(selectedData.length === 0) return alert('Select data items to save')
  const targetUserId = mergeUser.id || mergeUser._id;
  if(!targetUserId) return alert('Error: User context state parameter tracking missing.')

  const updatedData = selectedData.map(taskOrder => {
    const data = mergePhotos.find(p => p.type === 'data' && Number(p.taskOrder) === Number(taskOrder));
    return { taskOrder: Number(taskOrder), name: data.name, price: parseFloat(data.price) }
  })
  
  await fetch('/api/admin/save-data-file', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ vipSet: selectedMergeSet, data: updatedData })
  })
  
  await fetch('/api/admin/update-merged-task-data', {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId: targetUserId, vipSet: selectedMergeSet, data: updatedData, adminId: admin.id || admin._id })
  })
  
  alert('Saved: /data file + DB updated');
  setSelectedData([]);
  const match = selectedMergeSet.match(/Set(\d+)/i);
  loadMergeSet(selectedMergeSet, match ? parseInt(match[1]) : 1)
}

const editPrice = (item) => { setEditingPhoto(item); setEditData({name: item.name, price: item.price}) }

const saveEdit = () => { 
  setMergePhotos(prev => prev.map(p => Number(p.taskOrder) === Number(editingPhoto.taskOrder) ? {...p, name: editData.name, price: parseFloat(editData.price)} : p)); 
  setSelectedData(prev => prev.includes(editingPhoto.taskOrder) ? prev : [...prev, editingPhoto.taskOrder]);
  setEditingPhoto(null); 
  alert('Edited locally. Hit "Save Data" to update file + DB');
}

  const handleDeposit = async () => { if(!depositAmount) return alert('Enter amount'); const res = await fetch('/api/admin/deposit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: depositUser.id, amount: parseFloat(depositAmount), adminId: admin.id }) }); if(res.ok) { const data = await res.json(); setDepositUser({...depositUser, walletBalance: data.newBalance}); alert('Deposited'); setShowDepositInput(false); setDepositAmount('') } else alert('Failed') }
  const handleWithdraw = async (txId, action) => { const res = await fetch(`/api/admin/withdraw/${action}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ txId, adminId: admin.id }) }); if(res.ok) { alert(`${action} success`); fetchWithdraws() } else alert('Failed') }
  const handleSendNotif = async () => { if(!notifMessage) return alert('Enter message'); const res = await fetch('/api/admin/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: notifUser.id, message: notifMessage, adminId: admin.id }) }); if(res.ok) { alert('Notification Sent'); setNotifMessage(''); setShowNotifInput(false) } else alert('Failed') }
  const handleGiveBonus = async () => { if(!bonusAmount) return alert('Enter amount'); const res = await fetch('/api/admin/give-bonus', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: bonusUser.id, amount: parseFloat(bonusAmount), adminId: admin.id }) }); if(res.ok) { const data = await res.json(); setBonusUser({...bonusUser, specialBonus: data.newBonus}); alert('Bonus Given'); setShowBonusInput(false); setBonusAmount('') } else alert('Failed') }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '90px', paddingBottom: '90px' }}>
      <AppHeader />
      <div style={{ padding: '0 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', marginBottom: '16px' }}>👑 Admin Panel</h1>
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' }}>
          <TabBtn id='upgrade' label='Upgrade VIP' /><TabBtn id='resetset' label='Reset Set' /><TabBtn id='password' label='Reset Password' /><TabBtn id='merge' label='Merge Tasks' />
          <TabBtn id='deposit' label='Deposit' /><TabBtn id='withdraw' label='Withdraw' /><TabBtn id='notification' label='Notification' /><TabBtn id='bonus' label='Lucky Bonus' />
        </div>

        {tab === 'upgrade' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(search, setFoundUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {foundUser && (
              <div>
                <p><b>{foundUser.username}</b> - VIP{foundUser.vipLevel}</p>
                <div style={{ position:'relative', marginTop:12 }}>
                  <button onClick={()=>setShowDropdown(!showDropdown)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:'700' }}>Select VIP Level</button>
                  {showDropdown && (<div style={{ position:'absolute', top:50, left:0, right:0, background:'#222', borderRadius:12, zIndex:10 }}>{vipList.map(v=> <div key={v.id} onClick={()=>{setSelectedVip(v); setShowDropdown(false)}} style={{ padding:12, cursor:'pointer' }}>{v.name} - ${v.price}</div>)}</div>)}
                </div>
                <button onClick={handleUpgrade} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', width:'100%', fontWeight:'800', marginTop:12 }}>Upgrade</button>
              </div>
            )}
          </div>
        )}

        {tab === 'resetset' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={resetSearch} onChange={e => setResetSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(resetSearch, setResetUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {resetUser && (<div><p><b>{resetUser.username}</b> - Set {resetUser.setsCompleted + 1}</p>{[1,2,3].map(s=> <button key={s} onClick={()=>handleResetSet(s)} style={{ background:'red', color:'#FFF', border:'none', padding:'10px', borderRadius:'8px', marginRight:8, marginTop:8 }}>Reset to Set {s}</button>)}</div>)}
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={passSearch} onChange={e => setPassSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(passSearch, setPassUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {passUser &&!showPassInput && <button onClick={()=>setShowPassInput(true)} style={{ background:'orange', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Reset Password for {passUser.username}</button>}
            {showPassInput && (<div><input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handlePassReset} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Reset</button></div>)}
          </div>
        )}

      {tab === 'merge' && (
  <div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      <input value={mergeSearch} onChange={e => setMergeSearch(e.target.value)} placeholder="Username or Phone" style={{ flex: 1, padding: 14, border: '2px solid #FF1493', borderRadius: 12, color: '#000' }} />
      <button onClick={async () => { const q = mergeSearch.trim(); if(!q) return alert('Enter search query'); const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`); const data = await res.json(); if(res.ok) { setMergeUser(data.user); const hasSet1Active = (data.user.setsCompleted || 0) === 0; setActiveSet(hasSet1Active ? 1 : 2); } else alert(data.error || 'User not found'); }} style={{ background: '#FF1493', border: 'none', borderRadius: 12, padding: '0 18px', fontSize: 20, cursor: 'pointer' }}>🔍</button>
    </div>

    {mergeUser && (
      <div style={{ background: '#000', color: '#FFF', padding: 20, borderRadius: 16 }}>
        <p style={{ fontSize: 18, margin: '0 0 10px 0' }}><b>{mergeUser.username}</b> - VIP{mergeUser.vipLevel || mergeUser.vip}</p>
        {existingMerged.length > 0 && <div style={{ background: '#111', padding: 10, borderRadius: 8, marginBottom: 12 }}><p style={{ color: '#00C853', fontWeight: 700, margin: 0 }}>⚡ {existingMerged.length} Merged Task(s) Active.</p></div>}

        {[1, 2].map(setNum => {
          const vipLevel = mergeUser.vipLevel || mergeUser.vip, userSetNum = (mergeUser.setsCompleted || 0) + 1, isActive = setNum === userSetNum;
          return (
            <div key={setNum} style={{ marginTop: 16, border: '1px solid #333', borderRadius: 12, padding: 12, background: '#0a0a0a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontWeight: 800, margin: 0 }}>Set {setNum} {isActive && <span style={{ color: '#FF0000' }}>✔️ (Current)</span>}</p>
                <button onClick={async () => { setSelectedMergeSet(`vip${vipLevel}Set${setNum}`); setActiveSet(setNum); setMergeView('photos'); setSelectedPhotos([]); setSelectedData([]); await loadMergeSet(`vip${vipLevel}Set${setNum}`, setNum); }} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '10px 14px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Merge Task</button>
              </div>

              {activeSet === setNum && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #222' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button onClick={() => setMergeView('photos')} style={{ flex: 1, background: mergeView === 'photos' ? '#FF1493' : '#222', border: 'none', padding: 12, borderRadius: 8, color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>📸 Photos & Data Sync View</button>
                  </div>

                  {mergeView && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, maxHeight: 400, overflowY: 'auto' }}>
                      {mergePhotos.filter(p => p.type === 'photos').sort((a, b) => Number(a.taskOrder) - Number(b.taskOrder)).map(p => {
                        // 🎯 THE FIX: Force strict numerical type parsing to avoid string-number comparison leaks
                        const currentOrder = Number(p.taskOrder);
                        const isSel = selectedPhotos.includes(currentOrder);
                        
                        // 🎯 THE FIX: Use explicit type and numerical order matching rules
                        const companionData = mergePhotos.find(d => d.type === 'data' && Number(d.taskOrder) === currentOrder) || {};

                        return (
                          <div key={currentOrder} style={{ width: 130, background: '#111', padding: 6, borderRadius: 8, position: 'relative', border: isSel ? '2px solid #FF0000' : '1px solid #222' }}>
                            <div onClick={() => { 
                              // 🎯 THE FIX: Saves both properties perfectly to separate cache buckets under clean numbers
                              setSelectedPhotos(v => v.includes(currentOrder) ? v.filter(x => x !== currentOrder) : [...v, currentOrder]);
                              setSelectedData(v => v.includes(currentOrder) ? v.filter(x => x !== currentOrder) : [...v, currentOrder]);
                            }} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', border: '2px solid #FFF', background: isSel ? '#FF0000' : 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>{isSel && <span style={{ color: '#FFF', fontSize: 12, fontWeight: 900 }}>✓</span>}</div>
                            
                            {/* 🎯 THE FIX: Restored exact schema-compliant w3.org namespace layout schema to prevent rendering crashes */}
                            <img src={p.url} onError={e => e.target.src='data:image/svg+xml;utf8,<svg xmlns="http://w3.org" width="100" height="90" viewBox="0 0 100 90"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="10">Missing</text></svg>'} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} />
                            
                            {/* Renders data right underneath the image preview slot natively */}
                            <div style={{ marginTop: 4, background: '#222', borderRadius: 6, padding: 4, textAlign: 'center' }}>
                              <p style={{ fontSize: 11, margin: 0, fontWeight: '800', color: '#00C853' }}>${companionData.price !== undefined ? parseFloat(companionData.price).toFixed(2) : '0.00'}</p>
                              <p style={{ fontSize: 9, margin: '2px 0 0 0', color: '#CCC', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{companionData.name || 'No Name Found'}</p>
                            </div>

                            <p style={{ fontSize: 10, margin: '4px 0 0 0', textAlign: 'center', fontWeight: 'bold' }}>Task {currentOrder}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedPhotos.length >= 2 && (
                    <button onClick={handleMerge} style={{ background: '#00C853', color: '#FFF', border: 'none', padding: 14, borderRadius: 12, width: '100%', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: 10 }}>
                      💥 Merge Selected Items & Sync Prices ({selectedPhotos.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
)}


   {tab === 'deposit' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(depositSearch, setDepositUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{depositUser &&!showDepositInput && <button onClick={()=>setShowDepositInput(true)} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Deposit to {depositUser.username} - Balance: ${depositUser.walletBalance}</button>}{showDepositInput && (<div><input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleDeposit} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Deposit</button></div>)}</div>)}

        {tab === 'withdraw' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>{withdrawList.length === 0 && <p>No pending withdrawals</p>}{withdrawList.map(tx => (<div key={tx.id} style={{ border:'1px solid #333', padding:12, borderRadius:8, marginBottom:8 }}><p><b>{tx.user?.username}</b> - ${tx.amount}</p><p style={{fontSize:12}}>Status: {tx.status}</p>{tx.status === 'PENDING' && <div style={{display:'flex', gap:8}}><button onClick={()=>handleWithdraw(tx.id, 'approve')} style={{background:'#00C853', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Approve</button><button onClick={()=>handleWithdraw(tx.id, 'reject')} style={{background:'red', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Reject</button></div>}</div>))}</div>)}

        {tab === 'notification' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={notifSearch} onChange={e => setNotifSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(notifSearch, setNotifUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{notifUser &&!showNotifInput && <button onClick={()=>setShowNotifInput(true)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send Notification to {notifUser.username}</button>}{showNotifInput && (<div><textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Message" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, height:80, color:'#000' }} /><button onClick={handleSendNotif} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send</button></div>)}</div>)}

        {tab === 'bonus' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={bonusSearch} onChange={e => setBonusSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(bonusSearch, setBonusUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{bonusUser &&!showBonusInput && <button onClick={()=>setShowBonusInput(true)} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Give Bonus to {bonusUser.username} - Current: ${bonusUser.specialBonus || 0}</button>}{showBonusInput && (<div><input value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} placeholder="Bonus Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleGiveBonus} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Bonus</button></div>)}</div>)}
      </div>
      <BottomNav />
      {editingPhoto && (<div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}><div style={{ background:'#222', padding:20, borderRadius:16, width:'90%', maxWidth:400 }}><h3 style={{color:'#FFF', marginBottom:12}}>Edit Task {editingPhoto.taskOrder}</h3><input value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})} placeholder="Name" style={{width:'100%', padding:12, marginBottom:10, borderRadius:8, border:'none', color:'#000'}}/><input value={editData.price} onChange={e=>setEditData({...editData, price:e.target.value})} placeholder="Price" type="number" style={{width:'100%', padding:12, marginBottom:16, borderRadius:8, border:'none', color:'#000'}}/><div style={{display:'flex', gap:8}}><button onClick={saveEdit} style={{flex:1, background:'#00C853', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF'}}>Save</button><button onClick={()=>setEditingPhoto(null)} style={{flex:1, background:'red', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF'}}>Cancel</button></div></div></div>)}
    </div>
  )
}