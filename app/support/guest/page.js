'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function GuestSupportChat() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load guest chat history
    const saved = JSON.parse(localStorage.getItem('guestChatHistory') || '[]')
    setMessages(saved)
    // Mark as read
    localStorage.setItem('chatLastRead', Date.now().toString())
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const newMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    }

    const updated = [...messages, newMsg]
    setMessages(updated)
    localStorage.setItem('guestChatHistory', JSON.stringify(updated))
    setInput('')

    // Fake support reply after 1s
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: 'Thanks for reaching out! Please log in or create an account for faster support. How can we help you today?',
        sender: 'support',
        timestamp: Date.now()
      }
      const withReply = [...updated, reply]
      setMessages(withReply)
      localStorage.setItem('guestChatHistory', JSON.stringify(withReply))
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0a0a0a',
      color: '#fff'
    }}>
      {/* Minimal header - no logo, no contact, no profile */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#cc0000',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Support Chat</h1>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>
            Welcome! Ask us anything. For account support, please log in.
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user'? 'flex-end' : 'flex-start',
              background: msg.sender === 'user'? '#cc0000' : '#1a1a1a',
              color: msg.sender === 'user'? '#000' : '#fff',
              padding: '10px 14px',
              borderRadius: '16px',
              maxWidth: '70%',
              wordBreak: 'break-word'
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '20px',
            padding: '10px 16px',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: '#cc0000',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            color: '#000',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}