'use client'
export default function Home(){
  const scrollTo=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  return(
    <main style={{background:'#fff',color:'#000',minHeight:'100vh'}}>
      <style jsx>{`
        .down-video {
          height: 10vh;
        }
        @media (min-width: 768px) {
          .down-video {
            height: 20vh;
          }
        }
      `}</style>
      
      {/* HERO VIDEO */}
      <section style={{position:'relative',height:'calc(100vh - 200px)',width:'100%',overflow:'hidden'}}>
        <video autoPlay muted loop playsInline preload="auto" style={{position:'absolute',top:'50%',left:'50%',minWidth:'100%',minHeight:'100%',transform:'translate(-50%, -50%)',zIndex:0,objectFit:'cover'}}>
          <source src="/videos/hero-video.mp4" type="video/mp4"/>
        </video>
      </section>

      {/* DOWN VIDEO - 10VH MOBILE, 20VH DESKTOP */}
      <section className="down-video" style={{position:'relative',width:'100%',overflow:'hidden'}}>
        <video autoPlay muted loop playsInline preload="auto" style={{position:'absolute',top:'50%',left:'50%',minWidth:'100%',minHeight:'100%',transform:'translate(-50%, -50%)',zIndex:0,objectFit:'cover'}}>
          <source src="/videos/down-video.mp4" type="video/mp4"/>
        </video>
      </section>

      <section className="content-section" id="what-we-do">
        <div className="content-wrapper">
          <div className="content-text">
            <h3 style={{color:'#d40000',fontSize:'20px',fontWeight:'700',letterSpacing:'1px',marginBottom:'20px'}}>TOP REVIEWED AGENCY IN THE USA | NO STRINGS ATTACHED AUDIT</h3>
            <h2 style={{color:'#000',fontSize:'42px',fontWeight:'900',lineHeight:'1.2',marginBottom:'25px'}}>Most Marketing Budgets Are Wasted—Let’s Fix <span style={{borderBottom:'4px solid #d40000',paddingBottom:'4px',display:'inline-block'}}>That</span></h2>
            <p style={{color:'#333',fontSize:'18px',fontWeight:'300',lineHeight:'1.8',marginBottom:'40px'}}>After thousands of audits, we’ve found that 76% of marketing spend goes to waste. We’ll show you where yours is leaking—and how to fix it fast.</p>
            <button onClick={()=>scrollTo('contact-us')} style={{width:'fit-content',padding:'18px 32px',background:'linear-gradient(180deg, #e60000 0%, #b30000 100%)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'16px',fontWeight:'700',letterSpacing:'2px',cursor:'pointer',textTransform:'uppercase',whiteSpace:'nowrap',marginBottom:'30px'}}>GET YOUR FREE MARKETING AUDIT</button>
          </div>
          <div className="content-image">
            <img src="/award.png" alt="Award Logo" style={{width:'100%',height:'auto',objectFit:'contain'}}/>
          </div>
        </div>
      </section>

      <section className="content-section" id="who-we-help">
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'flex',gap:'4px',justifyContent:'center',marginBottom:'15px'}}>
            <span style={{color:'#000',fontSize:'24px'}}>★</span><span style={{color:'#000',fontSize:'24px'}}>★</span><span style={{color:'#000',fontSize:'24px'}}>★</span><span style={{color:'#000',fontSize:'24px'}}>★</span><span style={{color:'#000',fontSize:'24px'}}>★</span>
          </div>
          <p style={{fontSize:'18px',color:'#000',fontWeight:'400',marginBottom:'25px'}}>Loved by Business Owners & Marketers</p>
          <h2 style={{fontSize:'42px',fontWeight:'900',color:'#000',lineHeight:'1.2',marginBottom:'40px'}}>WHAT <span style={{borderBottom:'3px solid #d40000',paddingBottom:'2px',display:'inline-block'}}>MARKETERS SAY</span><br/>ABOUT DISRUPTIVE</h2>
        </div>
        <div style={{display:'flex',gap:'60px',flexWrap:'wrap',justifyContent:'center',marginTop:'60px'}}>
          <div style={{flex:'1 1 280px',maxWidth:'320px',textAlign:'center'}}>
            <img src="/customer1.jpg" alt="Dider" style={{width:'200px',height:'200px',borderRadius:'50%',objectFit:'cover',display:'block',margin:'0 auto 25px auto'}}/>
            <div style={{display:'flex',gap:'6px',justifyContent:'center',marginBottom:'15px'}}>
              <span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span>
            </div>
            <p style={{fontSize:'16px',color:'#000',fontWeight:'400',lineHeight:'1.6',marginBottom:'15px'}}>"We are a unique company with unique solutions, so having a flexible, receptive, & knowledgeable partner is crucial to us achieving our goals."</p>
            <p style={{fontSize:'13px',color:'#000',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'0'}}>DIDER BIZIMUNGU<br/>MATTERPORT, PAID MEDIA DIRECTOR</p>
          </div>
          <div style={{flex:'1 1 280px',maxWidth:'320px',textAlign:'center'}}>
            <img src="/customer2.jpg" alt="Maggie" style={{width:'200px',height:'200px',borderRadius:'50%',objectFit:'cover',display:'block',margin:'0 auto 25px auto'}}/>
            <div style={{display:'flex',gap:'6px',justifyContent:'center',marginBottom:'15px'}}>
              <span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span>
            </div>
            <p style={{fontSize:'16px',color:'#000',fontWeight:'400',lineHeight:'1.6',marginBottom:'15px'}}>"The workflow between our teams is seamless and based on mutual trust and communication. The team at DA is really knowledgeable."</p>
            <p style={{fontSize:'13px',color:'#000',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'0'}}>MAGGIE LI<br/>GROWTH MARKETING MANAGER, MYHEALTHTEAMS</p>
          </div>
          <div style={{flex:'1 1 280px',maxWidth:'320px',textAlign:'center'}}>
            <img src="/customer3.jpg" alt="Kaili" style={{width:'200px',height:'200px',borderRadius:'50%',objectFit:'cover',display:'block',margin:'0 auto 25px auto'}}/>
            <div style={{display:'flex',gap:'6px',justifyContent:'center',marginBottom:'15px'}}>
              <span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span><span style={{color:'#000',fontSize:'20px'}}>★</span>
            </div>
            <p style={{fontSize:'16px',color:'#000',fontWeight:'400',lineHeight:'1.6',marginBottom:'15px'}}>"They started getting results quickly and the leads are already moving through the funnel. We are super happy."</p>
            <p style={{fontSize:'13px',color:'#000',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'0'}}>KAILI SPEAR<br/>MARKETING MANAGER, GROW.COM</p>
          </div>
        </div>
      </section>
      
      <div style={{width:'100vw',height:'6px',background:'linear-gradient(90deg, #d40000 0%, #b30000 100%)',marginLeft:'calc(-50vw + 50%)',marginTop:'80px'}}></div>
      <section style={{background:'#141414',padding:'0',width:'100vw',marginLeft:'calc(-50vw + 50%)',marginTop:'0',textAlign:'center',color:'#fff'}}>
        <div style={{maxWidth:'1800px',margin:'0 auto'}}>
          <div style={{padding:'80px 0 60px 0'}}>
            <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'15px'}}>
              <span style={{color:'#fff',fontSize:'28px'}}>☆</span><span style={{color:'#fff',fontSize:'28px'}}>☆</span><span style={{color:'#fff',fontSize:'28px'}}>☆</span><span style={{color:'#fff',fontSize:'28px'}}>☆</span><span style={{color:'#fff',fontSize:'28px'}}>☆</span>
            </div>
            <h3 style={{fontSize:'48px',fontWeight:'900',margin:'0 0 10px 0'}}>4.8</h3>
            <p style={{fontSize:'18px',fontWeight:'400',margin:'0',lineHeight:'1.5'}}>Average rating from<br/>350+ reviews on Clutch</p>
          </div>
          <div className="content-wrapper" style={{padding:'0 20px 80px'}}>
            <div className="content-image" style={{maxWidth:'100%'}}>
              <img src="/svg8.png" style={{width:'100%',maxWidth:'1600px',height:'auto',display:'block',margin:'0 auto',padding:0}}/>
            </div>
          </div>
        </div>
      </section>
      <section style={{background:'#fff',padding:'48px 0 4px 0',width:'100vw',marginLeft:'calc(-50vw + 50%)'}}>
        <div style={{maxWidth:'768px',margin:'0 auto',padding:'0 16px'}}>
          <p style={{fontSize:'14px',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'20px'}}><span style={{color:'#d40000',fontWeight:'700'}}>RISK-FREE</span> <span style={{color:'#d40000',fontWeight:'500'}}>GUARANTEE</span></p>
          <h2 style={{fontSize:'28px',fontWeight:'900',color:'#000',lineHeight:'1.25',margin:'0 0 20px 0'}}><div>Get Results in 90 Days—</div><div>Or You Don’t Pay</div></h2>
          <div style={{width:'40px',height:'3px',background:'#d40000',marginBottom:'28px'}}></div>
          <p style={{fontWeight:'700',color:'#000',margin:'0 0 20px 0',fontSize:'16px'}}>Most Agencies Guess. We Audit, Prove, and Guarantee.</p>
          <p style={{color:'#333',margin:'0 0 20px 0',lineHeight:'1.65',fontSize:'16px'}}>Our free marketing audit is your first step to identifying wasted spend and missed opportunities. Whether you hire us or not, you'll walk away with a clear roadmap to grow faster and smarter.</p>
          <p style={{color:'#333',margin:'0 0 24px 0',lineHeight:'1.65',fontSize:'16px'}}><span style={{textDecoration:'underline'}}>For qualifying brands</span>, we guarantee measurable growth within 90 days—or your money back. No fluff. No long-term contracts. Just real results.</p>
          <button onClick={()=>scrollTo('contact-us')} style={{width:'100%',background:'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)',color:'#fff',fontWeight:'700',padding:'16px 0',borderRadius:'0',border:'none',fontSize:'16px',letterSpacing:'0.05em',cursor:'pointer',textTransform:'uppercase',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:'6px'}}>
            <span>GET YOUR FREE MARKETING AUDIT &gt;</span>
          </button>
        </div>
      </section>
      <section style={{background:'#000',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'80px 20px',paddingTop:'48px',textAlign:'center',color:'#fff',position:'relative',overflow:'hidden',marginTop:'0'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',width:'100%',height:'200px',background:'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',pointerEvents:'none'}}></div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'20px'}}>
            <span style={{color:'#fff',fontSize:'32px'}}>★</span><span style={{color:'#fff',fontSize:'32px'}}>★</span><span style={{color:'#fff',fontSize:'32px'}}>★</span><span style={{color:'#fff',fontSize:'32px'}}>★</span><span style={{color:'#fff',fontSize:'32px'}}>★</span>
          </div>
          <p style={{fontSize:'18px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'60px'}}>AVG. RATING OF 4.8/ 5.0 STARS ON CLUTCH!</p>
          <h2 style={{fontSize:'48px',fontWeight:'900',textTransform:'uppercase',letterSpacing:'2px',margin:'0 50px 0'}}>HUNDREDS OF CLUTCH REVIEWS</h2>
          <div style={{maxWidth:'500px',margin:'0 auto'}}>
            <img src="/holistic.png" alt="Holistic Reviews" style={{width:'100%',height:'auto',display:'block'}}/>
          </div>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'60px 20px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <h3 style={{fontSize:'18px',fontWeight:'300',color:'#000',letterSpacing:'0.5px',marginBottom:'12px',textTransform:'uppercase'}}>OVER $450+ MILLION IN ANNUAL MANAGED AD SPEND</h3>
          <div style={{width:'60px',height:'3px',background:'#d40000',marginBottom:'32px'}}></div>
          <h2 style={{fontSize:'36px',fontWeight:'900',color:'#000',lineHeight:'1.2',marginBottom:'32px',textTransform:'uppercase'}}>MEET DISRUPTIVE ADVERTISING: THE #1 MOST REVIEWED DIGITAL MARKETING AGENCY</h2>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'900px'}}><span style={{textDecoration:'underline'}}>Disruptive Advertising has been rated as the best performance marketing agency for authentic brands and marketers.</span> We elevate the way business is done by pairing empowered marketers with win-win minded people and brands they believe in. We envision a world where only authentic brands and marketers win.</p>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'40px 20px 16px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
          <img src="/authentic.png" alt="Authenticity" style={{width:'400px',height:'auto',margin:'0 auto 32px'}}/>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'#000',marginBottom:'20px'}}>Authenticity</h3>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'800px',margin:'0 auto'}}>We work exclusively with brands and people we believe in, ensuring our hearts and minds are fully committed to your success. Authenticity is at the core of everything we do, creating a win-win mindset that fosters value, growth, and sustainability.</p>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'16px 20px 16px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
          <img src="/toptalent.png" alt="Top Talent" style={{width:'400px',height:'auto',margin:'0 auto 36px'}}/>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'#000',marginBottom:'20px'}}>Top Talent</h3>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'800px',margin:'0 auto'}}>Our team comprises top-notch marketers who are passionate about what they do. Through our Disruptive University program, we continuously develop and retain talent that can drive real impact for your business.</p>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'16px 20px 16px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
          <img src="/strategy.png" alt="Strategy" style={{width:'400px',height:'auto',margin:'0 auto 20px'}}/>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'#000',marginBottom:'20px'}}>Strategy</h3>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'800px',margin:'0 auto'}}>We align your business goals with the right marketing strategy, ensuring every effort drives success. Our Disruptive Difference process clarifies your objectives & customer journey, then leverages data-informed decisions to help you win with each marketing channel.</p>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'16px 20px 16px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
          <img src="/breakthrough.png" alt="Breakthroughs" style={{width:'400px',height:'auto',margin:'0 auto 20px'}}/>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'#000',marginBottom:'20px'}}>Breakthroughs</h3>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'800px',margin:'0 auto'}}>We leverage the right people, tools, and technology to deliver breakthrough results. Beyond best practices and playbooks, our experts constantly innovate and find new ways to win.</p>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'16px 20px 48px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
          <img src="/exclusivity.png" alt="Exclusivity" style={{width:'400px',height:'auto',margin:'0 auto 20px'}}/>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'#000',marginBottom:'20px'}}>Exclusivity</h3>
          <p style={{fontSize:'16px',fontWeight:'400',color:'#000',lineHeight:'1.7',maxWidth:'800px',margin:'0 auto'}}>As a Disruptive partner, you gain access to exclusive relationships, content, and community. This includes collaboration with industry leaders, transformational content through Disruptive University, and opportunities to amplify your community impact through Disruptive Caring.</p>
        </div>
      </section>
      <section style={{width:'100vw',marginLeft:'calc(-50vw + 50%)',marginTop:'0',padding:'0'}}>
        <img src="/reviews.png" alt="1,000+ Reviews Award Winning Agency" style={{width:'100%',height:'auto',display:'block'}}/>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',marginTop:'0',padding:'40px 20px 0'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <p style={{color:'#d40000',fontSize:'18px',fontWeight:'500',lineHeight:'1.4',margin:'0 0 28px 0'}}>MOST AGENCIES SAY YES TO EVERYONE.<br/>WE DON'T.</p>
          <h2 style={{color:'#000',fontSize:'40px',fontWeight:'800',lineHeight:'1.15',margin:'0 0 20px 0'}}>We’re Only Taking On 10 New Clients This Month</h2>
          <div style={{width:'60px',height:'4px',background:'#d40000',marginBottom:'28px'}}></div>
          <p style={{color:'#333',fontSize:'17px',fontWeight:'400',lineHeight:'1.65',margin:'0 0 24px 0'}}>After 10,000+ audits and $1B+ managed in ad spend, we know what works—and what wastes your budget. If you’re ready to grow again, start with a no-strings-attached audit. Whether you hire us or not, you’ll walk away with a plan.</p>
          <p style={{color:'#000',fontSize:'17px',fontWeight:'700',lineHeight:'1.65',margin:'0 0 32px 0'}}>Want in? Grab your spot before they’re gone.</p>
          <button onClick={()=>scrollTo('contact-us')} style={{width:'100%',padding:'20px 24px',background:'linear-gradient(180deg, #e60000 0%, #b30000 100%)',color:'#fff',border:'none',fontSize:'16px',fontWeight:'700',letterSpacing:'0.5px',cursor:'pointer',textTransform:'uppercase',display:'flex',alignItems:'center',justifyContent:'flex-start',gap:'8px'}}>
            GET YOUR FREE MARKETING AUDIT <span style={{fontSize:'18px',fontWeight:'400'}}>›</span>
          </button>
        </div>
      </section>
      <section style={{background:'#fff',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'32px 20px 60px'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <img src="/team.jpg" style={{width:'100%',height:'auto',display:'block'}}/>
        </div>
      </section>

      {/* NEW CLIENT TIMELINE TO SUCCESS - B1 TO B6 */}
      <section style={{background:'#1A1A1A',width:'100vw',marginLeft:'calc(-50vw + 50%)',padding:'80px 20px 100px',textAlign:'center',color:'#fff'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'32px',fontWeight:'900',lineHeight:'1.15',letterSpacing:'0.5px',textTransform:'uppercase',margin:'0 0 20px 0'}}>
            NEW CLIENT TIMELINE<br/>TO SUCCESS
          </h2>
          <div style={{width:'50px',height:'2px',background:'#fff',margin:'0 auto 60px'}}></div>
          
          {/* STEP 1 */}
          <div style={{marginBottom:'60px'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b1.jpg" alt="Pre-sale" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>Pre-sale</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              We Identify your needs and objectives so we can accurately price & scope what is needed to drive the most value, setting our onboarding team up for success.
            </p>
          </div>

          {/* STEP 2 */}
          <div style={{marginBottom:'60px'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b2.jpg" alt="Onboarding" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>Onboarding</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              Kick-off call, account access, and strategy alignment with your dedicated team.
            </p>
          </div>

          {/* STEP 3 */}
          <div style={{marginBottom:'60px'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b3.jpg" alt="Week 1-2" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>Week 1-2</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              Full audit completion, campaign builds, tracking setup, and launch preparation.
            </p>
          </div>

          {/* STEP 4 */}
          <div style={{marginBottom:'60px'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b4.jpg" alt="Month 1" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>Month 1</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              Campaigns go live with aggressive testing and first round of data-driven optimizations.
            </p>
          </div>

          {/* STEP 5 */}
          <div style={{marginBottom:'60px'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b5.jpg" alt="Month 2-3" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>Month 2-3</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              Scale winning campaigns, cut waste, and hit your growth targets ahead of schedule.
            </p>
          </div>

          {/* STEP 6 */}
          <div style={{marginBottom:'0'}}>
            <div style={{width:'240px',height:'240px',margin:'0 auto 24px',position:'relative'}}>
              <img src="/b6.jpg" alt="90 Days" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',border:'2px solid #fff'}}/>
            </div>
            <p style={{fontSize:'16px',fontWeight:'400',margin:'0 0 20px 0'}}>90 Days</p>
            <div style={{width:'80%',height:'1px',background:'rgba(255,255,255,0.3)',margin:'0 auto 24px'}}></div>
            <p style={{fontSize:'15px',fontWeight:'400',lineHeight:'1.6',margin:'0 auto',maxWidth:'420px'}}>
              Measurable ROI guaranteed or you don't pay. That's our risk-free promise.
            </p>
          </div>

        </div>
      </section>

      {/* CONTACT SECTION - Add this so scrollTo works */}
      <section id="contact-us" style={{background:'#fff',padding:'80px 20px',textAlign:'center'}}>
        <h2 style={{fontSize:'36px',fontWeight:'900',marginBottom:'20px'}}>Contact Us</h2>
        <p style={{fontSize:'18px'}}>Your form goes here</p>
      </section>
    </main>
  )
}