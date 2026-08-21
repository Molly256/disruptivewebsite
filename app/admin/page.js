'use client'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const vipList = [
  { id: 1, name: 'VIP1', price: 100, tasks: 40 }, // 40 per set
  { id: 2, name: 'VIP2', price: 500, tasks: 45 }, // 45 per set
  { id: 3, name: 'VIP3', price: 1600, tasks: 50 }, // 50 per set
  { id: 4, name: 'VIP4', price: 5500, tasks: 55 }, // 55 per set
  { id: 5, name: 'VIP5', price: 10000, tasks: 60 } // 60 per set
]

export default function AdminPage() {
  const [tab, setTab] = useState('upgrade')
  const [admin, setAdmin] = useState({}) // FIX: useState instead of direct localStorage

  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem('user') || '{}'))
  }, [])

  const [search, setSearch] = useState(''); const [foundUser, setFoundUser] = useState(null); const [showDropdown, setShowDropdown] = useState(false); const [selectedVip, setSelectedVip] = useState(null);
  const [resetSearch, setResetSearch] = useState(''); const [resetUser, setResetUser] = useState(null);
  const [passSearch, setPassSearch] = useState(''); const [passUser, setPassUser] = useState(null); const [showPassInput, setShowPassInput] = useState(false); const [newPass, setNewPass] = useState('');

  // EDIT TASKS STATES - replaced merge
  const [editSearch, setEditSearch] = useState(''); const [editUser, setEditUser] = useState(null);
  const [activeEditSet, setActiveEditSet] = useState(null);
  const [editSetData, setEditSetData] = useState([]); // holds data + photo
  const [selectedEditItems, setSelectedEditItems] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editData, setEditData] = useState({name:'', price:0})

  // NEW: MANAGE PROGRESS STATES
  const [manageSearch, setManageSearch] = useState(''); const [manageUser, setManageUser] = useState(null);

  const [depositSearch, setDepositSearch] = useState(''); const [depositUser, setDepositUser] = useState(null); const [depositAmount, setDepositAmount] = useState(''); const [showDepositInput, setShowDepositInput] = useState(false);
  const [withdrawList, setWithdrawList] = useState([]);
  const [notifSearch, setNotifSearch] = useState(''); const [notifUser, setNotifUser] = useState(null); const [showNotifInput, setShowNotifInput] = useState(false); const [notifMessage, setNotifMessage] = useState('');
  const [bonusSearch, setBonusSearch] = useState(''); const [bonusUser, setBonusUser] = useState(null); const [showBonusInput, setShowBonusInput] = useState(false); const [bonusAmount, setBonusAmount] = useState('');

  const TabBtn = ({ id, label }) => (
    <button onClick={()=>setTab(id)} style={{ background: tab===id? '#FF1493':'#F1F1F1', color: tab===id? '#FFF':'#000', border:'none', padding:'10px 16px', borderRadius:'12px', fontWeight:'800', fontSize:'14px', whiteSpace:'nowrap', flexShrink:0, cursor:'pointer' }}>{label}</button>
  )

  useEffect(() => { if(tab === 'withdraw') fetchWithdraws() }, [tab])
  const fetchWithdraws = async () => { const res = await fetch('/api/admin/withdraw/list'); const data = await res.json(); setWithdrawList(data.transactions || []) }

  const searchUser = async (q, setter, clearFn) => { // FIX: added clearFn
    if(!q) return alert('Enter username or phone')
    if(clearFn) clearFn() // FIX: clear old form when searching new user
    const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`) // FIX: encode
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

  // NEW: Load set for editing
  const loadEditSet = async (vipLevel, day, setNum) => {
    if(!editUser) return alert('No user selected')
    const vipData = vipList.find(v => v.id === vipLevel)
    if(!vipData) return alert(`VIP level ${vipLevel} not found`)

    try {
      const res = await fetch(`/api/admin/get-set-data?vipLevel=${vipLevel}&day=${day}&set=${setNum}&userId=${editUser.id}`)
      const data = await res.json()
      if(!res.ok) throw new Error(data.error)
      setEditSetData(data.items || [])
      setActiveEditSet(setNum)
    } catch(e) {
      alert(`Failed to load set: ${e.message}`)
    }
  }

  // NEW: Save edited data to database
  const handleSaveEditedData = async () => {
    if(selectedEditItems.length === 0) return alert('Select items to save')
    const vipLevel = editUser.vipLevel
    const day = editUser.currentDay || 1
    const setNum = activeEditSet

    const updatedItems = editSetData.filter(item => selectedEditItems.includes(item.taskOrder))

    const res = await fetch('/api/admin/save-set-data', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        vipLevel,
        day,
        setNum,
        data: updatedItems,
        adminId: admin.id,
        targetUserId: editUser.id // 💡 FIXED: Sends the exact user ID so the database knows who to update!
      })
    })

    if(res.ok) {
      alert('Data Saved successfully to Database!')
      setSelectedEditItems([])
      loadEditSet(vipLevel, day, setNum)
    } else {
      const err = await res.json()
      alert(`Save failed: ${err.error}`)
    }
  }

  const editItem = (item) => { setEditingPhoto(item); setEditData({name: item.name, price: item.price}) }

  const saveEdit = () => {
    setEditSetData(prev => prev.map(p => Number(p.taskOrder) === Number(editingPhoto.taskOrder)? {...p, name: editData.name, price: parseFloat(editData.price)} : p));
    setSelectedEditItems(prev => prev.includes(editingPhoto.taskOrder)? prev : [...prev, editingPhoto.taskOrder]);
    setEditingPhoto(null);
  }


  // NEW: MANAGE PROGRESS FUNCTIONS
const handleResetToNextSet = async () => {
  if(!manageUser) return alert('Search user first')
  if(manageUser.currentSet >= 3) return alert('Set 3 cannot be reset. Use Next Day')
  
  // 🎯 FIXED URL: Now points to your clean, flat renamed folder path!
  const res = await fetch('/api/admin/reset-set-progress', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId: manageUser.id, adminId: admin.id })
  })
  const data = await res.json()
  
  if(res.ok && data.user) { 
    setManageUser(data.user); 
    alert(`Moved to Set ${data.user.currentSet}`) 
  } else {
    alert(data.error || 'Failed')
  }
}

const handleNextDay = async () => {
  if(!manageUser) return alert('Search user first')
  if(manageUser.currentDay >= 5) return alert('Max Day 5 reached')
  
  // 🎯 VERIFIED URL: Matches your app/api/admin/next-day/progress/route.js folder structure exactly!
  const res = await fetch('/api/admin/next-day/progress', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId: manageUser.id, adminId: admin.id })
  })
  const data = await res.json()
  
  if(res.ok && data.user) {
    setManageUser(data.user);
    alert(`Moved to Day ${data.user.currentDay} Set 1`)
  } else {
    alert(data.error || 'Failed')
  }
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
          <TabBtn id='upgrade' label='Upgrade VIP' />
          <TabBtn id='resetset' label='Reset Set' />
          <TabBtn id='password' label='Reset Password' />
          <TabBtn id='manage' label='Manage Progress' /> {/* NEW */}
          <TabBtn id='edit' label='Edit Tasks' />
          <TabBtn id='deposit' label='Deposit' />
          <TabBtn id='withdraw' label='Withdraw' />
          <TabBtn id='notification' label='Notification' />
          <TabBtn id='bonus' label='Special Bonus' />
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
            {resetUser && (<div><p><b>{resetUser.username}</b> - Day {resetUser.currentDay || 1} Set {resetUser.currentSet || 1}</p>{[1,2,3].map(s=> <button key={s} onClick={()=>handleResetSet(s)} style={{ background:'red', color:'#FFF', border:'none', padding:'10px', borderRadius:'8px', marginRight:8, marginTop:8 }}>Reset to Set {s}</button>)}</div>)}
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={passSearch} onChange={e => setPassSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(passSearch, setPassUser, ()=>{setShowPassInput(false); setNewPass('')})} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>
            {passUser &&!showPassInput && <button onClick={()=>setShowPassInput(true)} style={{ background:'orange', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Reset Password for {passUser.username}</button>}
            {showPassInput && (<div><input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handlePassReset} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Reset</button></div>)}
          </div>
        )}

        {/* NEW MANAGE PROGRESS TAB */}
        {tab === 'manage' && (
          <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={manageSearch} onChange={e => setManageSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} />
              <button onClick={()=>searchUser(manageSearch, setManageUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button>
            </div>

            {manageUser && (
              <div>
                <h3 style={{marginBottom:12}}><b>{manageUser.username}</b></h3>
                <p>👑 VIP Level: <b>VIP{manageUser.vipLevel}</b></p>
                <p>💰 Balance: <b>${manageUser.walletBalance || 0}</b></p>
                <p>📅 Day: <b>{manageUser.currentDay || 1}/5</b></p>
                <p>📦 Set: <b>{manageUser.currentSet || 1}/3</b></p>
                <p>✅ Sets Today: <b>{manageUser.completedSetsToday || 0}/3</b></p> {/* ADDED */}
                <p>📊 Progress: <b>{manageUser.tasksInCurrentSet || 0}/{vipList.find(v=>v.id===manageUser.vipLevel)?.tasks || 40}</b></p>

                <div style={{display:'flex', gap:10, marginTop:20, flexWrap:'wrap'}}>
                  {/* RED RESET BUTTON */}
                  <button
                    disabled={manageUser.currentSet === 3}
                    onClick={handleResetToNextSet}
                    style={{
                      background: manageUser.currentSet === 3? '#555':'red',
                      color:'#FFF', border:'none', padding:'14px 20px', borderRadius:'12px',
                      fontWeight:800, cursor: manageUser.currentSet === 3? 'not-allowed':'pointer', flex:1
                    }}>
                    Reset to Next Set
                  </button>

                  {/* GREEN NEXT DAY BUTTON */}
                  <button
                    disabled={manageUser.currentDay === 5}
                    onClick={handleNextDay}
                    style={{
                      background: manageUser.currentDay === 5? '#555':'#00C853',
                      color:'#FFF', border:'none', padding:'14px 20px', borderRadius:'12px',
                      fontWeight:800, cursor: manageUser.currentDay === 5? 'not-allowed':'pointer', flex:1
                    }}>
                    Next Day
                  </button>
                </div>
                <p style={{fontSize:12, marginTop:10, color:'#aaa'}}>Note: Set 3 cannot be reset. Complete it then tap "Next Day"</p>
              </div>
            )}
          </div>
        )}

        {/* EDIT TASKS TAB */}
        {tab === 'edit' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input value={editSearch} onChange={e => setEditSearch(e.target.value)} placeholder="Username or Phone" style={{ flex: 1, padding: 14, border: '2px solid #FF1493', borderRadius: 12, color: '#000' }} />
              <button onClick={async () => {
                const q = editSearch.trim();
                if(!q) return alert('Enter search query');
                const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`);
                const data = await res.json();
                if(res.ok) { setEditUser(data.user); }
                else alert(data.error || 'User not found');
              }} style={{ background: '#FF1493', border: 'none', borderRadius: 12, padding: '0 18px', fontSize: 20, cursor: 'pointer' }}>🔍</button>
            </div>

            {editUser && (
              <div style={{ background: '#000', color: '#FFF', padding: 20, borderRadius: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 18, margin: '0 0 8px 0' }}><b>{editUser.username}</b></p>
                  <p>💰 Balance: <b>${editUser.walletBalance || 0}</b></p>
                  <p>👑 VIP Level: <b>VIP{editUser.vipLevel}</b></p>
                  <p>📅 Day: <b>{editUser.currentDay || 1}</b></p>
                  <p>📊 Progress: <b>{editUser.tasksInCurrentSet || 0}/{vipList.find(v=>v.id===editUser.vipLevel)?.tasks || 40}</b></p>
                </div>

                {[1,2,3].map(setNum => {
                  const currentSet = editUser.currentSet || 1
                  const isActive = setNum === currentSet
                  return (
                    <div key={setNum} style={{ marginTop: 16, border: '1px solid #333', borderRadius: 12, padding: 12, background: '#0a0a0a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 800, margin: 0 }}>
                          Set {setNum} {isActive && <span style={{ color: '#00C853', fontWeight: '900' }}>ACTIVE</span>}
                        </p>
                        <button onClick={() => loadEditSet(editUser.vipLevel, editUser.currentDay || 1, setNum)}
                          style={{ background: 'red', color: '#FFF', border: 'none', padding: '10px 14px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                          Edit Set
                        </button>
                      </div>

                      {activeEditSet === setNum && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, maxHeight: 400, overflowY: 'auto' }}>
                            {editSetData.map(item => {
                              const isSel = selectedEditItems.includes(item.taskOrder);
                              return (
                                <div key={item.taskOrder} style={{ width: 140, background: '#111', padding: 6, borderRadius: 8, border: isSel? '2px solid red' : '1px solid #333', position:'relative' }}>
                                  <div onClick={() => setSelectedEditItems(v => v.includes(item.taskOrder)? v.filter(x => x!== item.taskOrder) : [...v, item.taskOrder])}
                                    style={{ position: 'absolute', top:6, right:6, width: 22, height: 22, borderRadius: '50%', border: '2px solid #FFF', background: isSel? 'red' : 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex:2 }}>
                                    {isSel && <span style={{ color: '#FFF', fontSize: 12, fontWeight: 900 }}>✓</span>}
                                  </div>
                                  <img src={item.image} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} />
                                  <p style={{ fontSize: 11, margin: '4px 0', fontWeight: '800', color: '#00C853' }}>${parseFloat(item.price).toFixed(2)}</p>
                                  <p style={{ fontSize: 9, margin: 0, color: '#CCC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                  <button onClick={() => editItem(item)} style={{ width: '100%', marginTop: 4, background: '#FF1493', border: 'none', padding: 6, borderRadius: 6, color: '#FFF', fontSize: 11 }}>Edit Data</button>
                                </div>
                              )
                            })}
                          </div>

                          {selectedEditItems.length > 0 && (
                            <button onClick={handleSaveEditedData} style={{ background: '#00C853', color: '#FFF', border: 'none', padding: 14, borderRadius: 12, width: '100%', fontWeight: '800' }}>
                              💾 Save Data ({selectedEditItems.length} items)
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

        {tab === 'deposit' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(depositSearch, setDepositUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{depositUser &&!showDepositInput && <button onClick={()=>setShowDepositInput(true)} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Deposit to {depositUser.username} - Balance: ${depositUser.walletBalance}</button>}{showDepositInput && (<div><input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleDeposit} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Deposit</button></div>)}</div>)}

        {tab === 'withdraw' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>{withdrawList.length === 0 && <p>No pending withdrawals</p>}{withdrawList.map(tx => (<div key={tx.id} style={{ border:'1px solid #333', padding:12, borderRadius:8, marginBottom:8 }}><p><b>{tx.user?.username}</b> - ${tx.amount}</p><p style={{fontSize:12}}>Status: {tx.status}</p>{tx.status === 'PENDING' && <div style={{display:'flex', gap:8}}><button onClick={()=>handleWithdraw(tx.id, 'approve')} style={{background:'#00C853', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Approve</button><button onClick={()=>handleWithdraw(tx.id, 'reject')} style={{background:'red', border:'none', padding:8, borderRadius:6, color:'#FFF'}}>Reject</button></div>}</div>))}</div>)}

        {tab === 'notification' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={notifSearch} onChange={e => setNotifSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(notifSearch, setNotifUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{notifUser &&!showNotifInput && <button onClick={()=>setShowNotifInput(true)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send Notification to {notifUser.username}</button>}{showNotifInput && (<div><textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Message" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, height:80, color:'#000' }} /><button onClick={handleSendNotif} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send</button></div>)}</div>)}

        {tab === 'bonus' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={bonusSearch} onChange={e => setBonusSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(bonusSearch, setBonusUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{bonusUser &&!showBonusInput && <button onClick={()=>setShowBonusInput(true)} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Give Special Bonus to {bonusUser.username} - Current: ${bonusUser.specialBonus || 0}</button>}{showBonusInput && (<div><input value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} placeholder="Bonus Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleGiveBonus} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Special Bonus</button></div>)}</div>)}
      </div>
      <BottomNav />

      {editingPhoto && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ background:'#222', padding:20, borderRadius:16, width:'90%', maxWidth:400 }}>
            <h3 style={{color:'#FFF', marginBottom:12}}>Edit Task {editingPhoto.taskOrder}</h3>
            <img src={editingPhoto.image} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:8, marginBottom:10 }}/>
            <input value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})} placeholder="Name" style={{width:'100%', padding:12, marginBottom:10, borderRadius:8, border:'none', color:'#000'}}/>
            <input value={editData.price} onChange={e=>setEditData({...editData, price:e.target.value})} placeholder="Price" type="number" style={{width:'100%', padding:12, marginBottom:16, borderRadius:8, border:'none', color:'#000'}}/>
            <div style={{display:'flex', gap:8}}>
              <button onClick={saveEdit} style={{flex:1, background:'#00C853', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF'}}>Save</button>
              <button onClick={()=>setEditingPhoto(null)} style={{flex:1, background:'red', border:'none', padding:12, borderRadius:10, fontWeight:800, color:'#FFF'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}