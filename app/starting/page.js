'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Mock user data - replace with your auth/session data
const user = {
  name: 'Louis', // Replace with actual username from DB
  vipLevel: 2 // Replace with actual VIP level, 0 if none
}

// Rotating winner messages
const winnerMessages = [
  'John56 user wins 102.00 USD prize in the task.',
  'Rebella26 user wins 256.00 USD prize in the task.',
  'Davidma user wins 77.00 USD prize in the task.',
  'Venuezel user wins 88.00 USD prize in the task.',
  'Kennethpa user wins 1,000 USD prize in the task.'
]

export default function StartingPage() {
  const productScrollerRef = useRef(null)
  const marqueeRef = useRef(null)
  const [products, setProducts] = useState([])

  // Load 30 product images
  useEffect(() => {
    const imageList = []
    for (let i = 1; i <= 30; i++) {
      imageList.push(`/image${i}.jpg`) // using image1.jpg format you mentioned
    }
    setProducts(imageList)
  }, [])

  // Auto-scroll products left
  useEffect(() => {
    const scroller = productScrollerRef.current
    if (!scroller || products.length === 0) return
    
    let animationId
    let scrollPos = 0
    
    const animate = () => {
      scrollPos += 0.8 // Speed - matches your video
      if (scrollPos >= scroller.scrollWidth / 2) {
        scrollPos = 0
      }
      scroller.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [products])

  // Auto-scroll marquee text
  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return
    
    let animationId
    let scrollPos = 0
    
    const animate = () => {
      scrollPos += 0.5
      if (scrollPos >= marquee.scrollWidth / 2) {
        scrollPos = 0
      }
      marquee.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  const allProducts = [...products, ...products]
  const allMessages = [...winnerMessages, ...winnerMessages]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - White background */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <Image 
          src="/logo.png" 
          alt="Disruptive Logo" 
          width={120} 
          height={40}
          className="h-8 w-auto"
        />
        <div className="flex items-center gap-3">
          <button className="bg-[#FF6B00] text-white px-5 py-2 rounded-md font-medium text-sm">
            Contact
          </button>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </header>

      {/* Red Marquee Bar */}
      <div className="bg-[#FF4D00] py-2 overflow-hidden">
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap overflow-x-hidden"
        >
          {allMessages.map((msg, i) => (
            <span 
              key={i} 
              className="text-black font-medium text-sm px-8"
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* User Info Bar - White background */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-black">Hello,</p>
          <p className="text-2xl font-bold text-[#FF6B00]">{user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#FF6B00]">
            VIP{user.vipLevel}
          </span>
          {user.vipLevel === 0 ? (
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ) : (
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Black Product Section */}
      <div className="bg-black flex-1 py-8 overflow-hidden">
        <div 
          ref={productScrollerRef}
          className="flex gap-4 overflow-x-hidden px-4"
        >
          {allProducts.map((src, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-44 h-44 md:w-56 md:h-56 bg-white rounded-lg p-3"
            >
              <img 
                src={src} 
                alt={`Product ${i % 30 + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}