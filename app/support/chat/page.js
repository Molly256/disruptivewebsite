'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function ChatSupport() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [user, setUser] = useState(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    try{
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (savedUser) setUser(savedUser)
    }catch{}
  }, [])

  const loadFromBackend = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/chat/messages?userId=${user.id}`, { cache: 'no-store' })
      const data = await res.json()
      const list = Array.isArray(data)? data : (data.messages || [])
      if (list.length > 0) {
        const formatted = list.map(m => {
          const isUser = (m.senderRole || m.sender) === 'user'
          const isSystem = (m.senderRole || m.sender) === 'system'
          return {
            id: m.id,
            type: isUser? 'user' : isSystem? 'system' : 'support',
            sender: isUser? 'user' : 'support',
            text: m.text,
            image: m.image || null,
            time: m.timeString || new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(m.createdAt).getTime()
          }
        })
        setMessages(formatted)
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    if (!user?.id) return
    const init = async () => {
      try {
        const res = await fetch(`/api/chat/messages?userId=${user.id}`, { cache: 'no-store' })
        const data = await res.json()
        const list = Array.isArray(data)? data : (data.messages || [])
        if (list.length === 0) {
          setMessages([
            { id: 'sys1', type: 'system', text: 'Welcome to Customer Service. How can we assist you today?', timestamp: Date.now() },
            { id: 'sys2', type: 'support', text: 'Welcome to our online support service.\n\nTo help us assist you more efficiently, please keep this chat window open during your inquiry.', timestamp: Date.now() + 1 }
          ])
        } else {
          await loadFromBackend()
        }
        await fetch('/api/chat/read', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: user.id, who:'user' }) }).catch(()=>{})
        localStorage.setItem('chatLastRead', Date.now().toString())
      } catch (e) { console.error(e) }
    }
    init()
    const interval = setInterval(loadFromBackend, 2000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text, imageUrl = null) => {
    if (!text.trim() &&!imageUrl) return
    if (!user?.id) { alert('Please login first'); return }

    const messageText = text.trim() || 'Image sent'
    setInput('')
    setShowEmoji(false)

    // OPTIMISTIC - show instantly
    const tempId = 'tmp_'+Date.now()
    setMessages(prev => [...prev, { id: tempId, type:'user', sender:'user', text: messageText, image: imageUrl, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), timestamp: Date.now() }])

    try {
      // FIX: use /api/chat/send NOT /api/contact
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          chatId: user.id,
          text: messageText,
          username: user.username,
          isGuest: false,
          sender: 'user',
          image: imageUrl || null
        })
      })
      setTimeout(loadFromBackend, 300)
    } catch (e) {
      console.error('send failed', e)
      // remove temp on fail
      setMessages(prev => prev.filter(m=>m.id!==tempId))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => sendMessage('', ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const emojis = ['😀','😂','😍','👍','❤️','🙏','🔥','💯','😊','🤔','😎','👋']

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>Support</span>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ flex: 1, padding: '144px 16px 80px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '16px' }}>
            {msg.type === 'system' && <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', margin: '16px 0' }}>{msg.text}</div>}
            {msg.type === 'support' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#cc0000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>CS</div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Online Customer Support</div>
                  <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px', maxWidth: '280px', fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-line', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{msg.text}</div>
                  <div style={{ fontSize:'10px', color:'#999', marginTop:'4px' }}>{msg.time}</div>
                </div>
              </div>
            )}
            {msg.type === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  <div style={{ background: '#cc0000', color: '#fff', padding: '12px 16px', borderRadius: '12px', maxWidth: '280px', fontSize: '15px' }}>
                    {msg.image && <img src={msg.image} alt="upload" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.text? '8px' : 0 }} />}
                    {msg.text}
                  </div>
                  <div style={{ fontSize:'10px', color:'#999', marginTop:'4px', textAlign:'right' }}>{msg.time}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ background: '#fff', padding: '12px 16px', borderTop: '1px solid #eee', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        {showEmoji && (
          <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {emojis.map(e => <span key={e} onClick={() => { setInput(input + e); setShowEmoji(false) }} style={{ fontSize: '24px', cursor: 'pointer' }}>{e}</span>)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#cc0000' }}>+</button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} placeholder="Type a message" style={{ flex: 1, border: 'none', background: '#f5f5f5', borderRadius: '20px', padding: '10px 16px', fontSize: '16px', outline: 'none' }} />
          <button onClick={() => setShowEmoji(!showEmoji)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>😊</button>
          <button onClick={() => sendMessage(input)} style={{ background: '#cc0000', border: 'none', width:'36px', height:'36px', borderRadius:'50%', fontSize: '16px', cursor: 'pointer', color: '#fff' }}>➤</button>
        </div>
      </div>
    </div>
  )
}