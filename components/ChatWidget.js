'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ChatWidget() {
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [pos, setPos] = useState({ x: 20, y: 20 })
  const [dragging, setDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  // Only hide on chat page itself to avoid duplicate UI
  const hideWidgetRoutes = ['/support/chat']
  const shouldHide = hideWidgetRoutes.includes(pathname)

  useEffect(() => {
    const savedPos = JSON.parse(localStorage.getItem('chatWidgetPos') || '{ "x": 20, "y": 20 }')
    setPos(savedPos)
  }, [])

  // Check for unread messages
  useEffect(() => {
    const checkUnread = () => {
      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]')
      const lastRead = localStorage.getItem('chatLastRead') || '0'
      const unread = history.filter(msg => msg.timestamp > Number(lastRead) && msg.sender === 'support').length
      setUnreadCount(unread)
    }

    checkUnread()
    window.addEventListener('storage', checkUnread)
    return () => window.removeEventListener('storage', checkUnread)
  }, [pathname])

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
      localStorage.setItem('chatWidgetPos', JSON.stringify(pos))
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
    if (!hasMoved) {
      router.push('/support/chat')
    }
  }

  if (shouldHide) return null

  return (
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
        color: '#000',
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
      {unreadCount > 0 && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          background: '#000',
          color: '#fff',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700'
        }}>
          {unreadCount}
        </div>
      )}
    </div>
  )
}