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
    if(!mergeUser) return
    const vipLevel = mergeUser.vipLevel
    const taskCount = vipList.find(v=>v.id===vipLevel).tasks

    const photos = []
    for(let i=1; i<=taskCount; i++){ photos.push({ id: i, type: 'photos', taskOrder: i, url: `/vip${vipLevel}/set${setNum}/photo${i}.jpg`, name: `photo${i}.jpg` }) }

    let dataItems = []
    try {
      const dataModule = await import(`@/data/vip${vipLevel}Set${setNum}.js?update=${Date.now()}`)
      const data = dataModule.default || []
      dataItems = data.map((p, idx) => ({ id: idx + 1, type: 'data', taskOrder: idx+1, price: p.price, name: p.name }))
    } catch(e) {
      console.error("FAILED TO LOAD DATA FILE:", `/data/vip${vipLevel}Set${setNum}.js`, e)
      alert(`Data file not found: /data/vip${vipLevel}Set${setNum}.js`)
    }
    setMergePhotos([...photos,...dataItems])
  }

  const handleMerge = async () => {
    if(selectedPhotos.length === 0 || selectedPhotos.length!== selectedData.length) return alert('Select same number of Photos and Data')
    const pairs = selectedPhotos.map(taskOrder => ({ taskOrder }))
    const res = await fetch('/api/admin/merge-products', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: mergeUser.id, vipSet: selectedMergeSet, pairs, adminId: admin.id }) })
    if(res.ok) { alert('Merged. User tasks updated.'); setSelectedPhotos([]); setSelectedData([]); setActiveSet('') } else alert('Failed')
  }

  const editPrice = (photo) => {
    setEditingPhoto(photo)
    setEditData({name: photo.name, price: photo.price})
  }

  const saveEdit = async () => {
    const res = await fetch('/api/admin/merge-products', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ vipSet: selectedMergeSet, taskOrder: editingPhoto.taskOrder, newData: {name: editData.name, price: parseFloat(editData.price)} })
    })
    if(res.ok) {
      alert('Saved');
      setEditingPhoto(null);
      loadMergeSet(selectedMergeSet, selectedMergeSet.match(/set(\d)/)[1])
    } else alert('Failed')
  }

  const handleDeposit = async () => {
    if(!depositAmount) return alert('Enter amount')
    const res = await fetch('/api/admin/deposit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: depositUser.id, amount: parseFloat(depositAmount), adminId: admin.id }) })
    if(res.ok) {
      const data = await res.json()
      setDepositUser({...depositUser, walletBalance: data.newBalance})
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
      setBonusUser({...bonusUser, specialBonus: data.newBonus})
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
                  {showDropdown && (
                    <div style={{ position:'absolute', top:50, left:0, right:0, background:'#222', borderRadius:12, zIndex:10 }}>
                      {vipList.map(v=> <div key={v.id} onClick={()=>{setSelectedVip(v); setShowDropdown(false)}} style={{ padding:12, cursor:'pointer' }}>{v.name} - ${v.price}</div>)}
                    </div>
                  )}
                </div>
                <button onClick={handleUpgrade} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', width:'100%', fontWeight:'800', marginTop:12 }}>Upgrade</button>
              </div>
            )}
          </div>
        )}

        {/* 2. RESET SET */}
        {tab === 'resetset' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={resetSearch} onChange={e => setResetSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(resetSearch, setResetUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {resetUser && (
              <div>
                <p><b>{resetUser.username}</b> - Set {resetUser.setsCompleted + 1}</p>
                {[1,2,3].map(s=> <button key={s} onClick={()=>handleResetSet(s)} style={{ background:'red', color:'#FFF', border:'none', padding:'10px', borderRadius:'8px', marginRight:8, marginTop:8 }}>Reset to Set {s}</button>)}
              </div>
            )}
          </div>
        )}

        {/* 3. RESET PASSWORD */}
        {tab === 'password' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={passSearch} onChange={e => setPassSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(passSearch, setPassUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {passUser &&!showPassInput && <button onClick={()=>setShowPassInput(true)} style={{ background:'orange', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Reset Password for {passUser.username}</button>}
            {showPassInput && (
              <div>
                <input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} />
                <button onClick={handlePassReset} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Reset</button>
              </div>
            )}
          </div>
        )}

        {/* 4. MERGE TASKS */}
        {tab === 'merge' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={mergeSearch} onChange={e => setMergeSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={async ()=>{ const q = mergeSearch.trim(); if(!q) return alert('Enter username or phone'); const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`); const data = await res.json(); if(res.ok) setMergeUser(data.user); else alert(data.error || 'User not found') }} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>

            {mergeUser && (
              <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
                <p><b>{mergeUser.username}</b> - VIP{mergeUser.vipLevel}</p>
                <p style={{fontSize:12, color:'#AAA'}}>Progress: {mergeUser.taskCompleted}/{mergeUser.totalTasks} | Active Set: {mergeUser.setsCompleted + 1}</p>

                {[1,2].map(setNum => {
                  const activeSetNumber = mergeUser.setsCompleted + 1
                  const isCurrentSet = activeSetNumber === setNum
                  return (
                    <div key={setNum} style={{ marginTop:'16px', border:'1px solid #333', borderRadius:12, padding:12 }}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p style={{fontWeight:800}}>Set {setNum} {isCurrentSet && <span style={{color:'red', marginLeft:4}}>● ACTIVE</span>}</p>
                        <button
                          onClick={async ()=>{
                            setSelectedMergeSet(`vip${mergeUser.vipLevel}set${setNum}`)
                            setActiveSet(setNum)
                            setMergeView('photos')
                            setSelectedPhotos([])
                            setSelectedData([])
                            await loadMergeSet(`vip${mergeUser.vipLevel}set${setNum}`, setNum)
                          }}
                          style={{ background:'#FF0000', color:'#FFF', border:'none', padding:'10px 14px', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}
                        >Merge Tasks</button>
                      </div>

                      {activeSet === setNum && (
                        <div style={{ marginTop:'12px' }}>
                          <div style={{display:'flex', gap:8, marginBottom:12}}>
                            <button onClick={()=>setMergeView('photos')} style={{flex:1, background: mergeView==='photos'? '#FF1493':'#333', border:'none', padding:10, borderRadius:8, color:'#FFF', fontWeight:700}}>Photos</button>
                            <button onClick={()=>setMergeView('data')} style={{flex:1, background: mergeView==='data'? '#FF1493':'#333', border:'none', padding:10, borderRadius:8, color:'#FFF', fontWeight:700}}>Data</button>
                          </div>

                          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px', maxHeight:'400px', overflowY:'auto' }}>
                            {mergePhotos.filter(p => p.type === mergeView).sort((a,b)=>a.taskOrder-b.taskOrder).map(p=>{
                              const isSelected = mergeView === 'photos'? selectedPhotos.includes(p.taskOrder) : selectedData.includes(p.taskOrder)
                              return (
                              <div key={p.taskOrder} style={{ width:110, background:'#111', padding:6, borderRadius:8, position:'relative' }}>
                                <div onClick={()=>{ if(mergeView === 'photos'){ setSelectedPhotos(prev=> prev.includes(p.taskOrder)? prev.filter(x=>x!==p.taskOrder): [...prev,p.taskOrder]) } else { setSelectedData(prev=> prev.includes(p.taskOrder)? prev.filter(x=>x!==p.taskOrder): [...prev,p.taskOrder]) } }} style={{ position:'absolute', top:6, right:6, width:20, height:20, borderRadius:'50%', border:'2px solid #FFF', background: isSelected? '#FF0000' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2, cursor:'pointer' }}>
                                  {isSelected && <span style={{color:'#FFF', fontSize:12, fontWeight:900}}>✓</span>}
                                </div>

                                {mergeView === 'photos'? (
                                  <><img src={p.url} onError={(e)=>e.target.style.display='none'} style={{ width:'100%', height:90, objectFit:'cover', borderRadius:'8px' }} /><p style={{fontSize:9, margin:'4px 0', textAlign:'center'}}>{p.name}</p></>
                                ) : (
                                  <><div style={{ width:'100%', height:90, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#222', borderRadius:'8px', padding:4 }}><p style={{fontSize:10, margin:0}}>${p.price}</p><p style={{fontSize:9, margin:2, textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', width:'100%'}}>{p.name}</p></div><button onClick={()=>editPrice(p)} style={{fontSize:10, background:'#FF1493', border:'none', borderRadius:6, padding:'4px 0', width:'100%', color:'#FFF', marginTop:4, cursor:'pointer'}}>Edit</button></>
                                )}
                                <p style={{fontSize:10, margin:'4px 0', textAlign:'center'}}>Task {p.taskOrder}</p>
                              </div>
                              )
                            })}
                          </div>

                          {(selectedPhotos.length > 0 || selectedData.length > 0) && (
                            <button onClick={handleMerge} disabled={selectedPhotos.length!== selectedData.length || selectedPhotos.length === 0} style={{ background: selectedPhotos.length === selectedData.length && selectedPhotos.length > 0? '#00C853' : '#555', color:'#FFF', border:'none', padding:'14px', borderRadius:'12px', width:'100%', fontWeight:'800', cursor:'pointer' }}>
                              Merge Selected ({selectedPhotos.length} Photos + {selectedData.length} Data)
                            </button>
                          )}
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
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(depositSearch, setDepositUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {depositUser &&!showDepositInput && <button onClick={()=>setShowDepositInput(true)} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Deposit to {depositUser.username} - Balance: ${depositUser.walletBalance}</button>}
            {showDepositInput && (
              <div>
                <input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} />
                <button onClick={handleDeposit} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Deposit</button>
              </div>
            )}
          </div>
        )}

        {/* 6. WITHDRAW */}
        {tab === 'withdraw' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            {withdrawList.length === 0 && <p>No pending withdrawals</p>}
            {withdrawList.map(tx => (
              <div key={tx.id} style={{ border:'1px solid #333', padding:12, borderRadius:8, marginBottom:8 }}>
                <p><b>{tx.user?.username}</b> - ${tx.amount}</p>
                <p style={{fontSize:12}}>Status: {tx.status}</p>
                {tx.status === 'PENDING' && <div style={{display:'flex', gap:8}}><button onClick={()=>handleWithdraw(tx.id, 'approve')} style={{background:'#00C853', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Approve</button><button onClick={()=>handleWithdraw(tx.id, 'reject')} style={{background:'red', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Reject</button></div>}
              </div>
            ))}
          </div>
        )}

        {/* 7. NOTIFICATION */}
        {tab === 'notification' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={notifSearch} onChange={e => setNotifSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(notifSearch, setNotifUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {notifUser &&!showNotifInput && <button onClick={()=>setShowNotifInput(true)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send Notification to {notifUser.username}</button>}
            {showNotifInput && (
              <div>
                <textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Message" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, height:80, color:'#000' }} />
                <button onClick={handleSendNotif} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send</button>
              </div>
            )}
          </div>
        )}

        {/* 8. LUCKY BONUS */}
        {tab === 'bonus' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={bonusSearch} onChange={e => setBonusSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(bonusSearch, setBonusUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {bonusUser &&!showBonusInput && <button onClick={()=>setShowBonusInput(true)} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Give Bonus to {bonusUser.username} - Current: ${bonusUser.specialBonus || 0}</button>}
            {showBonusInput && (
              <div>
                <input value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} placeholder="Bonus Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} />
                <button onClick={handleGiveBonus} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Bonus</button>
              </div>
            )}
          </div>
        )}

      </div>
      <BottomNav />

      {/* EDIT POPUP */}
      {editingPhoto && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ background:'#222', padding:20, borderRadius:16, width:'90%', maxWidth:400 }}>
            <h3 style={{color:'#FFF', marginBottom:12}}>Edit Task {editingPhoto.taskOrder}</h3>
            <input value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})} placeholder="Name" style={{width:'100%', padding:12, marginBottom:10, borderRadius:8, border:'none', color:'#000'}}/>
            <input value={editData.price} onChange={e=>setEditData({...editData, price:e.target.value})} placeholder="Price" type="number" style={{width:'100%', padding:12, marginBottom:16, borderRadius:8, border:'none', color:'#000'}}/>
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