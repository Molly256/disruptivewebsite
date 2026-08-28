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

  const getUserId = () => {
    if (typeof window === 'undefined') return null
    let u = null
    try { u = JSON.parse(localStorage.getItem('user')||'null') } catch{}
    if(u?.id) return String(u.id)
    if(localStorage.getItem('token')) {
       // if logged in but no user object, use token id or fallback
       return localStorage.getItem('chatUserId') || null
    }
    let guestId = localStorage.getItem('guestId')
    if(!guestId){
      guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
      localStorage.setItem('guestId', guestId)
    }
    return guestId
  }

  useEffect(() => {
    try{
      const savedPos = JSON.parse(localStorage.getItem('chatWidgetPos') || '{ "x": 20, "y": 20 }')
      setPos(savedPos)
    }catch{}
  }, [])

  // REAL unread check - from API
  useEffect(() => {
    const checkUnread = async () => {
      const uid = getUserId()
      if(!uid) return
      try{
        const res = await fetch(`/api/chat/messages?userId=${uid}`, { cache: 'no-store' })
        const data = await res.json()
        // API now returns [] directly
        const msgs = Array.isArray(data) ? data : (data.messages || [])
        const unread = msgs.filter(m => m.sender === 'admin' || m.senderRole === 'admin').filter(m => m.status !== 'read').length
        // fallback: if status not used, count all admin msgs after last read
        if(unread === 0){
          const lastRead = Number(localStorage.getItem('chatLastRead') || '0')
          const adminMsgs = msgs.filter(m => (m.sender === 'admin' || m.senderRole === 'admin') && new Date(m.createdAt).getTime() > lastRead)
          setUnreadCount(adminMsgs.length)
        } else {
          setUnreadCount(unread)
        }
      }catch{}
    }

    checkUnread()
    const interval = setInterval(checkUnread, 3000) // poll 3s like admin
    window.addEventListener('focus', checkUnread)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', checkUnread)
    }
  }, [pathname])

  const startDrag = (clientX, clientY) => {
    setDragging(true)
    setHasMoved(false)
    dragStartRef.current = { x: clientX - pos.x, y: clientY - pos.y }
  }
  const onDrag = (clientX, clientY) => {
    if (!dragging) return
    setHasMoved(true)
    const newX = clientX - dragStartRef.current.x
    const newY = clientY - dragStartRef.current.y
    const maxX = window.innerWidth - 60
    const maxY = window.innerHeight - 60
    setPos({ x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) })
  }
  const endDrag = () => {
    if (dragging) {
      setDragging(false)
      localStorage.setItem('chatWidgetPos', JSON.stringify(pos))
    }
  }
  const handleMouseDown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY) }
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
  const handleTouchStart = (e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY) }
  const handleTouchMove = (e) => { const t = e.touches[0]; onDrag(t.clientX, t.clientY) }
  const handleTouchEnd = () => endDrag()

  const handleClick = () => {
    if (!hasMoved) {
      localStorage.setItem('chatLastRead', String(Date.now()))
      setUnreadCount(0)
      // mark as read on server
      const uid = getUserId()
      if(uid){
        fetch('/api/chat/read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid, chatId: uid, who:'user' }) }).catch(()=>{})
      }
      const isLoggedIn = typeof window !== 'undefined' && (!!localStorage.getItem('token') || !!localStorage.getItem('user'))
      if (isLoggedIn) router.push('/support/chat')
      else router.push('/support/guest')
    }
  }

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
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        cursor: dragging ? 'grabbing' : 'pointer',
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
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  )
}