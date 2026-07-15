'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function EventPage() {
  const router = useRouter()

  const VIPStar = ({ color1, color2, color3 }) => (
    <div style={{
      width: '32px',
      height: '32px',
      position: 'relative',
      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32">
        <defs>
          <radialGradient id={`star-${color1}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={color3} />
            <stop offset="100%" stopColor={color1} />
          </radialGradient>
        </defs>
        <path
          d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
          fill={`url(#star-${color1})`}
          stroke={color2}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )

  return (
    <div style={{ background: '#E8E8E8', minHeight: '100vh', paddingBottom: '90px', paddingTop: '64px' }}>
      <AppHeader />

      {/* SECTION 1: Deposit-Boost */}
      <div style={{ padding: '0 12px', marginBottom: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '20px',
            marginBottom: '12px'
          }}>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              DEPOSIT MORE
            </div>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              EARN MORE
            </div>
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '900',
            lineHeight: '1',
            textAlign: 'center',
            margin: '0 0 4px 0',
            color: '#000',
            letterSpacing: '-1px'
          }}>
            DISRUPTIVE
          </h1>

          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 12px 0',
            color: '#000'
          }}>
            Deposit-Boost Reward Campaign
          </h2>

          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 16px 0',
            color: '#cc0000'
          }}>
            Get up to 10% Extra Reward with Every Top-Up
          </p>

          <div style={{
            background: '#000',
            borderRadius: '16px',
            margin: '0 12px 0 12px',
            padding: '24px 20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300', marginBottom: '4px' }}>
                  DEPOSIT
                </div>
                <div style={{ fontSize: '18px', color: '#fff', fontWeight: '700' }}>
                  USD 500-1,499
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '300' }}>earn extra</span>
                <span style={{ fontSize: '36px', color: '#cc0000', fontWeight: '700' }}>6%</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300', marginBottom: '4px' }}>
                  DEPOSIT
                </div>
                <div style={{ fontSize: '18px', color: '#fff', fontWeight: '700' }}>
                  USD 1,500-4,999
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '300' }}>earn extra</span>
                <span style={{ fontSize: '36px', color: '#cc0000', fontWeight: '700' }}>8%</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300', marginBottom: '4px' }}>
                  DEPOSIT
                </div>
                <div style={{ fontSize: '18px', color: '#fff', fontWeight: '700' }}>
                  USD 5,000-9,999
                </div>
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: '300', marginTop: '2px' }}>
                  or above
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '300' }}>earn extra</span>
                <span style={{ fontSize: '36px', color: '#cc0000', fontWeight: '700' }}>10%</span>
              </div>
            </div>
          </div>

          <div style={{
            background: '#cc0000',
            marginTop: '-8px',
            padding: '32px 20px 24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px)'
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '12px'
              }}>
                Notes for this campaign:
              </div>

              <div style={{ fontSize: '11px', color: '#fff', fontWeight: '300', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '6px' }}>01. Deposit to reset your daily missions and unlock extra rewards.</div>
                <div style={{ marginBottom: '6px' }}>02. All deposits enjoy Deposit-Boost benefits — instantly boosting your balance.</div>
                <div style={{ marginBottom: '6px' }}>03. Rewards reset daily at 00:00 (EST UTC-5 / EDT UTC-4).</div>
                <div style={{ marginBottom: '12px' }}>04. Deposit-Boost Campaign available daily — boost your earnings even further!</div>
                <div style={{ fontSize: '9px', opacity: 0.9 }}>
                  The platform reserves the right of final interpretation and may modify rules without prior notice.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Earnings-Based Payroll */}
      <div style={{ padding: '0 12px', marginBottom: '16px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '20px',
            marginBottom: '12px'
          }}>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              SIGN IN
            </div>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              SHOW UP
            </div>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              GET PAID
            </div>
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '900',
            lineHeight: '1',
            textAlign: 'center',
            margin: '0 0 4px 0',
            color: '#000',
            letterSpacing: '-1px'
          }}>
            DISRUPTIVE
          </h1>

          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 16px 0',
            color: '#000'
          }}>
            Earnings-Based Payroll
          </h2>

          <div style={{
            background: '#000',
            borderRadius: '16px',
            margin: '0 12px 0 12px',
            padding: '24px 20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '1px solid #333'
            }}>
              <div style={{ fontSize: '11px', color: '#fff', fontWeight: '400' }}>DAYS WORKED</div>
              <div style={{ fontSize: '11px', color: '#fff', fontWeight: '400' }}>SALARY EARNED</div>
            </div>

            {[
              { days: '5', amount: '1,000' },
              { days: '10', amount: '1,200' },
              { days: '15', amount: '1,500' },
              { days: '30', amount: '2,000' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: idx === 3 ? '20px' : '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#cc0000">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10,8 16,12 10,16" fill="#000"/>
                  </svg>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '300' }}>Sign in for</span>
                  <span style={{ fontSize: '16px', color: '#cc0000', fontWeight: '700' }}>{item.days}</span>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '300' }}>working days</span>
                </div>
                <div style={{ fontSize: '16px', color: '#cc0000', fontWeight: '700' }}>USD {item.amount}</div>
              </div>
            ))}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #333'
            }}>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '300' }}>Earned a total of</div>
              <div style={{ fontSize: '18px', color: '#cc0000', fontWeight: '700' }}>USD 5,700</div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '11px', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>
                Daily mission Requirement:
              </div>
              <div style={{ fontSize: '10px', color: '#cc0000', fontWeight: '300', lineHeight: '1.4' }}>
                Participants must complete two (3) sets of missions per day to qualify for guaranteed income.
              </div>
            </div>
          </div>

          <div style={{
            background: '#cc0000',
            marginTop: '-8px',
            padding: '32px 20px 24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)'
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000',
                marginBottom: '12px'
              }}>
                Notes for all users:
              </div>

              <div style={{ fontSize: '11px', color: '#000', fontWeight: '400', lineHeight: '1.6', marginBottom: '12px' }}>
                For everyday you sign in and complete your work, you earn guaranteed income!<br/>
                The more you show up, the more you earn. Simple as that!
              </div>

              <div style={{ fontSize: '11px', color: '#000', fontWeight: '300', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '6px' }}>01. Complete two missions per day to qualify for earnings.</div>
                <div style={{ marginBottom: '6px' }}>02. Perfect attendance unlocks up to USD 5,700/month.</div>
                <div style={{ marginBottom: '6px' }}>03. Earnings and attendance reset daily at 00:00 (EST UTC-5 / EDT UTC-4).</div>
                <div style={{ marginBottom: '12px' }}>04. Rewards will be credited within 24 hours after successful daily mission completion.</div>
                <div style={{ fontSize: '9px', opacity: 0.9 }}>
                  The platform reserves the right of final interpretation and may modify rules without prior notice.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: VIP Level-Tier Advantage */}
      <div style={{ padding: '0 12px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '20px',
            marginBottom: '12px'
          }}>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              THE HIGHER THE LEVEL
            </div>
            <div style={{
              background: '#D9D9D9',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: '400',
              color: '#000',
              letterSpacing: '0.5px'
            }}>
              THE GREATER THE EARNINGS
            </div>
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '900',
            lineHeight: '1',
            textAlign: 'center',
            margin: '0 0 4px 0',
            color: '#000',
            letterSpacing: '-1px'
          }}>
            DISRUPTIVE
          </h1>

          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 16px 0',
            color: '#000'
          }}>
            VIP Level-Tier Advantage
          </h2>

          <div style={{
            background: '#000',
            borderRadius: '16px',
            margin: '0 12px 0 12px',
            padding: '20px 16px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
              gap: '8px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #333'
            }}>
              <div style={{ fontSize: '9px', color: '#fff', fontWeight: '400', lineHeight: '1.2' }}>VIP TIER</div>
              <div style={{ fontSize: '9px', color: '#fff', fontWeight: '400', lineHeight: '1.2', textAlign: 'center' }}>
                PROFIT RATE/<br/>PER DEAL
              </div>
              <div style={{ fontSize: '9px', color: '#fff', fontWeight: '400', lineHeight: '1.2', textAlign: 'center' }}>
                DAILY WORK<br/>OPPORTUNITIES
              </div>
              <div style={{ fontSize: '9px', color: '#fff', fontWeight: '400', lineHeight: '1.2', textAlign: 'right' }}>
                UNLOCK CONDITION/<br/>1ST DEPOSIT AMOUNT
              </div>
            </div>

            {[
              { tier: 'VIP 1', rate: '0.5%', times: '40', deposit: '50-549', c1: '#F4D03F', c2: '#F8C471', c3: '#F7DC6F' },
              { tier: 'VIP 2', rate: '1.0%', times: '45', deposit: '550-1,999', c1: '#E74C3C', c2: '#EC7063', c3: '#F1948A' },
              { tier: 'VIP 3', rate: '1.5%', times: '50', deposit: '2,000-4,999', c1: '#3498DB', c2: '#5DADE2', c3: '#85C1E9' },
              { tier: 'VIP 4', rate: '2.0%', times: '55', deposit: '5,000-8,999', c1: '#E67E22', c2: '#EB984E', c3: '#F0B27A' },
              { tier: 'VIP 5', rate: '2.5%', times: '60', deposit: '9,000-above', c1: '#5DADE2', c2: '#85C1E9', c3: '#A9CCE3' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
                gap: '8px',
                alignItems: 'center',
                marginBottom: idx === 4 ? '0' : '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{item.tier}</span>
                  <VIPStar color1={item.c1} color2={item.c2} color3={item.c3} />
                </div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', textAlign: 'center' }}>
                  {item.rate}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#cc0000', fontWeight: '700' }}>{item.times}</span>
                  <span style={{ fontSize: '11px', color: '#fff', fontWeight: '300' }}> Times/Set</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#fff', fontWeight: '300' }}>USD </span>
                  <span style={{ fontSize: '13px', color: '#cc0000', fontWeight: '700' }}>{item.deposit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#3D1E6D',
            marginTop: '-8px',
            padding: '32px 20px 24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)'
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '12px'
              }}>
                Notice to all users:
              </div>

              <div style={{ fontSize: '11px', color: '#fff', fontWeight: '300', lineHeight: '1.6', marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>01. The higher your VIP level, the greater your daily earning potential.</div>
                <div style={{ marginBottom: '6px' }}>02. Upgrading VIP increases your daily work opportunities.</div>
                <div style={{ marginBottom: '6px' }}>03. All upgrade deposits will be credited to your account balance and can be withdrawn upon completing daily works.</div>
                <div style={{ marginBottom: '12px' }}>04. VIP rewards reset daily at 00:00 (EST UTC-5 / EDT UTC-4).</div>
              </div>

              <div style={{ fontSize: '11px', color: '#cc0000', fontWeight: '600', marginBottom: '12px' }}>
                Upgrade today to unlock more exclusive benefits!
              </div>

              <div style={{ fontSize: '9px', color: '#fff', opacity: 0.9, fontWeight: '300' }}>
                The platform reserves the right of final interpretation and may modify rules without prior notice.
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}