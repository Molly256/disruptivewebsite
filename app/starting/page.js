'use client'
import { useEffect, useState, useRef } from 'react'

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

      const gap = 24
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
        const isInHoldPhase = progressMs >= SCROLL_TIME // Only zoom after 1.0s slide ends
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
          // We're in the 1.0s slide phase
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
    <div className="starting-wrapper">

      {/* Marquee Bar */}
      <div className="marquee-container">
        <div className="marquee-content">
          {allMessages.map((msg, i) => (
            <span key={i} className="marquee-item">{msg}</span>
          ))}
        </div>
      </div>

      {/* User Bar */}
      <div className="user-bar">
        <div>
          <p className="user-greeting">Hello,</p>
          <p className="user-name">{user.name}</p>
        </div>
        <div className="vip-badge">
          <span className="vip-text">VIP{user.vipLevel}</span>
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
      <div className="starting-btn-container">
        <button className="starting-btn">
          Starting (0 / 45)
        </button>
      </div>

    </div>
  )
}