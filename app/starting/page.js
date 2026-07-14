'use client'
import { useEffect, useRef, useState } from 'react'

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

export default function StartingPage() {
  const productScrollerRef = useRef(null)
  const [products, setProducts] = useState([])
  const user = useUser()

  useEffect(() => {
    const imageList = []
    for (let i = 1; i <= 30; i++) {
      imageList.push(`/image${i}.jpg`)
    }
    setProducts(imageList)
  }, [])

  // Nonstop auto-scroll + center zoom
  useEffect(() => {
    const scroller = productScrollerRef.current
    if (!scroller || products.length === 0) return

    let animationId

    const autoScroll = () => {
      scroller.scrollLeft += 0.7
      
      // Reset at 1/3 since we tripled the array
      if (scroller.scrollLeft >= scroller.scrollWidth / 3) {
        scroller.scrollLeft = 0
      }

      // Update center zoom
      const items = scroller.querySelectorAll('.product-item')
      const scrollerCenter = scroller.scrollLeft + scroller.offsetWidth / 2

      items.forEach((item) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2
        const distance = Math.abs(scrollerCenter - itemCenter)

        if (distance < item.offsetWidth / 2) {
          item.classList.add('active')
        } else {
          item.classList.remove('active')
        }
      })

      animationId = requestAnimationFrame(autoScroll)
    }

    animationId = requestAnimationFrame(autoScroll)

    return () => cancelAnimationFrame(animationId)
  }, [products])

  const allProducts = [...products, ...products, ...products]
  const allMessages = [...winnerMessages, ...winnerMessages]

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

      {/* Product Carousel - CENTER ZOOM */}
      <div className="product-carousel">
        <div ref={productScrollerRef} className="product-scroller">
          {allProducts.map((src, i) => (
            <div key={i} className="product-item">
              <img
                src={src}
                alt={`Product ${i % 30 + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}