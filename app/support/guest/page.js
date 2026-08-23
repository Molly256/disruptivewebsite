'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ADJECTIVES = ['Swift','Cool','Bright','Calm','Bold','Quick','Smart','Kind','Happy','Lucky']
const NAMES = ['Fox','Tiger','Eagle','Wolf','Lion','Bear','Shark','Hawk','Panda','Koala']

function generateGuestName(){
  const adj = ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)]
  const name = NAMES[Math.floor(Math.random()*NAMES.length)]
  const num = Math.floor(1000 + Math.random()*9000)
  return `${adj}${name}-${num}`
}

export default function GuestSupportChat() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [guestId, setGuestId] = useState('')
  const [guestName, setGuestName] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    let gId = localStorage.getItem('guestId')
    let gName = localStorage.getItem('guestName')
    if(!gId){
      gId = 'guest_' + Date.now().toString(36) + Math.random().toString(36).substring(2,8)
      localStorage.setItem('guestId', gId)
    }
    if(!gName){
      gName = generateGuestName()
      localStorage.setItem('guestName', gName)
    }
    setGuestId(gId)
    setGuestName(gName)
  }, [])

  const loadMessages = async (id) => {
    const uid = id || guestId
    if(!uid) return
    try{
      const res = await fetch(`/api/chat/messages?userId=${uid}`, { cache: 'no-store' })
      const data = await res.json()
      if(data.messages){
        const formatted = data.messages.map(m=>{
          const role = m.senderRole || m.sender
          return {
            id: m.id,
            text: m.text,
            sender: role === 'user'? 'user' : 'support',
            timestamp: new Date(m.createdAt).getTime()
          }
        })
        setMessages(formatted)
      }
    }catch(e){ console.error(e) }
  }

  useEffect(() => {
    if(!guestId) return
    loadMessages(guestId)
    const interval = setInterval(()=> loadMessages(guestId), 3000)
    return ()=> clearInterval(interval)
  }, [guestId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const textToSend = input.trim()
    setInput('') // clear immediately, NO local push

    try{
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: guestId,
          username: guestName,
          email: '',
          message: textToSend,
          isGuest: true
        })
      })
      setTimeout(()=> loadMessages(guestId), 500)
    }catch(e){
      console.error('send failed', e)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', color: '#fff', background: '#000' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#cc0000', fontSize: '24px', cursor: 'pointer', padding: 0 }}>←</button>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Support Chat</h1>
          {guestName && <div style={{ fontSize: '12px', color: '#888' }}>{guestName} (Guest)</div>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>Welcome {guestName}! Ask us anything. For account support, please log in.</div>}
        {messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.sender === 'user'? 'flex-end' : 'flex-start', background: msg.sender === 'user'? '#cc0000' : '#1a1a1a', color: msg.sender === 'user'? '#000' : '#fff', padding: '10px 14px', borderRadius: '16px', maxWidth: '70%', wordBreak: 'break-word' }}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #333', display: 'flex', gap: '8px' }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder={`Message as ${guestName || 'Guest'}...`} style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '10px 16px', color: '#fff', outline: 'none' }} />
        <button onClick={sendMessage} style={{ background: '#cc0000', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#000', cursor: 'pointer', fontSize: '18px', flexShrink: 0 }}>→</button>
      </div>
    </div>
  )
}