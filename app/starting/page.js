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
  'Kennethpa user wins 1,000 USD prize in the task.',
  // NEW NAMES ADDED BELOW
  'Liam user wins 55.00 USD prize in the task.',
  'Olivia user wins 88.00 USD prize in the task.',
  'Noah user wins 2,100 USD prize in the task.',
  'Emma user wins 3,200.00 USD prize in the task.',
  'Oliver user wins 66.95 USD prize in the task.',
  'Amelia user wins 500.00 USD prize in the task.',
  'Theodore user wins 490.00 USD prize in the task.',
  'Charlotte user wins 72.00 USD prize in the task.',
  'James user wins 2500.00 USD prize in the task.',
  'Mia user wins 24.00 USD prize in the task.',
  'Henry user wins 2.00 USD prize in the task.',
  'Sophia user wins 42.00 USD prize in the task.',
  'Mateo user wins 33,500.00 USD prize in the task.',
  'Isabella user wins 770.00 USD prize in the task.',
  'Elijah user wins 7,800.76 USD prize in the task.',
  'Evelyn user wins 37.00 USD prize in the task.',
  'Lucas user wins 550.00 USD prize in the task.',
  'Ava user wins 610.00 USD prize in the task.',
  'William user wins 5,000.00 USD prize in the task.',
  'Sofia user wins 88.00 USD prize in the task.',
  'Benjamin user wins 70.76 USD prize in the task.',
  'Camila user wins 870.95 USD prize in the task.',
  'Levi user wins 30.00 USD prize in the task.',
  'Harper user wins 83.00 USD prize in the task.',
  'Ezra user wins 32.00 USD prize in the task.',
  'Luna user wins 200.00 USD prize in the task.',
  'Sebastian user wins 120.00 USD prize in the task.',
  'Eleanor user wins 65.64 USD prize in the task.',
  'Jack user wins 25.00 USD prize in the task.',
  'Violet user wins 900.00 USD prize in the task.',
  'Daniel user wins 90.00 USD prize in the task.',
  'Aurora user wins 41.00 USD prize in the task.',
  'Samuel user wins 780.00 USD prize in the task.',
  'Elizabeth user wins 52.00 USD prize in the task.',
  'Michael user wins 380.00 USD prize in the task.',
  'Eliana user wins 90.00 USD prize in the task.',
  'Grayson user wins 49.00 USD prize in the task.',
  'Hazel user wins 4,070.00 USD prize in the task.',
  'Ethan user wins 210.00 USD prize in the task.',
  'Chloe user wins 150.00 USD prize in the task.',
  'Asher user wins 679.00 USD prize in the task.',
  'Ellie user wins 40.00 USD prize in the task.',
  'John user wins 51.00 USD prize in the task.',
  'Nora user wins 88.00 USD prize in the task.',
  'Hudson user wins 40.00 USD prize in the task.',
  'Gianna user wins 32.00 USD prize in the task.',
  'Lucas user wins 40,700 USD prize in the task.',
  'Lily user wins 66.00 USD prize in the task.',
  'Leo user wins 1,330.00 USD prize in the task.',
  'Emily user wins 740.81 USD prize in the task.',
  'Elias user wins 27,400.00 USD prize in the task.',
  'Aria user wins 49.00 USD prize in the task.',
  'Kai user wins 2,000.00 USD prize in the task.',
  'Scarlett user wins 980.00 USD prize in the task.',
  'Theo user wins 77.00 USD prize in the task.',
  'Willow user wins 41.00 USD prize in the task.',
  'Owen user wins 54.00 USD prize in the task.',
  'Penelope user wins 122.90 USD prize in the task.',
  'Alexander user wins 32.00 USD prize in the task.',
  'Zoe user wins 80.00 USD prize in the task.',
  'Dylan user wins 7,450.00 USD prize in the task.',
  'Ella user wins 88.00 USD prize in the task.',
  'Gabriel user wins 80.00 USD prize in the task.',
  'Avery user wins 74.00 USD prize in the task.',
  'Santiago user wins 85.00 USD prize in the task.',
  'Elena user wins 15.00 USD prize in the task.',
  'Mason user wins 32,000.00 USD prize in the task.',
  'Abigail user wins 320.00 USD prize in the task.',
  'Julian user wins 8,899.00 USD prize in the task.',
  'Mila user wins 20.98 USD prize in the task.',
  'David user wins 26,500.98 USD prize in the task.',
  'Lucy user wins 73.00 USD prize in the task.',
  'Joseph user wins 200.00 USD prize in the task.',
  'Isla user wins 88.00 USD prize in the task.',
  'Carter user wins 1,550.31 USD prize in the task.',
  'Ivy user wins 94.00 USD prize in the task.',
  'Matthew user wins 400.00 USD prize in the task.',
  'Layla user wins 400.15 USD prize in the task.',
  'Luke user wins 96.00 USD prize in the task.',
  'Delilah user wins 88.00 USD prize in the task.',
  'Aiden user wins 430.00 USD prize in the task.',
  'Riley user wins 81.00 USD prize in the task.',
  'Jackson user wins 30.00 USD prize in the task.',
  'Lainey user wins 25,000.00 USD prize in the task.',
  'Maverick user wins 6,420.00 USD prize in the task.',
  'Nova user wins 300.00 USD prize in the task.',
  'Miles user wins 59,500.00 USD prize in the task.',
  'Grace user wins 6,100.00 USD prize in the task.',
  'Wattle user wins 7,200.00 USD prize in the task.',
  'Goldie user wins 41.00 USD prize in the task.',
  'Thompson user wins 52.00 USD prize in the task.',
  'Winter user wins 31.00 USD prize in the task.',
  'Isaac user wins 36.00 USD prize in the task.',
  'Arabella user wins 7,200 USD prize in the task.',
  'Josiah user wins 22.00 USD prize in the task.',
  'Anastasia user wins 5000.00 USD prize in the task.',
  'Hugo user wins 85.00 USD prize in the task.',
  'Myla user wins 4,900.00 USD prize in the task.',
  'Arthur user wins 8,600.00 USD prize in the task.',
  'Leah user wins 73.00 USD prize in the task.'
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
    <>
      <AppHeader />

      <div className="starting-wrapper" style={{
        paddingTop: 0,
        paddingBottom: '90px',
        marginTop: 0
      }}>
        {/* Marquee Bar - ATTACHED TO 64PX HEADER */}
        <div className="marquee-container" style={{
          margin: 0,
          marginTop: '64px',
          padding: 0,
          background: '#cc0000',
          overflow: 'hidden'
        }}>
          <div className="marquee-content" style={{
            display: 'flex',
            animation: 'scroll 2s linear infinite', /* faster for more names */
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
        <div className="user-bar" style={{ marginTop: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        {/* Starting Button - RED WITH TEXT */}
        <div className="starting-btn-container" style={{ padding: '20px' }}>
          <button className="starting-btn" style={{
            width: '100%',
            background: '#cc0000',
            color: '#000',
            border: 'none',
            borderRadius: '25px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Starting (0 / 45)
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  )
}