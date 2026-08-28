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
      // handle both [] and {conversations:[]}
      const list = Array.isArray(data) ? data : (data.conversations || [])
      setChats(list)
    }catch(e){ console.error(e) }
  }

  const fetchMessages = async (chatId) => {
    try{
      const res = await fetch(`/api/chat/messages?chatId=${chatId}`, { cache: 'no-store' })
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : (data.messages || []))
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }catch(e){ console.error(e) }
  }

  useEffect(() => {
    if (isOpen) fetchChats()
    const interval = setInterval(() => { if (isOpen && !selectedChat) fetchChats() }, 3000)
    return () => clearInterval(interval)
  }, [isOpen, selectedChat])

  useEffect(() => {
    if (!selectedChat) return
    const cid = selectedChat.id
    fetchMessages(cid)
    // FIX: need Content-Type
    fetch('/api/chat/read', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: cid, who: 'admin' }) 
    })
    const interval = setInterval(() => fetchMessages(cid), 2000)
    return () => clearInterval(interval)
  }, [selectedChat])

  const send = async () => {
    if (!text.trim() || !selectedChat) return
    const msgText = text
    setText('')
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // FIX: missing header = req.json() fails
      body: JSON.stringify({
        chatId: selectedChat.id, // FIX: always use id, not guestId
        text: msgText,
        sender: 'admin',
        senderName: 'Admin256',
        isGuest: selectedChat.isGuest
      })
    })
    fetchMessages(selectedChat.id)
    fetchChats()
  }

  const deleteChat = async (chat) => {
    if (!confirm(`Delete chat for ${chat.displayName}?`)) return
    await fetch('/api/chat/delete', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: chat.id }) 
    })
    setSelectedChat(null)
    setMessages([])
    fetchChats()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '900px', maxWidth: '95vw', height: '80vh', background: '#fff', borderRadius: '16px', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '320px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', background: '#FF1493', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Chat Inbox</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chats.map(chat => (
              <div key={chat.id} onClick={() => setSelectedChat(chat)} style={{ padding: '12px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: selectedChat?.id === chat.id ? '#ffe6f0' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.displayName}</span> 
                    {chat.isGuest && <span style={{ fontSize: '10px', background: '#ddd', padding: '2px 6px', borderRadius: '10px', flexShrink: 0 }}>GUEST</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{chat.lastMessage || 'No messages'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginLeft: '8px' }}>
                  {chat.unreadAdmin > 0 && <span style={{ background: '#FF1493', color: '#fff', borderRadius: '12px', minWidth: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{chat.unreadAdmin}</span>}
                  <button onClick={(e) => { e.stopPropagation(); deleteChat(chat) }} style={{ background: 'none', border: 'none', color: '#cc0000', fontSize: '14px', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
            {chats.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>No chats yet - new contacts will appear here</div>}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!selectedChat ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Select a chat</div>
          ) : (
            <>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><b>{selectedChat.displayName}</b> <span style={{ fontSize: '11px', color: '#888', marginLeft: '6px' }}>{selectedChat.isGuest ? selectedChat.guestId : selectedChat.userId}</span></div>
                <div style={{ fontSize: '12px', color: '#888' }}>{messages.length} msgs</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#fafafa' }}>
                {messages.map(m => (
                  <div key={m.id} style={{ alignSelf: (m.sender === 'admin' || m.senderRole === 'admin') ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>{m.senderName} • {m.timeString || new Date(m.createdAt).toLocaleTimeString()}</div>
                    <div style={{ background: (m.sender === 'admin' || m.senderRole === 'admin') ? '#FF1493' : '#fff', color: (m.sender === 'admin' || m.senderRole === 'admin') ? '#fff' : '#000', padding: '10px 14px', borderRadius: (m.sender === 'admin' || m.senderRole === 'admin') ? '16px 16px 0 16px' : '16px 16px 16px 0', border: (m.sender !== 'admin' && m.senderRole !== 'admin') ? '1px solid #eee' : 'none', fontSize: '13px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', wordBreak: 'break-word' }}>
                      {m.text}
                      <div style={{ fontSize: '9px', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{m.status === 'read' ? 'read ✓✓' : 'delivered ✓✓'}</div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', background: '#fff' }}>
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Reply as Admin256..." style={{ flex: 1, border: '1px solid #ddd', borderRadius: '24px', padding: '10px 16px', outline: 'none' }} />
                <button onClick={send} style={{ background: '#FF1493', color: '#fff', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', fontSize: '18px' }}>➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}