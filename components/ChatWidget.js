'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ChatWidget() {
  const pathname = usePathname()

  // Don't render on home page
  if (pathname === '/') return null

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pos, setPos] = useState({ x: 20, y: 20 })
  const [dragging, setDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    const savedPos = JSON.parse(localStorage.getItem('chatPos') || '{ "x": 20, "y": 20 }')
    setMessages(saved)
    setPos(savedPos)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveMessages = (newMessages) => {
    setMessages(newMessages)
    localStorage.setItem('chatMessages', JSON.stringify(newMessages))
  }

  const sendMessage = (text, image = null) => {
    if (!text.trim() &&!image) return
    const newMsg = {
      id: Date.now(),
      text,
      image,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const updated = [...messages, newMsg]
    saveMessages(updated)
    setInput('')

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: 'Thanks for reaching out! Our team will reply shortly.',
        image: null,
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      saveMessages([...updated, reply])
    }, 1500)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      sendMessage('', ev.target.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const startDrag = (clientX, clientY) => {
    setDragging(true)
    setHasMoved(false)
    dragStartRef.current = {
      x: clientX - pos.x,
      y: clientY - pos.y
    }
  }

  const onDrag = (clientX, clientY) => {
    if (!dragging) return
    setHasMoved(true)
    const newX = clientX - dragStartRef.current.x
    const newY = clientY - dragStartRef.current.y

    const maxX = window.innerWidth - 60
    const maxY = window.innerHeight - 60
    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))

    setPos({ x: clampedX, y: clampedY })
  }

  const endDrag = () => {
    if (dragging) {
      setDragging(false)
      localStorage.setItem('chatPos', JSON.stringify(pos))
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e) => onDrag(e.clientX, e.clientY)
    const handleMouseUp = () => endDrag()

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, pos])

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    startDrag(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    onDrag(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => endDrag()

  const handleClick = () => {
    if (!hasMoved) setOpen(!open)
  }

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          position: 'fixed',
          bottom: `${pos.y}px`,
          right: `${pos.x}px`,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#cc0000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          cursor: dragging? 'grabbing' : 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        🎧
      </div>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: `${pos.y + 70}px`,
          right: `${pos.x}px`,
          width: '320px',
          height: '450px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#cc0000',
            color: '#000',
            padding: '12px 16px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Customer Support</span>
            <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', fontSize: '20px' }}>×</span>
          </div>

          <div style={{
            flex: 1,
            padding: '12px',
            overflowY: 'auto',
            background: '#f5f5f5'
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '40px', fontSize: '14px' }}>
                Send a message to start chatting
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} style={{
                display: 'flex',
                justifyContent: m.sender === 'user'? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{
                  maxWidth: '70%',
                  background: m.sender === 'user'? '#cc0000' : '#fff',
                  color: '#000',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {m.image && (
                    <img src={m.image} alt="" style={{
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: m.text? '6px' : 0
                    }} />
                  )}
                  {m.text}
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '10px',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >📎</button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              style={{
                background: '#cc0000',
                color: '#000',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  )
}