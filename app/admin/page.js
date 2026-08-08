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

  // MERGE STATES - UPDATED
  const [mergeSearch, setMergeSearch] = useState(''); const [mergeUser, setMergeUser] = useState(null); const [selectedMergeSet, setSelectedMergeSet] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]); const [selectedData, setSelectedData] = useState([]); const [mergePhotos, setMergePhotos] = useState([]);
  const [mergeView, setMergeView] = useState('photos'); const [activeSet, setActiveSet] = useState('');

  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editData, setEditData] = useState({title:'', price:0})
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

  const loadMergePhotos = async (vipSet) => {
    const res = await fetch(`/api/admin/merge-products/list?vipSet=${vipSet}`)
    const data = await res.json()
    setMergePhotos(data.photos || [])
    setSelectedPhotos([])
    setSelectedData([])
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

  // MERGE FUNCTION - UPDATED
  const handleMerge = async () => {
    if(selectedPhotos.length === 0 || selectedPhotos.length!== selectedData.length) return alert('Select same number of Photos and Data in order')
    const pairs = selectedPhotos.map((photoId, i) => ({ photoId, dataId: selectedData[i], taskOrder: i+1 }))
    const res = await fetch('/api/admin/merge-products', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: mergeUser.id, vipSet: selectedMergeSet, pairs, adminId: admin.id }) })
    if(res.ok) { alert('Merged. User tasks updated.'); setSelectedPhotos([]); setSelectedData([]); setActiveSet('') } else alert('Failed')
  }

  const editPrice = (photo) => {
    setEditingPhoto(photo)
    setEditData({title: photo.title, price: photo.price})
  }

  const saveEdit = async () => {
    const res = await fetch('/api/admin/merge-products/edit', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ vipSet: selectedMergeSet, imageId: editingPhoto.id, newData: {title: editData.title, price: parseFloat(editData.price)} })
    })
    if(res.ok) {
      alert('Saved');
      setEditingPhoto(null);
      loadMergePhotos(selectedMergeSet)
    } else alert('Failed')
  }

  const handleDeposit = async () => {
    if(!depositAmount) return alert('Enter amount')
    const res = await fetch('/api/admin/deposit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: depositUser.id, amount: parseFloat(depositAmount), adminId: admin.id }) })
    if(res.ok) {
      const data = await res.json()
      setDepositUser({...depositUser, walletBalance: data.newBalance}) // REFRESH
      alert('Deposited');
      setShowDepositInput(false);
      setDepositAmount('')
    } else alert('Failed')
  }

  const handleWithdraw = async (txId, action) => {
    const res = await fetch(`/api/admin/withdraw/${action}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ txId, adminId: admin.id }) })
    if(res.ok) { alert(`${action} success`); fetchWithdraws() } else alert('Failed')
  }

  const handleSendNotif = async () => {
    if(!notifMessage) return alert('Enter message')
    const res = await fetch('/api/admin/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: notifUser.id, message: notifMessage, adminId: admin.id }) })
    if(res.ok) { alert('Notification Sent'); setNotifMessage(''); setShowNotifInput(false) } else alert('Failed')
  }

  const handleGiveBonus = async () => {
    if(!bonusAmount) return alert('Enter amount')
    const res = await fetch('/api/admin/give-bonus', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: bonusUser.id, amount: parseFloat(bonusAmount), adminId: admin.id }) })
    if(res.ok) {
      const data = await res.json()
      setBonusUser({...bonusUser, specialBonus: data.newBonus}) // REFRESH
      alert('Bonus Given');
      setShowBonusInput(false);
      setBonusAmount('')
    } else alert('Failed')
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '90px', paddingBottom: '90px' }}>
      <AppHeader />
      <div style={{ padding: '0 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', marginBottom: '16px' }}>👑 Admin Panel</h1>
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' }}>
          <TabBtn id='upgrade' label='Upgrade VIP' /><TabBtn id='resetset' label='Reset Set' /><TabBtn id='password' label='Reset Password' /><TabBtn id='merge' label='Merge Tasks' />
          <TabBtn id='deposit' label='Deposit' /><TabBtn id='withdraw' label='Withdraw' /><TabBtn id='notification' label='Notification' /><TabBtn id='bonus' label='Lucky Bonus' />
        </div>

        {/* 1. UPGRADE VIP */}
        {tab === 'upgrade' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(search, setFoundUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {foundUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{foundUser.username}</b></p><p>{foundUser.phone}</p><p>Balance: ${foundUser.walletBalance}</p><div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' }}><p>VIP Level: <span style={{color:'#FF1493', fontWeight:'700'}}>VIP{foundUser.vipLevel}</span></p><button onClick={() => setShowDropdown(!showDropdown)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Upgrade</button></div><p>Set: {foundUser.setsCompleted} | Tasks: {foundUser.taskCompleted}/{foundUser.totalTasks}</p>{showDropdown && (<div style={{ background:'#222', padding:'12px', marginTop:'12px', borderRadius:'12px' }}>{vipList.filter(v => v.id > 1).map(vip => (<div key={vip.id} onClick={() => setSelectedVip(vip)} style={{ padding:'12px', cursor:'pointer', background: selectedVip?.id === vip.id? '#FF1493' : 'transparent', borderRadius:'8px', marginBottom:'4px' }}>{vip.name} - ${vip.price} - {vip.tasks} Tasks</div>))}{selectedVip && <button onClick={handleUpgrade} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', marginTop:'10px', fontWeight:'800', cursor:'pointer' }}>Confirm Upgrade</button>}</div>)}</div>)}
          </div>
        )}

        {/* 2. RESET SET */}
        {tab === 'resetset' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={resetSearch} onChange={e => setResetSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(resetSearch, setResetUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {resetUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{resetUser.username}</b></p><p>VIP{resetUser.vipLevel} Set {resetUser.setsCompleted}</p><p>Tasks: {resetUser.taskCompleted}/{resetUser.totalTasks}</p><button onClick={()=>handleResetSet(resetUser.setsCompleted === 1? 2 : 1)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', width:'100%', cursor:'pointer' }}>Reset to Set {resetUser.setsCompleted === 1? 2 : 1}</button></div>)}
          </div>
        )}

        {/* 3. RESET PASSWORD */}
        {tab === 'password' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={passSearch} onChange={e => setPassSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(passSearch, setPassUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {passUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{passUser.username}</b></p><p>{passUser.phone}</p><div style={{ display:'flex', justifyContent:'space-between' }}><p>Password: *******</p><button onClick={()=>setShowPassInput(true)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Reset Password</button></div>{showPassInput && (<div style={{ marginTop:'12px' }}><input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New Password" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px' }} /><button onClick={handlePassReset} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800', cursor:'pointer' }}>Confirm</button></div>)}</div>)}
          </div>
        )}

        {/* 4. MERGE TASKS - FULLY UPDATED */}
        {tab === 'merge' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={mergeSearch} onChange={e => setMergeSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(mergeSearch, setMergeUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {mergeUser && (
              <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
                <p><b>{mergeUser.username}</b> - VIP{mergeUser.vipLevel}</p>
                <p style={{fontSize:12, color:'#AAA'}}>Progress: {mergeUser.taskCompleted}/{mergeUser.totalTasks}</p>

                {[1,2].map(setNum => {
                  const setId = `vip${mergeUser.vipLevel}set${setNum}`
                  const isCurrentSet = mergeUser.currentSet === setNum
                  return (
                    <div key={setNum} style={{ marginTop:'16px', border:'1px solid #333', borderRadius:12, padding:12 }}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p style={{fontWeight:800}}>Set {setNum} {isCurrentSet && <span style={{color:'red', marginLeft:4}}>●</span>}</p>
                        <button onClick={()=>{setSelectedMergeSet(setId); setActiveSet(setId); setMergeView('photos'); loadMergePhotos(setId)}} style={{ background:'#FF0000', color:'#000', border:'none', padding:'10px 14px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Merge Tasks</button>
                      </div>

                      {activeSet === setId && (
                        <div style={{ marginTop:'12px' }}>
                          <div style={{display:'flex', gap:8, marginBottom:12}}>
                            <button onClick={()=>setMergeView('photos')} style={{flex:1, background: mergeView==='photos'? '#FF1493':'#333', border:'none', padding:10, borderRadius:8, color:'#FFF', fontWeight:700}}>Photos</button>
                            <button onClick={()=>setMergeView('data')} style={{flex:1, background: mergeView==='data'? '#FF1493':'#333', border:'none', padding:10, borderRadius:8, color:'#FFF', fontWeight:700}}>Data</button>
                          </div>
                          <p style={{fontSize:12, marginBottom:8}}>Select in order: 1,2,3... {mergeView === 'photos'? 'Photos' : 'Data'}</p>

                          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px', maxHeight:'400px', overflowY:'auto' }}>
                            {mergePhotos.filter(p => p.type === mergeView).sort((a,b)=>a.taskOrder-b.taskOrder).map(p=>(
                              <div key={p.id} style={{ width:110, background:'#111', padding:6, borderRadius:8 }}>
                                {mergeView === 'photos'? (
                                  <img src={p.url} onClick={()=>setSelectedPhotos(prev=> prev.includes(p.id)? prev.filter(x=>x!==p.id): [...prev,p.id])} style={{ width:'100%', height:90, objectFit:'cover', border:'3px solid', borderColor:selectedPhotos.includes(p.id)?'#00C853':'#555', borderRadius:'8px', cursor:'pointer' }} />
                                ) : (
                                  <div onClick={()=>setSelectedData(prev=> prev.includes(p.id)? prev.filter(x=>x!==p.id): [...prev,p.id])} style={{ width:'100%', height:90, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:'3px solid', borderColor:selectedData.includes(p.id)?'#00C853':'#555', borderRadius:'8px', cursor:'pointer', background:'#222' }}>
                                    <p style={{fontSize:10}}>${p.price}</p>
                                  </div>
                                )}
                                <p style={{fontSize:10, margin:'4px 0'}}>Task {p.taskOrder}</p>
                                <p style={{fontSize:9, margin:'2px 0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.title || 'No title'}</p>
                                <button onClick={()=>editPrice(p)} style={{fontSize:10, background:'#FF1493', border:'none', borderRadius:6, padding:'4px 0', width:'100%', color:'#FFF', cursor:'pointer'}}>Edit</button>
                              </div>
                            ))}
                          </div>
                          <button onClick={handleMerge} disabled={selectedPhotos.length!== selectedData.length} style={{ background: selectedPhotos.length === selectedData.length && selectedPhotos.length > 0? '#00C853' : '#555', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', width:'100%', fontWeight:'800', cursor:'pointer' }}>
                            Merge {selectedPhotos.length} Tasks
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. DEPOSIT */}
        {tab === 'deposit' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(depositSearch, setDepositUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {depositUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{depositUser.username}</b></p><p>Balance: ${depositUser.walletBalance}</p><div style={{ display:'flex', justifyContent:'space-between' }}><p>Deposit: $0</p><button onClick={()=>setShowDepositInput(true)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Deposit</button></div>{showDepositInput && (<div style={{ marginTop:'12px' }}><input value={depositAmount} onChange={e=>setDepositAmount(e.target.value)} placeholder="Amount USD" type="number" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px' }} /><button onClick={handleDeposit} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800', cursor:'pointer' }}>Confirm Deposit</button></div>)}</div>)}
          </div>
        )}

        {/* 6. WITHDRAW */}
        {tab === 'withdraw' && (
          <div>
            {withdrawList.length === 0 && <p style={{textAlign:'center', color:'#999'}}>No pending withdrawals</p>}
            {withdrawList.map(tx => (<div key={tx.id} style={{ background:'#000', color:'#FFF', padding:'16px', borderRadius:'16px', marginBottom:'12px' }}><p><b>{tx.user?.username}</b></p><p>{tx.user?.phone}</p><p>Withdraw Account: {tx.account}</p><p>Amount: ${tx.amount} USD</p><p style={{ fontSize:'12px', color:'#AAA' }}>{new Date(tx.createdAt).toLocaleString('en-US', {timeZone: 'America/New_York'})}</p><p style={{ color: tx.status==='pending'? 'red':'#00C853', fontWeight:'700' }}>{tx.status}</p>{tx.status==='pending' && (<div style={{ display:'flex', gap:'8px', marginTop:'8px' }}><button onClick={()=>handleWithdraw(tx.id, 'confirm')} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'10px', borderRadius:'10px', flex:1, fontWeight:'800', cursor:'pointer' }}>Confirm</button><button onClick={()=>handleWithdraw(tx.id, 'reject')} style={{ background:'red', color:'#FFF', border:'none', padding:'10px', borderRadius:'10px', flex:1, fontWeight:'800', cursor:'pointer' }}>Reject</button></div>)}</div>))}
          </div>
        )}

        {/* 7. NOTIFICATION */}
        {tab === 'notification' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={notifSearch} onChange={e => setNotifSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(notifSearch, setNotifUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {notifUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{notifUser.username}</b></p><div style={{ display:'flex', justifyContent:'space-between' }}><p>Notification</p><button onClick={()=>setShowNotifInput(true)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Type</button></div>{showNotifInput && (<div style={{ marginTop:'12px' }}><textarea value={notifMessage} onChange={e=>setNotifMessage(e.target.value)} placeholder="Type message with emoji 😀" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px', minHeight:'80px' }} /><button onClick={handleSendNotif} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800', cursor:'pointer' }}>Send</button></div>)}</div>)}
          </div>
        )}

        {/* 8. LUCKY BONUS */}
        {tab === 'bonus' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={bonusSearch} onChange={e => setBonusSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none' }} /><button onClick={()=>searchUser(bonusSearch, setBonusUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>
            {bonusUser && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><p><b>{bonusUser.username}</b></p><p>Special Bonus: ${bonusUser.specialBonus || 0}</p><button onClick={()=>setShowBonusInput(true)} style={{ background:'#FF0000', color:'#000', border:'none', padding:'14px', borderRadius:'12px', fontWeight:'700', width:'100%', cursor:'pointer' }}>Give Bonus</button>{showBonusInput && (<div style={{ marginTop:'12px' }}><input value={bonusAmount} onChange={e=>setBonusAmount(e.target.value)} placeholder="Amount USD" type="number" style={{ width:'100%', padding:'12px', borderRadius:'10px', marginBottom:'8px' }} /><button onClick={handleGiveBonus} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'10px', width:'100%', fontWeight:'800', cursor:'pointer' }}>Confirm</button></div>)}</div>)}
          </div>
        )}

      </div>
      <BottomNav />

      {/* EDIT POPUP */}
      {editingPhoto && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ background:'#222', padding:20, borderRadius:16, width:'90%', maxWidth:400 }}>
            <h3 style={{color:'#FFF', marginBottom:12}}>Edit {editingPhoto.id}</h3>
            <input value={editData.title} onChange={e=>setEditData({...editData, title:e.target.value})} placeholder="Title" style={{width:'100%', padding:12, marginBottom:10, borderRadius:8, border:'none'}}/>
            <input value={editData.price} onChange={e=>setEditData({...editData, price:e.target.value})} placeholder="Price" type="number" style={{width:'100%', padding:12, marginBottom:16, borderRadius:8, border:'none'}}/>
            <div style={{display:'flex', gap:8}}>
              <button onClick={saveEdit} style={{flex:1, background:'#00C853', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF', cursor:'pointer'}}>Save</button>
              <button onClick={()=>setEditingPhoto(null)} style={{flex:1, background:'red', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF', cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}