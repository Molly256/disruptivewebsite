'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '64px' }}>
      <AppHeader />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: '#F1F1F1', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' }}>← Back</button>
        
        <h1 style={{ fontSize: '28px', fontWeight: '900', textAlign: 'center', marginBottom: '24px', letterSpacing: '2px' }}>ABOUT</h1>

        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#222' }}>
          <h3 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '12px' }}>WHAT WE DO</h3>
          
          <p style={{ marginBottom: '16px' }}>
            Disruptive is a technology-driven growth marketing firm driven by an exceptional team of consulting marketers, creatives, analysts, and technologists. We drive revenue growth and brand awareness for merchants at ecommerce companies around the world (such as Shopify, Amazon, eBay, and Etsy)
          </p>
          <p style={{ marginBottom: '16px' }}>
            Marketing is no longer about a singular offer or what your brand presents visually. It's a sprawling journey with countless touch points
          </p>
          <p style={{ marginBottom: '16px' }}>
            Consumers shop with their values and gravitate towards brands they trust. They want to be a part of a tribe. A story. What's more, the path to purchase needs to be fast, frictionless and personable
          </p>
          <p style={{ marginBottom: '16px' }}>
            The media landscape is vastly different, too. Measurement is smarter but also harder than ever
          </p>
          <p style={{ marginBottom: '24px' }}>
            Marketing should be a strategic business driver, a road that leads to profitable revenue growth and brand lift
          </p>

          <img 
            src="/aboutimage.jpg" 
            alt="About Disruptive" 
            onError={(e) => e.target.style.display = 'none'}
            style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '24px', display: 'block' }} 
          />

          <p style={{ fontWeight: '800', marginTop: '20px', textAlign: 'center' }}>The final right of interpretation belongs to Disruptive.</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', paddingBottom: '80px', textAlign: 'center' }}>Copyrights 2026 © Disruptive Advertising Agency</p>
        </div>
      </div>
    </div>
  )
}