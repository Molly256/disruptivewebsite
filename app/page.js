'use client'
import { useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main style={{ background: '#fff', color: '#000', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 100,
        height: '80px'
      }}>
        <div style={{ maxWidth: '200px', height: '45px', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Disruptive Logo" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
          />
        </div>

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
          aria-label="Menu"
        >
          {menuOpen ? (
            <div style={{ fontSize: '40px', color: '#000', lineHeight: 1, fontWeight: '300' }}>×</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ width: '32px', height: '3px', background: '#000' }}></div>
              <div style={{ width: '32px', height: '3px', background: '#000' }}></div>
              <div style={{ width: '32px', height: '3px', background: '#000' }}></div>
            </div>
          )}
        </button>
      </header>

      {/* FULL PAGE MENU */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          background: '#fff',
          zIndex: 99,
          padding: '60px 40px',
          overflowY: 'auto'
        }}>
          <nav style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '45px' }}>
              <div onClick={() => toggleDropdown('what')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#000', letterSpacing: '1px' }}>WHAT WE DO</span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#d40000',
                  fontWeight: '300',
                  transform: openDropdown === 'what' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s'
                }}>⌄</span>
              </div>
              {openDropdown === 'what' && (
                <div style={{ marginTop: '25px' }}>
                  {['All Services','Paid Search','Paid Social','SEO','Amazon','Lifecycle Marketing','CRO','Creative','Data Analytics','Lead Generation'].map((item) => (
                    <div key={item} onClick={() => scrollTo('what-we-do')} style={{
                      fontSize: '20px', color: '#333', fontWeight: '300', cursor: 'pointer', margin: '18px 0', paddingLeft: '10px'
                    }}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '45px' }}>
              <div onClick={() => toggleDropdown('who')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#000', letterSpacing: '1px' }}>WHO WE HELP</span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#d40000',
                  fontWeight: '300',
                  transform: openDropdown === 'who' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s'
                }}>⌄</span>
              </div>
              {openDropdown === 'who' && (
                <div style={{ marginTop: '25px' }}>
                  {['B2B','B2C','eCommerce','Local','Garage Door','SaaS','Online Education','Outdoor Sporting Goods','High AOV Brands'].map((item) => (
                    <div key={item} onClick={() => scrollTo('who-we-help')} style={{
                      fontSize: '20px', color: '#333', fontWeight: '300', cursor: 'pointer', margin: '18px 0', paddingLeft: '10px'
                    }}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            <div onClick={() => scrollTo('results')} style={{
              fontSize: '28px', fontWeight: '700', color: '#000', cursor: 'pointer', marginBottom: '45px', letterSpacing: '1px'
            }}>
              RESULTS
            </div>

            <div style={{ marginBottom: '45px' }}>
              <div onClick={() => toggleDropdown('about')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#000', letterSpacing: '1px' }}>WHO WE ARE</span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#d40000',
                  fontWeight: '300',
                  transform: openDropdown === 'about' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s'
                }}>⌄</span>
              </div>
              {openDropdown === 'about' && (
                <div style={{ marginTop: '25px' }}>
                  {['About Us','Why Disruptive','Meet Our Team','Our Mission','Giving Back','Careers'].map((item) => (
                    <div key={item} onClick={() => scrollTo('who-we-are')} style={{
                      fontSize: '20px', color: '#333', fontWeight: '300', cursor: 'pointer', margin: '18px 0', paddingLeft: '10px'
                    }}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div onClick={() => toggleDropdown('resources')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#000', letterSpacing: '1px' }}>RESOURCES</span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#d40000',
                  fontWeight: '300',
                  transform: openDropdown === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s'
                }}>⌄</span>
              </div>
              {openDropdown === 'resources' && (
                <div style={{ marginTop: '25px' }}>
                  {['General','Blog','Partners','Webinars/Trainings','Reviews','Contact Us'].map((item) => (
                    <div key={item} onClick={() => scrollTo('resources')} style={{
                      fontSize: '20px', color: '#333', fontWeight: '300', cursor: 'pointer', margin: '18px 0', paddingLeft: '10px'
                    }}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => scrollTo('contact-us')} style={{
              marginTop: '20px',
              padding: '18px 40px',
              background: 'linear-gradient(180deg, #e60000 0%, #b30000 100%)',
              color: '#fff', border: 'none',
              fontSize: '16px', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer'
            }}>
              LET'S TALK
            </button>
          </nav>
        </div>
      )}

      {/* HERO VIDEO UP - FULL SCREEN */}
      <section style={{ position: 'relative', height: 'calc(100vh - 80px)', width: '100%', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline preload="auto" style={{
          position: 'absolute', top: '50%', left: '50%', minWidth: '100%', minHeight: '100%',
          transform: 'translate(-50%, -50%)', zIndex: 0, objectFit: 'cover'
        }}>
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
      </section>

      {/* DOWN VIDEO DIRECTLY BELOW - SMALLER HEIGHT LIKE BANNER */}
      <section style={{ position: 'relative', height: '40vh', width: '100%', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline preload="auto" style={{
          position: 'absolute', top: '50%', left: '50%', minWidth: '100%', minHeight: '100%',
          transform: 'translate(-50%, -50%)', zIndex: 0, objectFit: 'cover'
        }}>
          <source src="/videos/down-video.mp4" type="video/mp4" />
        </video>
      </section>

      {/* TEXT SECTION BELOW VIDEO - HORIZONTAL ON DESKTOP */}
      <section className="content-section" id="what-we-do">
        <div className="content-wrapper">
          <div className="content-text">
            <h3 style={{ 
              color: '#d40000', 
              fontSize: '20px', 
              fontWeight: '700', 
              letterSpacing: '1px',
              marginBottom: '20px'
            }}>
              TOP REVIEWED AGENCY IN THE USA | NO STRINGS ATTACHED AUDIT
            </h3>

            <h2 style={{ 
              color: '#000', 
              fontSize: '42px', 
              fontWeight: '900', 
              lineHeight: '1.2',
              marginBottom: '25px'
            }}>
              Most Marketing Budgets Are Wasted—Let’s Fix <span style={{ 
                borderBottom: '4px solid #d40000',
                paddingBottom: '4px',
                display: 'inline-block'
              }}>That</span>
            </h2>

            <p style={{ 
              color: '#333', 
              fontSize: '18px', 
              fontWeight: '300', 
              lineHeight: '1.8',
              marginBottom: '40px'
            }}>
              After thousands of audits, we’ve found that 76% of marketing spend goes to waste. We’ll show you where yours is leaking—and how to fix it fast.
            </p>

            <button 
              onClick={() => scrollTo('contact-us')}
              style={{ 
                width: 'fit-content',
                padding: '18px 32px',
                background: 'linear-gradient(180deg, #e60000 0%, #b30000 100%)',
                color: '#fff', 
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px', 
                fontWeight: '700', 
                letterSpacing: '2px', 
                cursor: 'pointer',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                marginBottom: '30px'
              }}
            >
              GET YOUR FREE MARKETING AUDIT
            </button>

            {/* Rating Bar + HUNDREDS OF CLUTCH REVIEWS - 0px gap, starts immediately under button */}
            <section style={{ 
              background: '#000',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              padding: '80px 20px',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle curved white line graphic */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '200px',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 5 white stars centered */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                  <span style={{ color: '#fff', fontSize: '32px' }}>★</span>
                  <span style={{ color: '#fff', fontSize: '32px' }}>★</span>
                  <span style={{ color: '#fff', fontSize: '32px' }}>★</span>
                  <span style={{ color: '#fff', fontSize: '32px' }}>★</span>
                  <span style={{ color: '#fff', fontSize: '32px' }}>★</span>
                </div>

                {/* Text: AVG. RATING OF 4.8/ 5.0 STARS ON CLUTCH! */}
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  marginBottom: '60px'
                }}>
                  AVG. RATING OF 4.8/ 5.0 STARS ON CLUTCH!
                </p>

                {/* Main heading: HUNDREDS OF CLUTCH REVIEWS */}
                <h2 style={{ 
                  fontSize: '48px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  margin: 0
                }}>
                  HUNDREDS OF CLUTCH REVIEWS
                </h2>
              </div>
            </section>
          </div>

          <div className="content-image">
            <img 
              src="/award.png" 
              alt="Award Logo"
              style={{ 
                width: '100%', 
                height: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL HEADER SECTION */}
      <section className="content-section" id="who-we-help">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* 5 STARS */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#000', fontSize: '24px' }}>★</span>
            <span style={{ color: '#000', fontSize: '24px' }}>★</span>
            <span style={{ color: '#000', fontSize: '24px' }}>★</span>
            <span style={{ color: '#000', fontSize: '24px' }}>★</span>
            <span style={{ color: '#000', fontSize: '24px' }}>★</span>
          </div>

          {/* SUBTEXT */}
          <p style={{ 
            fontSize: '18px', 
            color: '#000', 
            fontWeight: '400',
            marginBottom: '25px'
          }}>
            Loved by Business Owners & Marketers
          </p>

          {/* HEADER */}
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: '900', 
            color: '#000',
            lineHeight: '1.2',
            marginBottom: '40px'
          }}>
            WHAT <span style={{ 
              borderBottom: '3px solid #d40000',
              paddingBottom: '2px',
              display: 'inline-block'
            }}>MARKETERS SAY</span><br />
            ABOUT DISRUPTIVE
          </h2>
        </div>

        {/* TESTIMONIALS - 3 COLUMNS HORIZONTAL LINE DESKTOP */}
        <div style={{ 
          display: 'flex', 
          gap: '60px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '60px'
        }}>
          
          {/* DIDER COLUMN */}
          <div style={{ flex: '1 1 280px', maxWidth: '320px', textAlign: 'center' }}>
            <img 
              src="/customer1.jpg" 
              alt="Dider"
              style={{ 
                width: '200px', 
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto 25px auto'
              }} 
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
            </div>
            <p style={{ 
              fontSize: '16px', 
              color: '#000', 
              fontWeight: '400',
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              "We are a unique company with unique solutions, so having a flexible, receptive, & knowledgeable partner is crucial to us achieving our goals."
            </p>
            <p style={{ 
              fontSize: '13px', 
              color: '#000', 
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0'
            }}>
              DIDER BIZIMUNGU<br />MATTERPORT, PAID MEDIA DIRECTOR
            </p>
          </div>

          {/* MAGGIE COLUMN */}
          <div style={{ flex: '1 1 280px', maxWidth: '320px', textAlign: 'center' }}>
            <img 
              src="/customer2.jpg" 
              alt="Maggie"
              style={{ 
                width: '200px', 
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto 25px auto'
              }} 
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
            </div>
            <p style={{ 
              fontSize: '16px', 
              color: '#000', 
              fontWeight: '400',
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              "The workflow between our teams is seamless and based on mutual trust and communication. The team at DA is really knowledgeable."
            </p>
            <p style={{ 
              fontSize: '13px', 
              color: '#000', 
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0'
            }}>
              MAGGIE LI<br />GROWTH MARKETING MANAGER, MYHEALTHTEAMS
            </p>
          </div>

          {/* KAILI COLUMN */}
          <div style={{ flex: '1 1 280px', maxWidth: '320px', textAlign: 'center' }}>
            <img 
              src="/customer3.jpg" 
              alt="Kaili"
              style={{ 
                width: '200px', 
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto 25px auto'
              }} 
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
              <span style={{ color: '#000', fontSize: '20px' }}>★</span>
            </div>
            <p style={{ 
              fontSize: '16px', 
              color: '#000', 
              fontWeight: '400',
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              "They started getting results quickly and the leads are already moving through the funnel. We are super happy."
            </p>
            <p style={{ 
              fontSize: '13px', 
              color: '#000', 
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0'
            }}>
              KAILI SPEAR<br />MARKETING MANAGER, GROW.COM
            </p>
          </div>
        </div>
      </section>

      {/* RED BAR - FULL WIDTH */}
      <div style={{ 
        width: '100vw', 
        height: '6px', 
        background: 'linear-gradient(90deg, #d40000 0%, #b30000 100%)',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: '80px'
      }}></div>

      {/* STATS SECTION - FLAT LIKE 4.8 RATING */}
      <section style={{ 
        background: '#141414', 
        padding: '0',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: '0',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
          
          {/* 4.8 Rating */}
          <div style={{ padding: '80px 0 60px 0' }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#fff', fontSize: '28px' }}>☆</span>
              <span style={{ color: '#fff', fontSize: '28px' }}>☆</span>
              <span style={{ color: '#fff', fontSize: '28px' }}>☆</span>
              <span style={{ color: '#fff', fontSize: '28px' }}>☆</span>
              <span style={{ color: '#fff', fontSize: '28px' }}>☆</span>
            </div>
            
            <h3 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0' }}>4.8</h3>
            <p style={{ fontSize: '18px', fontWeight: '400', margin: '0', lineHeight: '1.5' }}>
              Average rating from<br />350+ reviews on Clutch
            </p>
          </div>

          {/* SINGLE IMAGE - SVG8 - HORIZONTAL CONTAINER */}
          <div className="content-wrapper" style={{ padding: '0 20px 80px' }}>
            <div className="content-image" style={{ maxWidth: '100%' }}>
              <img 
                src="/svg8.png" 
                style={{ 
                  width: '100%', 
                  maxWidth: '1600px',
                  height: 'auto', 
                  display: 'block', 
                  margin: '0 auto', 
                  padding: 0 
                }} 
              />
            </div>
          </div>

        </div>
      </section>

      {/* Risk-Free Guarantee Section - Image 1 style: gradient button, 2-line heading, RISK-FREE red bold + GUARANTEE black normal */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          
          {/* Header: RISK-FREE red bold, GUARANTEE black normal */}
          <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            <span style={{ color: '#d40000', fontWeight: '700' }}>RISK-FREE</span>
            <span style={{ color: '#000', fontWeight: '400' }}> GUARANTEE</span>
          </p>
          
          {/* Main heading: 2 lines with em dash */}
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#000', lineHeight: '1.2', marginBottom: '16px' }}>
            Get Results in 90 Days—<br />
            Or You Don’t Pay
          </h2>
          
          {/* Red underline */}
          <div style={{ width: '48px', height: '2px', background: '#d40000', marginBottom: '32px' }}></div>
          
          {/* Bold subtext */}
          <p style={{ fontWeight: '700', color: '#000', marginBottom: '16px' }}>
            Most Agencies Guess. We Audit, Prove, and Guarantee.
          </p>
          
          {/* Body text */}
          <p style={{ color: '#333', marginBottom: '24px', lineHeight: '1.6' }}>
            Our free marketing audit is your first step to identifying wasted spend and missed opportunities. 
            Whether you hire us or not, you’ll walk away with a clear roadmap to grow faster and smarter.
          </p>
          
          {/* Underlined text */}
          <p style={{ color: '#333', marginBottom: '32px', lineHeight: '1.6' }}>
            <span style={{ textDecoration: 'underline' }}>For qualifying brands</span>, we guarantee measurable growth within 90 days—or your money back. 
            No fluff. No long-term contracts. Just real results.
          </p>
          
          {/* Gradient button - arrow below text, left aligned */}
          <button 
            onClick={() => scrollTo('contact-us')}
            style={{ 
              background: 'linear-gradient(180deg, #e60000 0%, #b30000 100%)', 
              color: '#fff', 
              fontWeight: '700', 
              padding: '18px 32px', 
              borderRadius: '4px', 
              border: 'none',
              fontSize: '16px',
              letterSpacing: '2px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px'
            }}
          >
            <span>GET YOUR FREE MARKETING AUDIT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          
        </div>
      </section>

    </main>
  )
}