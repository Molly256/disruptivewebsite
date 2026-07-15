'use client'
import { useEffect, useState, useRef } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const useUser = () => {
  return { name: 'Guest', vipLevel: 0 } // Replace with real session
}

const winnerMessages = [
  'John56 user wins 102.00 USD prize in the task.',
  'Rebella26 user wins 256.00 USD prize in the task.',
  'Davidma user wins 77.00 USD prize in the task.',
  'Venuezel user wins 88.00 USD prize in the task.',
  'Kennethpa user wins 1,000 USD prize in the task.'
]

const SCROLL_TIME = 1000 // 1.0s to come to center
const HOLD_TIME = 900 // 0.9s hold while zoomed
const CYCLE_TIME = SCROLL_TIME + HOLD_TIME // 1.9s per image total

export default function StartingPage() {
  const [products, setProducts] = useState([])
  const user = useUser()
  const trackRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    const imageList = []
    for (let i = 1; i <= 74; i++) {
      imageList.push(`/image${i}.jpg`)
    }
    const shuffled = imageList.sort(() => Math.random() - 0.5)
    setProducts(shuffled)
  }, [])

  useEffect(() => {
    if (products.length === 0) return
    const track = trackRef.current
    const carousel = carouselRef.current
    if (!track ||!carousel) return

    const init = () => {
      const items = Array.from(track.children)
      if (items.length === 0 || items[0].offsetWidth === 0) {
        requestAnimationFrame(init)
        return
      }

      const gap = 20
      const itemWidth = items[0].offsetWidth + gap
      const containerWidth = carousel.offsetWidth
      const centerOffset = containerWidth / 2 - items[0].offsetWidth / 2

      let animationFrameId

      const getCurrentIndexFromTime = () => {
        const elapsed = Date.now() % (products.length * CYCLE_TIME)
        return Math.floor(elapsed / CYCLE_TIME)
      }

      const getProgressInCycle = () => {
        const elapsed = Date.now() % CYCLE_TIME
        return elapsed
      }

      const updateActive = (index, progressMs) => {
        const centerIndex = products.length + (index % products.length)
        const isInHoldPhase = progressMs >= SCROLL_TIME
        items.forEach((item, i) => {
          if (i === centerIndex && isInHoldPhase) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })
      }

      const setPosition = (index, progressMs) => {
        const realIndex = products.length + (index % products.length)
        const basePos = realIndex * itemWidth - centerOffset

        let currentPos = basePos
        if (progressMs < SCROLL_TIME) {
          const prevIndex = (index - 1 + products.length) % products.length
          const prevRealIndex = products.length + prevIndex
          const prevPos = prevRealIndex * itemWidth - centerOffset
          const slideProgress = progressMs / SCROLL_TIME
          currentPos = prevPos + (basePos - prevPos) * slideProgress
        }

        track.style.transition = 'none'
        track.style.transform = `translateX(-${currentPos}px)`
        updateActive(index, progressMs)
      }

      const tick = () => {
        const currentIndex = getCurrentIndexFromTime()
        const progress = getProgressInCycle()
        setPosition(currentIndex, progress)
        animationFrameId = requestAnimationFrame(tick)
      }

      tick()

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }

    const cleanup = init()
    return cleanup
  }, [products])

  const allProducts = [...products,...products,...products]
  const allMessages = [...winnerMessages,...winnerMessages]

  return (
    <div className="starting-wrapper" style={{ paddingTop: '64px', paddingBottom: '90px' }}>
      <AppHeader />

      {/* Marquee Bar - FLUSH TO HEADER */}
      <div className="marquee-container" style={{
        margin: 0,
        padding: 0,
        background: '#cc0000',
        overflow: 'hidden'
      }}>
        <div className="marquee-content" style={{
          display: 'flex',
          animation: 'scroll 15s linear infinite',
          whiteSpace: 'nowrap'
        }}>
          {allMessages.map((msg, i) => (
            <span key={i} className="marquee-item" style={{
              padding: '8px 40px 8px 0',
              fontSize: '13px',
              fontWeight: '500',
              color: '#000'
            }}>{msg}</span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* User Bar */}
      <div className="user-bar" style={{ marginTop: 0, padding: '16px 20px' }}>
        <div>
          <p className="user-greeting" style={{ margin: 0, fontSize: '14px', fontWeight: '300' }}>Hello,</p>
          <p className="user-name" style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{user.name}</p>
        </div>
        <div className="vip-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="vip-text" style={{ fontSize: '14px', fontWeight: '600' }}>VIP{user.vipLevel}</span>
          <svg style={{ width: '32px', height: '32px', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      {/* Product Carousel - JS CONTROLLED */}
      <div className="product-carousel" ref={carouselRef}>
        <div className="product-track" ref={trackRef}>
          {allProducts.map((src, i) => (
            <div key={`${src}-${i}`} className="product-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Starting Button */}
      <div className="starting-btn-container" style={{ padding: '20px' }}>
        <button className="starting-btn" style={{
          width: '100%',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Starting (0 / 45)
        </button>
      </div>

      <BottomNav />
    </div>
  )
}