'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatSupport() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: 'Welcome to Customer Service. How can we assist you today?' },
    { id: 2, type: 'support', text: 'Welcome to our online support service.\n\nTo help us assist you more efficiently, please keep this chat window open during your inquiry. Thank you for your cooperation.' }
  ])
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const isAdmin = true // Change this based on your auth. Set false for normal users

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (text, imageUrl = null) => {
    if (!text.trim() &&!imageUrl) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      image: imageUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setInput('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        sendMessage('', event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearChat = () => {
    if (confirm('Clear all chat messages?')) {
      setMessages([{ id: 1, type: 'system', text: 'Chat cleared by admin' }])
    }
  }

  const emojis = ['😀','😂','😍','👍','❤️','🙏','🔥','💯','😊','🤔','😎','👋']

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <div style={{
        background: '#fff',
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>Support</span>
        {isAdmin && (
          <button onClick={clearChat} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            Clear Chat
          </button>
        )}
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, padding: '80px 16px 80px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '16px' }}>
            {msg.type === 'system' && (
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', margin: '16px 0' }}>
                {msg.text}
              </div>
            )}
            {msg.type === 'support' && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <img src="/support-avatar.jpg" alt="Support" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Online Customer Support</div>
                  <div style={{
                    background: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    maxWidth: '280px',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )}
            {msg.type === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: '#007AFF',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  maxWidth: '280px',
                  fontSize: '15px'
                }}>
                  {msg.image && <img src={msg.image} alt="upload" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.text? '8px' : 0 }} />}
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderTop: '1px solid #eee',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}>
        {showEmoji && (
          <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {emojis.map(e => (
              <span key={e} onClick={() => { setInput(input + e); setShowEmoji(false) }} style={{ fontSize: '24px', cursor: 'pointer' }}>{e}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007AFF' }}>+</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type a message"
            style={{
              flex: 1,
              border: 'none',
              background: '#f5f5f5',
              borderRadius: '20px',
              padding: '10px 16px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button onClick={() => setShowEmoji(!showEmoji)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>😊</button>
          <button onClick={() => sendMessage(input)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007AFF' }}>➤</button>
        </div>
      </div>
    </div>
  )
}