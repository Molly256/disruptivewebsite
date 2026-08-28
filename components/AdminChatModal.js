'use client'
import { useState, useEffect, useRef } from 'react'

export default function AdminChatModal({ isOpen, onClose }) {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const endRef = useRef(null)

  const fetchChats = async () => {
    try{
      const res = await fetch('/api/chat/list', { cache: 'no-store' })
      const data = await res.json()
      setChats(Array.isArray(data)? data : (data.conversations || []))
    }catch{}
  }
  const fetchMessages = async (id) => {
    try{
      const res = await fetch(`/api/chat/messages?chatId=${id}`, { cache: 'no-store' })
      const data = await res.json()
      setMessages(Array.isArray(data)? data : (data.messages || []))
      setTimeout(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),100)
    }catch{}
  }

  useEffect(()=>{ if(isOpen) fetchChats(); const i=setInterval(()=>{if(isOpen&&!selectedChat) fetchChats()},3000); return()=>clearInterval(i)},[isOpen,selectedChat])
  useEffect(()=>{ if(!selectedChat) return; fetchMessages(selectedChat.id); fetch('/api/chat/read',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatId:selectedChat.id,who:'admin'})}); const i=setInterval(()=>fetchMessages(selectedChat.id),2000); return()=>clearInterval(i)},[selectedChat])

  const send = async () => {
    if(!text.trim()||!selectedChat) return
    const t=text; setText('')
    await fetch('/api/chat/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatId:selectedChat.id,text:t,sender:'admin',senderName:'Admin256'})})
    fetchMessages(selectedChat.id); fetchChats()
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
        @media(max-width:768px){
         .wa-wrap{ width:100vw; height:100dvh; border-radius:0; }
         .wa-side{ width:100%; }
         .wa-side.hide{ display:none; }
         .wa-main{ display:none; width:100%; height:100dvh; }
         .wa-main.show{ display:flex; }
        }
      `}</style>

      <div className="wa-wrap">
        {/* INBOX LIST */}
        <div className={`wa-side ${selectedChat?'hide':''}`}>
          <div style={{ height:'60px', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
            <b>Chat Inbox</b>
            <button onClick={onClose} style={{ border:'none', background:'none', fontSize:'22px', cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {chats.map(c=>(
              <div key={c.id} onClick={()=>setSelectedChat(c)} style={{ padding:'12px', display:'flex', gap:'12px', cursor:'pointer', background: selectedChat?.id===c.id?'#f0f2f5':'#fff', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'#00a884', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>{c.displayName[0]?.toUpperCase()}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:'15px' }}>{c.displayName}</b><span style={{ fontSize:'11px', color:'#667781' }}>{c.unreadAdmin>0?`${c.unreadAdmin} new`:''}</span></div>
                  <div style={{ fontSize:'13px', color:'#667781', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL PAGE CHAT - like Whatsapp */}
        <div className={`wa-main ${selectedChat?'show':''}`}>
          <div className="wa-bg" />
          {!selectedChat? (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#667781', zIndex:1 }}>Select a chat</div>
          ) : (
            <>
              <div style={{ height:'60px', background:'#f0f2f5', zIndex:2, display:'flex', alignItems:'center', padding:'0 12px', gap:'10px' }}>
                <button onClick={()=>setSelectedChat(null)} style={{ border:'none', background:'none', fontSize:'24px', cursor:'pointer' }}>←</button>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>{selectedChat.displayName[0]}</div>
                <div style={{ flex:1 }}><div style={{ fontWeight:'600' }}>{selectedChat.displayName}</div><div style={{ fontSize:'12px', color:'#667781' }}>{selectedChat.isGuest?'Guest':'User'}</div></div>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'4px', zIndex:1 }}>
                {messages.map(m=>{
                  const me = m.sender==='admin'||m.senderRole==='admin'
                  return (
                    <div key={m.id} className={`wa-bub ${me?'wa-out':'wa-in'}`}>
                      {m.text}
                      <div style={{ fontSize:'10px', color:'#667781', textAlign:'right', marginTop:'4px' }}>{m.timeString||new Date(m.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} {me? (m.status==='read'?'✓✓':'✓✓') : ''}</div>
                    </div>
                  )
                })}
                <div ref={endRef}/>
              </div>

              <div style={{ zIndex:2, background:'#f0f2f5', padding:'8px 12px', display:'flex', gap:'8px', alignItems:'center' }}>
                <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message" style={{ flex:1, border:'none', borderRadius:'22px', padding:'12px 16px', outline:'none', fontSize:'15px' }}/>
                <button onClick={send} style={{ width:'44px', height:'44px', borderRadius:'50%', border:'none', background:'#00a884', color:'#fff', fontSize:'20px', cursor:'pointer' }}>➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}