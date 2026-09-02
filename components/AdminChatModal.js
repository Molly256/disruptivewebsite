'use client'
import { useState, useEffect, useRef } from 'react'

export default function AdminChatModal({ isOpen, onClose }) {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const endRef = useRef(null)
  const fileInputRef = useRef(null)
  const prevUnreadRef = useRef(0)
  const audioRef = useRef(null)
  const prevMsgLenRef = useRef(0)

  const fetchChats = async () => {
    try{
      const res = await fetch('/api/chat/list', { cache: 'no-store' })
      const data = await res.json()
      const list = Array.isArray(data)? data : (data.conversations || [])

      const totalUnread = list.reduce((s,c)=>s+(c.unreadAdmin||0),0)
      if(totalUnread > prevUnreadRef.current && prevUnreadRef.current!== 0){
        const newOne = list.find(c=>c.unreadAdmin>0)
        if(newOne){
          audioRef.current?.play().catch(()=>{})
          if(navigator.vibrate) navigator.vibrate([300,100,300,100,300])
          if(Notification.permission === 'granted'){
            new Notification(`New message from ${newOne.displayName} 🔔`, {
              body: newOne.lastMessage?.slice(0,80) || 'New message',
              icon: '/logo.png'
            })
          }
        }
      }
      prevUnreadRef.current = totalUnread

      setChats(list)
    }catch{}
  }

  const fetchMessages = async (id) => {
    try{
      const res = await fetch(`/api/chat/messages?chatId=${id}`, { cache: 'no-store' })
      const data = await res.json()
      const msgs = Array.isArray(data)? data : (data.messages || [])

      if(msgs.length > prevMsgLenRef.current && prevMsgLenRef.current!==0){
        const last = msgs[msgs.length-1]
        if(last.sender!== 'admin' && last.senderRole!== 'admin'){
          audioRef.current?.play().catch(()=>{})
          if(navigator.vibrate) navigator.vibrate([300,100,300])
        }
      }
      prevMsgLenRef.current = msgs.length

      setMessages(msgs)
      setTimeout(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),100)
    }catch{}
  }

  useEffect(()=>{
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3')
    audioRef.current.volume = 1.0

    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{})
    }

    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding).replace(/-/g,'+').replace(/_/g,'/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for(let i=0;i<rawData.length;++i) outputArray[i]=rawData.charCodeAt(i)
      return outputArray
    }

    const subscribePush = async () => {
      try{
        const reg = await navigator.serviceWorker.ready
        let sub = await reg.pushManager.getSubscription()
        if(!sub){
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
          })
        }
        const adminId = localStorage.getItem('userId') || localStorage.getItem('username') || 'Admin256'
        const json = sub.toJSON()
        await fetch('/api/admin/push/subscribe',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({adminId, sub: json})
        })
        console.log('Push subscribed OK')
      }catch(e){ console.log('push subscribe fail', e)}
    }

    if(Notification.permission === 'granted'){
      subscribePush()
    } else if(Notification.permission!== 'denied'){
      Notification.requestPermission().then(perm=>{
        if(perm==='granted') subscribePush()
      })
    }

    if(isOpen) fetchChats();
    const i=setInterval(()=>{if(isOpen&&!selectedChat) fetchChats()},3000);
    return()=>clearInterval(i)
  },[isOpen,selectedChat])

  useEffect(()=>{
    if(!selectedChat) { prevMsgLenRef.current = 0; return }
    fetchMessages(selectedChat.id);
    fetch('/api/chat/read',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatId:selectedChat.id,who:'admin'})});
    const i=setInterval(()=>fetchMessages(selectedChat.id),2000);
    return()=>clearInterval(i)
  },[selectedChat])

  const send = async (imageUrl = null) => {
    if((!text.trim() &&!imageUrl)||!selectedChat) return
    const t=text; setText('')
    await fetch('/api/chat/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatId:selectedChat.id,text:t || '📷 Image',sender:'admin',senderName:'Admin256', image: imageUrl || null})})
    fetchMessages(selectedChat.id); fetchChats()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => send(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleDeleteChat = async () => {
    if(!selectedChat) return
    if(!confirm(`Delete chat with ${selectedChat.displayName}? This will clear for user too.`)) return
    setDeleting(true)
    try{
      const res = await fetch('/api/chat/delete',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({chatId: selectedChat.id})
      })
      const data = await res.json()
      if(res.ok){
        setSelectedChat(null)
        setMessages([])
        fetchChats()
      }else{
        alert(data.error || 'Failed to delete')
      }
    }catch(e){
      alert('Delete failed')
    }finally{
      setDeleting(false)
    }
  }

  if(!isOpen) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'#111b21', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
   .wa-wrap{ width:95vw; max-width:1000px; height:85vh; background:#fff; border-radius:12px; display:flex; overflow:hidden; }
   .wa-side{ width:360px; border-right:1px solid #e9edef; display:flex; flex-direction:column; background:#fff; }
   .wa-main{ flex:1; display:flex; flex-direction:column; background:#efeae2; position:relative; }
   .wa-bg{ position:absolute; inset:0; background:url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); opacity:.06; }
   .wa-bub{ max-width:65%; padding:8px 10px; border-radius:8px; font-size:14.5px; line-height:19px; box-shadow:0 1px.5px rgba(0,0,0,.13); word-break:break-word; white-space:pre-wrap; position:relative; }
   .wa-in{ background:#fff; align-self:flex-start; border-top-left-radius:0; }
   .wa-out{ background:#d9fdd3; align-self:flex-end; border-top-right-radius:0; }
   .only-mobile{ display:none; }
        @media(max-width:768px){
     .wa-wrap{ width:100vw; height:100dvh; border-radius:0; }
     .wa-side{ width:100%; }
     .wa-side.hide{ display:none; }
     .wa-main{ display:none; width:100%; height:100dvh; }
     .wa-main.show{ display:flex; }
     .only-mobile{ display:flex!important; }
     .hide-mobile{ display:none!important; }
        }
      `}</style>

      <div className="wa-wrap">
        <div className={`wa-side ${selectedChat?'hide':''}`}>
          <div style={{ height:'60px', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <button onClick={onClose} style={{ border:'none', background:'none', fontSize:'24px', cursor:'pointer' }} className="only-mobile">←</button>
              <b>Chat Inbox {chats.reduce((a,c)=>a+(c.unreadAdmin||0),0)>0 && <span style={{background:'#f15c6d',color:'#fff',padding:'2px 7px',borderRadius:'10px',fontSize:'12px',marginLeft:'6px'}}>{chats.reduce((a,c)=>a+(c.unreadAdmin||0),0)}</span>}</b>
            </div>
            <button onClick={onClose} style={{ border:'none', background:'none', fontSize:'22px', cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {chats.map(c=>(
              <div key={c.id} onClick={()=>setSelectedChat(c)} style={{ padding:'12px', display:'flex', gap:'12px', cursor:'pointer', background: selectedChat?.id===c.id?'#f0f2f5':'#fff', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'50%', background: c.unreadAdmin>0? '#f15c6d' : '#00a884', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>{c.displayName?.[0]?.toUpperCase()||'?'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:'15px' }}>{c.displayName}</b><span style={{ fontSize:'11px', color: c.unreadAdmin>0? '#f15c6d':'#667781', fontWeight: c.unreadAdmin>0? '700':'400' }}>{c.unreadAdmin>0?`${c.unreadAdmin} new`:''}</span></div>
                  <div style={{ fontSize:'13px', color:'#667781', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`wa-main ${selectedChat?'show':''}`}>
          <div className="wa-bg" />
          {!selectedChat? (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#667781', zIndex:1 }} className="hide-mobile">Select a chat</div>
          ) : (
            <>
              <div style={{ height:'60px', background:'#f0f2f5', zIndex:2, display:'flex', alignItems:'center', padding:'0 12px', gap:'10px' }}>
                <button onClick={()=>setSelectedChat(null)} style={{ border:'none', background:'none', fontSize:'24px', cursor:'pointer' }}>←</button>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>{selectedChat.displayName?.[0]||'?'}</div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:'600', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{selectedChat.displayName}</div><div style={{ fontSize:'12px', color:'#667781' }}>{selectedChat.isGuest?'Guest':'User'}</div></div>
                <button onClick={handleDeleteChat} disabled={deleting} title="Delete chat for both sides" style={{ border:'none', background:'#fff', width:'38px', height:'38px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f15c6d', fontSize:'18px' }}>
                  {deleting? '...' : '🗑️'}
                </button>
                <button onClick={onClose} style={{ border:'none', background:'none', fontSize:'20px', cursor:'pointer' }} className="hide-mobile">✕</button>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'4px', zIndex:1 }}>
                {messages.map(m=>{
                  const me = m.sender==='admin'||m.senderRole==='admin'
                  return (
                    <div key={m.id} className={`wa-bub ${me?'wa-out':'wa-in'}`}>
                      {m.image && <img src={m.image} alt="img" style={{ maxWidth:'200px', borderRadius:'8px', display:'block', marginBottom: m.text? '6px' : 0 }} />}
                      {m.text}
                      <div style={{ fontSize:'10px', color:'#667781', textAlign:'right', marginTop:'4px' }}>{m.timeString||new Date(m.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} {me?'✓✓':''}</div>
                    </div>
                  )
                })}
                <div ref={endRef}/>
              </div>

              <div style={{ zIndex:2, background:'#f0f2f5', padding:'8px 12px', display:'flex', gap:'8px', alignItems:'center' }}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display:'none' }} />
                <button onClick={()=> fileInputRef.current?.click()} style={{ width:'44px', height:'44px', borderRadius:'50%', border:'none', background:'#fff', color:'#00a884', fontSize:'24px', cursor:'pointer' }}>+</button>
                <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message" style={{ flex:1, border:'none', borderRadius:'22px', padding:'12px 16px', outline:'none', fontSize:'15px' }}/>
                <button onClick={()=>send()} style={{ width:'44px', height:'44px', borderRadius:'50%', border:'none', background:'#00a884', color:'#fff', fontSize:'20px', cursor:'pointer' }}>➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}