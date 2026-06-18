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

      {/* HERO VIDEO */}
      <section style={{ position: 'relative', height: 'calc(100vh - 80px)', width: '100%', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline preload="auto" style={{
          position: 'absolute', top: '50%', left: '50%', minWidth: '100%', minHeight: '100%',
          transform: 'translate(-50%, -50%)', zIndex: 0, objectFit: 'cover'
        }}>
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 1 }}></div>
      </section>

      {/* TEXT SECTION BELOW VIDEO */}
      <section style={{ padding: '100px 20px', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            color: '#d40000', 
            fontSize: '42px', 
            fontWeight: '900', 
            lineHeight: '1.2',
            marginBottom: '25px'
          }}>
            Most Marketing Budgets Are Wasted—Let’s Fix That
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

          {/* RED CTA BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

            {/* AWARD LOGO */}
            <img 
              src="/award.png" 
              alt="Award Logo"
              style={{ 
                width: '200px', 
                height: '200px',
                objectFit: 'contain',
                marginBottom: '30px'
              }} 
            />
          </div>

          {/* TESTIMONIAL HEADER SECTION */}
          <div style={{ marginTop: '0', textAlign: 'center' }}>
            
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

            {/* CUSTOMER IMAGE - MAN */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <img 
                src="/customer1.jpg" 
                alt="Customer Photo"
                style={{ 
                  width: '160px', 
                  height: '160px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} 
              />
            </div>

            {/* TESTIMONIAL CONTENT - DIDER */}
            <div style={{ 
              marginTop: '30px', 
              textAlign: 'center', 
              maxWidth: '700px', 
              margin: '30px auto 80px' 
            }}>
              
              {/* 5 STARS */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '25px' }}>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
              </div>

              {/* QUOTE */}
              <p style={{ 
                fontSize: '18px', 
                color: '#000', 
                fontWeight: '400',
                lineHeight: '1.7',
                marginBottom: '25px'
              }}>
                "We are a unique company with unique solutions, so having a flexible, receptive, & knowledgeable partner is crucial to us achieving our goals."
              </p>

              {/* NAME & TITLE */}
              <p style={{ 
                fontSize: '16px', 
                color: '#000', 
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '0'
              }}>
                DIDER BIZIMUNGU, MATTERPORT, PAID<br />
                MEDIA DIRECTOR
              </p>
            </div>

            {/* CUSTOMER IMAGE - LADY */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <img 
                src="/customer2.jpg" 
                alt="Customer Photo"
                style={{ 
                  width: '160px', 
                  height: '160px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} 
              />
            </div>

            {/* TESTIMONIAL CONTENT - MAGGIE LI */}
            <div style={{ 
              marginTop: '30px', 
              textAlign: 'center', 
              maxWidth: '700px', 
              margin: '30px auto 80px' 
            }}>
              
              {/* 5 STARS */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '25px' }}>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
              </div>

              {/* QUOTE */}
              <p style={{ 
                fontSize: '18px', 
                color: '#000', 
                fontWeight: '400',
                lineHeight: '1.7',
                marginBottom: '25px'
              }}>
                "The workflow between our teams is seamless and based on mutual trust and communication. The team at DA is really knowledgeable."
              </p>

              {/* NAME & TITLE */}
              <p style={{ 
                fontSize: '16px', 
                color: '#000', 
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '0'
              }}>
                MAGGIE LI, GROWTH MARKETING<br />
                MANAGER, MYHEALTHTEAMS
              </p>

            </div>

            {/* CUSTOMER IMAGE - KAILI SPEAR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <img 
                src="/customer3.jpg" 
                alt="Customer Photo"
                style={{ 
                  width: '200px', 
                  height: '200px',
                  borderRadius: '60%',
                  objectFit: 'cover'
                }} 
              />
            </div>

            {/* TESTIMONIAL CONTENT - KAILI SPEAR */}
            <div style={{ 
              marginTop: '30px', 
              textAlign: 'center', 
              maxWidth: '700px', 
              margin: '30px auto 80px' 
            }}>
              
              {/* 5 STARS */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '25px' }}>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
                <span style={{ color: '#000', fontSize: '22px' }}>★</span>
              </div>

              {/* QUOTE */}
              <p style={{ 
                fontSize: '18px', 
                color: '#000', 
                fontWeight: '400',
                lineHeight: '1.7',
                marginBottom: '25px'
              }}>
                "They started getting results quickly and the
leads are already moving through the funnel.
We are super happy."
              </p>

              {/* NAME & TITLE */}
              <p style={{ 
                fontSize: '16px', 
                color: '#000', 
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '0'
              }}>
                KAILI SPEAR, MARKETING MANAGER,
                GROW.COM
              </p>

              {/* RED BAR */}
              <div style={{ 
                width: '100%', 
                height: '6px', 
                background: 'linear-gradient(90deg, #d40000 0%, #b30000 100%)',
                marginTop: '40px'
              }}></div>                                                                                                                         
            </div>

            {/* STATS SECTION */}
            <section style={{ 
              background: '#1a1a1a', 
              padding: '80px 20px',
              marginTop: '40px',
              textAlign: 'center',
              color: '#fff'
            }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* 4.8 Rating */}
                <div style={{ marginBottom: '60px' }}>
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

                {/* 90+ Clients */}
                <div style={{ marginBottom: '60px' }}>
                  <img 
                    src="/authen.png" 
                    alt="Handshake icon"
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      margin: '0 auto 20px auto',
                      objectFit: 'contain',
                      filter: 'invert(1) brightness(2)'
                    }} 
                  />
                  <h3 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0' }}>90+</h3>
                  <p style={{ fontSize: '18px', fontWeight: '400', margin: '0', lineHeight: '1.5' }}>
                    Clients with us for 4<br />years or more
                  </p>
                </div>

                {/* 160+ Employees */}
                <div>
                  <img 
                    src="/svg2.png" 
                    alt="People icon"
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      margin: '0 auto 20px auto',
                      objectFit: 'contain',
                      filter: 'invert(1) brightness(2)'
                    }} 
                  />
                  <h3 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0' }}>160+</h3>
                  <p style={{ fontSize: '18px', fontWeight: '400', margin: '0', lineHeight: '1.5' }}>
                    Employees aligned with<br />our mission
                  </p>
                </div>

              </div>
            </section>
          </div>
        </div>
      </section>

    </main>
  )
}