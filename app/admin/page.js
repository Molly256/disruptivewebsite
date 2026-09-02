'use client'
import { useState, useEffect } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import AdminChatModal from '@/components/AdminChatModal'

const vipList = [
  { id: 1, name: 'VIP1', price: 100, tasks: 40 },
  { id: 2, name: 'VIP2', price: 500, tasks: 45 },
  { id: 3, name: 'VIP3', price: 1600, tasks: 50 },
  { id: 4, name: 'VIP4', price: 5500, tasks: 55 },
  { id: 5, name: 'VIP5', price: 10000, tasks: 60 }
]

export default function AdminPage() {
  const [tab, setTab] = useState('upgrade')
  const [admin, setAdmin] = useState({})
  const [notifPermission, setNotifPermission] = useState('default')
  const [chatOpen, setChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const LOGO = '/logo-512.png'

  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem('user') || '{}'))
    if (typeof window!== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(()=>{})
      }
    }
    // poll unread for PWA badge even when modal closed
    const fetchUnread = async () => {
      try{
        const res = await fetch('/api/chat/list', { cache: 'no-store' })
        const data = await res.json()
        const list = Array.isArray(data)? data : (data.conversations || [])
        const total = list.reduce((s,c)=>s+(c.unreadAdmin||0),0)
        setUnreadCount(total)
        if ('setAppBadge' in navigator && total>0) {
          navigator.setAppBadge(total).catch(()=>{})
        }
      }catch{}
    }
    fetchUnread()
    const i = setInterval(fetchUnread, 3000)
    return ()=>clearInterval(i)
  }, [])

  const enableNotifications = async () => {
    if (!('Notification' in window)) return alert('Notifications not supported')
    const perm = await Notification.requestPermission()
    setNotifPermission(perm)
    if (perm === 'granted') {
      new Notification('Admin256 Chat', { body: 'Notifications enabled! You will get alerts.', icon: LOGO, badge: LOGO })

      // subscribe to push for background
      try{
        const reg = await navigator.serviceWorker.ready
        let sub = await reg.pushManager.getSubscription()
        if(!sub){
          const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          if(key){
            const urlBase64ToUint8Array = (base64String) => {
              const padding = '='.repeat((4 - base64String.length % 4) % 4)
              const base64 = (base64String + padding).replace(/-/g,'+').replace(/_/g,'/')
              const rawData = window.atob(base64)
              const outputArray = new Uint8Array(rawData.length)
              for(let i=0;i<rawData.length;++i) outputArray[i]=rawData.charCodeAt(i)
              return outputArray
            }
            sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) })
          }
        }
        if(sub){
          const adminId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user')||'{}').id || 'Admin256'
          await fetch('/api/admin/push/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminId, sub: sub.toJSON()})})
        }
      }catch(e){ console.log(e) }

      alert('✅ Notifications enabled! Install PWA to get them in background.')
    } else {
      alert('❌ Permission denied')
    }
  }

  const [search, setSearch] = useState(''); const [foundUser, setFoundUser] = useState(null); const [showDropdown, setShowDropdown] = useState(false); const [selectedVip, setSelectedVip] = useState(null);
  const [resetSearch, setResetSearch] = useState(''); const [resetUser, setResetUser] = useState(null);
  const [passSearch, setPassSearch] = useState(''); const [passUser, setPassUser] = useState(null); const [showPassInput, setShowPassInput] = useState(false); const [newPass, setNewPass] = useState('');

  const [editSearch, setEditSearch] = useState(''); const [editUser, setEditUser] = useState(null);
  const [activeEditSet, setActiveEditSet] = useState(null);
  const [editSetData, setEditSetData] = useState([]);
  const [selectedEditItems, setSelectedEditItems] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editData, setEditData] = useState({name:'', price:0})

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

  const searchUser = async (q, setter, clearFn) => {
    if(!q) return alert('Enter username or phone')
    if(clearFn) clearFn()
    const res = await fetch(`/api/user/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    if(data.error) return alert(data.error)
    setter(data.user)
  }

  const loadEditSet = async (vipLevel, day, setNum) => {
    try {
      setActiveEditSet(setNum)
      setEditSetData([])
      setSelectedEditItems([])
      const res = await fetch(`/api/admin/tasks/get-set?userId=${editUser.id}&vipLevel=${vipLevel}&day=${day}&set=${setNum}`)
      const data = await res.json()
      if (res.ok) {
        setEditSetData(data.tasks || [])
      } else {
        alert(data.error || 'Failed to load set')
      }
    } catch (e) {
      alert('Load failed: ' + e.message)
    }
  }

  const editItem = (item) => {
    setEditingPhoto(item)
    setEditData({ name: item.name || '', price: item.price || 0 })
  }

  const saveEdit = () => {
    if (!editingPhoto) return
    setEditSetData(prev => prev.map(p =>
      Number(p.taskOrder) === Number(editingPhoto.taskOrder)
     ? {...p, name: editData.name, price: parseFloat(editData.price) || 0 }
        : p
    ))
    if (!selectedEditItems.includes(Number(editingPhoto.taskOrder))) {
      setSelectedEditItems(prev => [...prev, Number(editingPhoto.taskOrder)])
    }
    setEditingPhoto(null)
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
    try {
      const res = await fetch('/api/admin/reset-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: passUser.id, newPassword: newPass }) })
      const data = await res.json()
      if(res.ok) { alert('Password Reset DONE for ' + passUser.username); setShowPassInput(false); setNewPass('') } else alert('FAILED: ' + (data.error || JSON.stringify(data)))
    } catch (err) { alert('Fetch error: ' + err.message) }
  }

  const handleSaveEditedData = async () => {
    if(!editUser) return alert('No user selected')
    if(editSetData.length === 0) return alert('No task items loaded')
    if(selectedEditItems.length === 0) return alert('No items selected')
    try {
      for(const taskOrder of selectedEditItems) {
        const item = editSetData.find(p => Number(p.taskOrder) === Number(taskOrder))
        if(!item) continue
        const res = await fetch('/api/admin/tasks/edit-user-task', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            userId: editUser.id,
            taskOrder: Number(taskOrder),
            newPrice: Number(item.price || 0),
            newName: item.name || '',
            vipLevel: editUser.vipLevel,
            day: editUser.currentDay || 1,
            setNumber: activeEditSet
          })
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.error || 'Save failed')
      }
      alert(`Saved for ${editUser.username} only!`)
      setSelectedEditItems([])
      const refreshRes = await fetch(`/api/user/search?q=${encodeURIComponent(editUser.username)}`)
      const refreshData = await refreshRes.json()
      if(refreshRes.ok) setEditUser(refreshData.user)
    } catch(e) { alert(`Save failed: ${e.message}`) }
  }

  const handleResetToNextSet = async () => {
    if(!manageUser) return alert('Search user first')
    if(manageUser.currentSet >= 3) return alert('Set 3 cannot be reset. Use Next Day')
    const res = await fetch('/api/admin/reset-set-progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: manageUser.id, adminId: admin.id }) })
    const data = await res.json()
    if(res.ok && data.user) { setManageUser(data.user); alert(`Moved to Set ${data.user.currentSet}`) } else alert(data.error || 'Failed')
  }

  const handleNextDay = async () => {
    if(!manageUser) return alert('Search user first')
    if(manageUser.currentDay >= 5) return alert('Max Day 5 reached')
    const res = await fetch('/api/admin/next-day/progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: manageUser.id, adminId: admin.id }) })
    const data = await res.json()
    if(res.ok && data.user) { setManageUser(data.user); alert(`Moved to Day ${data.user.currentDay} Set 1`) } else alert(data.error || 'Failed')
  }

  const handleDeposit = async () => { if(!depositAmount) return alert('Enter amount'); const res = await fetch('/api/admin/deposit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: depositUser.id, amount: parseFloat(depositAmount), adminId: admin.id }) }); if(res.ok) { const data = await res.json(); setDepositUser({...depositUser, walletBalance: data.newBalance}); alert('Deposited'); setShowDepositInput(false); setDepositAmount('') } else alert('Failed') }
  const handleWithdraw = async (txId, action) => {
    try {
      const res = await fetch(`/api/admin/withdraw/${action}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ txId, adminId: admin.id }) });
      const data = await res.json();
      if(res.ok) { alert(`${action} success`); fetchWithdraws() } else alert(`Failed: ${data.error || JSON.stringify(data)}`)
    } catch(e) { alert(`Failed: ${e.message}`) }
  }
  const handleSendNotif = async () => { if(!notifMessage) return alert('Enter message'); const res = await fetch('/api/admin/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: notifUser.id, message: notifMessage, adminId: admin.id }) }); if(res.ok) { alert('Notification Sent'); setNotifMessage(''); setShowNotifInput(false) } else alert('Failed') }
  const handleGiveBonus = async () => { if(!bonusAmount) return alert('Enter amount'); const res = await fetch('/api/admin/give-bonus', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: bonusUser.id, amount: parseFloat(bonusAmount), adminId: admin.id }) }); if(res.ok) { const data = await res.json(); setBonusUser({...bonusUser, specialBonus: data.newBonus}); alert('Bonus Given'); setShowBonusInput(false); setBonusAmount('') } else alert('Failed') }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '90px', paddingBottom: '90px' }}>
      <AppHeader />
      <div style={{ padding: '0 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>👑 Admin Panel</h1>

        <div style={{ background: notifPermission === 'granted'? '#00a884' : '#111b21', padding: '12px', borderRadius: '12px', marginBottom: '16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color:'#FFF', fontWeight:700, fontSize:13 }}>🔔 {notifPermission === 'granted'? `Notifications ON ${unreadCount>0?`(${unreadCount} unread)`:''}` : 'Enable Notifications'}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>setChatOpen(true)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'6px 12px', borderRadius:8, fontWeight:800, cursor:'pointer', position:'relative' }}>
              💬 Chat {unreadCount>0 && <span style={{background:'#FFF',color:'#FF1493',padding:'1px 6px',borderRadius:10,marginLeft:4}}>{unreadCount}</span>}
            </button>
            {notifPermission!== 'granted' && <button onClick={enableNotifications} style={{ background:'#FFF', color:'#111b21', border:'none', padding:'6px 12px', borderRadius:8, fontWeight:800, cursor:'pointer' }}>Enable</button>}
          </div>
        </div>

        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' }}>
          <TabBtn id='upgrade' label='Upgrade VIP' />
          <TabBtn id='resetset' label='Reset Set' />
          <TabBtn id='password' label='Reset Password' />
          <TabBtn id='manage' label='Manage Progress' />
          <TabBtn id='edit' label='Edit Tasks' />
          <TabBtn id='deposit' label='Deposit' />
          <TabBtn id='withdraw' label='Withdraw' />
          <TabBtn id='notification' label='Notification' />
          <TabBtn id='bonus' label='Special Bonus' />
        </div>

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
                        <p style={{ fontWeight: 800, margin: 0 }}>Set {setNum} {isActive && <span style={{ color: '#00C853', fontWeight: '900' }}>ACTIVE</span>}</p>
                        <button onClick={() => loadEditSet(editUser.vipLevel, editUser.currentDay || 1, setNum)} style={{ background: 'red', color: '#FFF', border: 'none', padding: '10px 14px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Edit Set</button>
                      </div>
                      {activeEditSet === setNum && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, maxHeight: 400, overflowY: 'auto' }}>
                            {editSetData.filter(Boolean).map(item => {
                              const isSel = selectedEditItems.includes(Number(item.taskOrder));
                              return (
                                <div key={`${activeEditSet}-${item.taskOrder}-${item.id}`} style={{ width: 140, background: '#111', padding: 6, borderRadius: 8, border: isSel? '2px solid red' : '1px solid #333', position:'relative' }}>
                                  <div onClick={(e) => { e.stopPropagation(); setSelectedEditItems(v => v.includes(Number(item.taskOrder))? v.filter(x => Number(x)!== Number(item.taskOrder)) : [...v, Number(item.taskOrder)])}} style={{ position: 'absolute', top:6, right:6, width: 22, height: 22, borderRadius: '50%', border: '2px solid #FFF', background: isSel? 'red' : 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex:2 }}>
                                    {isSel && <span style={{ color: '#FFF', fontSize: 12, fontWeight: 900 }}>✓</span>}
                                  </div>
                                  <img src={item.image} onError={(e)=>{ e.currentTarget.src=`/vip${editUser.vipLevel}/day${editUser.currentDay||1}/set${activeEditSet}/photo${item.taskOrder}.jpg` }} alt={item.name} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, display:'block', background:'#222' }} />
                                  <p style={{ fontSize: 11, margin: '4px 0', fontWeight: '800', color: '#00C853' }}>${Number(item.price || 0).toFixed(2)}</p>
                                  <p style={{ fontSize: 9, margin: 0, color: '#CCC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                  <button onClick={() => editItem(item)} style={{ width: '100%', marginTop: 4, background: '#FF1493', border: 'none', padding: 6, borderRadius: 6, color: '#FFF', fontSize: 11 }}>Edit Data</button>
                                </div>
                              )
                            })}
                          </div>
                          {selectedEditItems.length > 0 && (
                            <button onClick={handleSaveEditedData} style={{ background: '#00C853', color: '#FFF', border: 'none', padding: 14, borderRadius: 12, width: '100%', fontWeight: '800' }}>💾 Save Data ({selectedEditItems.length} items)</button>
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
                <p>✅ Sets Today: <b>{manageUser.completedSetsToday || 0}/3</b></p>
                <p>📊 Progress: <b>{manageUser.tasksInCurrentSet || 0}/{vipList.find(v=>v.id===manageUser.vipLevel)?.tasks || 40}</b></p>
                <div style={{display:'flex', gap:10, marginTop:20, flexWrap:'wrap'}}>
                  <button disabled={manageUser.currentSet === 3} onClick={handleResetToNextSet} style={{ background: manageUser.currentSet === 3? '#555':'red', color:'#FFF', border:'none', padding:'14px 20px', borderRadius:'12px', fontWeight:800, cursor: manageUser.currentSet === 3? 'not-allowed':'pointer', flex:1 }}>Reset to Next Set</button>
                  <button disabled={manageUser.currentDay === 5} onClick={handleNextDay} style={{ background: manageUser.currentDay === 5? '#555':'#00C853', color:'#FFF', border:'none', padding:'14px 20px', borderRadius:'12px', fontWeight:800, cursor: manageUser.currentDay === 5? 'not-allowed':'pointer', flex:1 }}>Next Day</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'deposit' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(depositSearch, setDepositUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{depositUser &&!showDepositInput && <button onClick={()=>setShowDepositInput(true)} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Deposit to {depositUser.username} - Balance: ${depositUser.walletBalance}</button>}{showDepositInput && (<div><input value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleDeposit} style={{ background:'#00C853', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Deposit</button></div>)}</div>)}

        {tab === 'withdraw' && (
  <div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}>
    {withdrawList.length === 0 && <p>No pending withdrawals</p>}
    {withdrawList.map(tx => (
      <div key={tx.id} style={{ border:'1px solid #333', padding:14, borderRadius:10, marginBottom:12, background:'#111' }}>
        <p style={{margin:'0 0 6px 0', fontSize:14}}><b>👤 Username: {tx.user?.username}</b> <span style={{color:'#999', fontSize:11}}>({tx.user?.phone})</span></p>
        <p style={{margin:'0 0 8px 0', fontSize:15, fontWeight:800, color:'#FF1493'}}>💰 Amount: ${Number(tx.amount).toFixed(2)}</p>
        <div style={{background:'#222', padding:10, borderRadius:8, marginBottom:10}}>
          <p style={{margin:0, fontSize:11, color:'#FFD700', fontWeight:800}}>💳 User Saved Wallet:</p>
          <p style={{margin:'4px 0 0 0', fontSize:13, color:'#FFF'}}>{tx.user?.boundWallet?.type || 'N/A'} - {tx.user?.boundWallet?.name || ''}</p>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, background:'#111', padding:'6px 8px', borderRadius:6}}>
            <p style={{margin:0, fontSize:11, color:'#CCC', wordBreak:'break-all', flex:1}}>{tx.user?.boundWallet?.address || 'No address'}</p>
            {tx.user?.boundWallet?.address && (
              <button onClick={()=>{
                navigator.clipboard.writeText(tx.user.boundWallet.address)
                alert('Copied!')
              }} style={{background:'#FF1493', border:'none', padding:'6px 10px', borderRadius:6, color:'#FFF', fontSize:12, cursor:'pointer', fontWeight:800}}>📋 Copy</button>
            )}
          </div>
        </div>
        <p style={{fontSize:11, color:'#999', margin:'0 0 10px 0'}}>Status: {tx.status} | {new Date(tx.createdAt).toLocaleString()}</p>
        {(tx.status?.toLowerCase() === 'pending') && (
          <div style={{display:'flex', gap:10}}>
            <button onClick={()=>handleWithdraw(tx.id, 'approve')} style={{flex:1, background:'#00C853', border:'none', padding:12, borderRadius:8, color:'#FFF', fontWeight:800, cursor:'pointer'}}>✅ Approve</button>
            <button onClick={()=>handleWithdraw(tx.id, 'reject')} style={{flex:1, background:'red', border:'none', padding:12, borderRadius:8, color:'#FFF', fontWeight:800, cursor:'pointer'}}>❌ Reject</button>
          </div>
        )}
      </div>
    ))}
  </div>
)}

        {tab === 'notification' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={notifSearch} onChange={e => setNotifSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(notifSearch, setNotifUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{notifUser &&!showNotifInput && <button onClick={()=>setShowNotifInput(true)} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send Notification to {notifUser.username}</button>}{showNotifInput && (<div><textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Message" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, height:80, color:'#000' }} /><button onClick={handleSendNotif} style={{ background:'#FF1493', color:'#FFF', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Send</button></div>)}</div>)}
        {tab === 'bonus' && (<div style={{ background:'#000', color:'#FFF', padding:'20px', borderRadius:'16px' }}><div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}><input value={bonusSearch} onChange={e => setBonusSearch(e.target.value)} placeholder="Username or Phone" style={{ flex:1, padding:'14px', border:'2px solid #FF1493', borderRadius:'12px', outline:'none', color:'#000' }} /><button onClick={()=>searchUser(bonusSearch, setBonusUser)} style={{ background:'#FF1493', border:'none', borderRadius:'12px', padding:'0 18px', fontSize:'20px', cursor:'pointer' }}>🔍</button></div>{bonusUser &&!showBonusInput && <button onClick={()=>setShowBonusInput(true)} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Give Special Bonus to {bonusUser.username} - Current: ${bonusUser.specialBonus || 0}</button>}{showBonusInput && (<div><input value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} placeholder="Bonus Amount" type="number" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', marginBottom:8, color:'#000' }} /><button onClick={handleGiveBonus} style={{ background:'gold', color:'#000', border:'none', padding:'12px', borderRadius:'12px', width:'100%', fontWeight:700 }}>Confirm Special Bonus</button></div>)}</div>)}
      </div>
      <BottomNav />

      <AdminChatModal isOpen={chatOpen} onClose={()=>setChatOpen(false)} />

      {editingPhoto && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ background:'#222', padding:20, borderRadius:16, width:'90%', maxWidth:400 }}>
            <h3 style={{color:'#FFF', marginBottom:12}}>Edit Task {editingPhoto.taskOrder}</h3>
            <img src={editingPhoto.image} onError={(e)=>{ e.currentTarget.src=`/vip${editUser.vipLevel}/day${editUser.currentDay||1}/set${activeEditSet}/photo${editingPhoto.taskOrder}.jpg` }} alt={editingPhoto.name} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:8, marginBottom:10 }}/>
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