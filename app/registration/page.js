'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const countries = [
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  // ... keep your whole countries array here
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' }
]

export default function Registration() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    selectedCountryName: 'United States',
    phone: '',
    loginPassword: '',
    confirmPassword: '',
    transactionPassword: '',
    gender: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  const [showCountries, setShowCountries] = useState(false)
  const [searchCountry, setSearchCountry] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [showTxnPass, setShowTxnPass] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (!form.phone || !/^\d{7,15}$/.test(form.phone)) newErrors.phone = 'Enter valid phone number'
    if (!form.loginPassword) newErrors.loginPassword = 'Password is required'
    if (form.loginPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!form.transactionPassword) newErrors.transactionPassword = 'Transaction password is required'
    if (!form.gender) newErrors.gender = 'Please select gender'
    if (!form.acceptTerms) newErrors.acceptTerms = 'You must accept Terms and Conditions'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      const selectedCountry = countries.find(c => c.name === form.selectedCountryName)
      const countryCode = selectedCountry?.code || '+1'
      const fullPhone = countryCode + form.phone

      // AUTO GENERATE INVITE CODE: last 6 digits of phone + DI
      const last6 = form.phone.slice(-6).padStart(6, '0') // if phone < 6 digits, pad with 0
      const autoInviteCode = `${last6}DI`

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          phone: fullPhone,
          loginPassword: form.loginPassword,
          transactionPassword: form.transactionPassword,
          gender: form.gender,
          countryCode,
          countryName: form.selectedCountryName,
          inviteCode: autoInviteCode, // <-- SEND AUTO GENERATED
          action: 'register'
        })
      })
      const data = await res.json()
      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setErrors({ submit: data.error })
      }
    }
  }

  const inputStyle = {
    width: '100%',
    height: '56px',
    padding: '0 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '4px',
    boxSizing: 'border-box',
    outline: 'none'
  }

  const selectBoxStyle = {
    ...inputStyle,
    cursor: 'pointer',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const errorStyle = {
    color: '#cc0000',
    fontSize: '14px',
    marginBottom: '16px'
  }

  const passwordWrapper = {
    position: 'relative',
    width: '100%'
  }

  const eyeStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '20px',
    userSelect: 'none'
  }

  const selectedCountry = countries.find(c => c.name === form.selectedCountryName)
  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    c.code.includes(searchCountry)
  )

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#fff',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: '30px 40px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          zIndex: 10000,
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#cc0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#fff',
            fontSize: '28px',
            fontWeight: '700'
          }}>✓</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>
            Registration Successful
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Redirecting to login...
          </div>
        </div>
      )}

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px', color: '#000' }}>
            DISRUPTIVE WELCOMES YOU
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px', lineHeight: '1.5' }}>
            We specialize in helping B2B and e-commerce businesses dominate the digital space.
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#000' }}>
            SIGN UP
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            style={inputStyle}
          />
          {errors.username && <div style={errorStyle}>{errors.username}</div>}

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div onClick={() => setShowCountries(!showCountries)} style={{...selectBoxStyle, width: '120px', marginBottom: 0}}>
                <span>{selectedCountry.flag} {selectedCountry.code}</span>
                <span>▼</span>
              </div>
              <input
                type="tel"
                placeholder="Enter a phone number"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                inputMode="numeric"
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
            </div>
            {showCountries && (
              <div style={{
                position: 'absolute',
                top: '60px',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                maxHeight: '250px',
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: 'none', borderBottom: '1px solid #eee', boxSizing: 'border-box', fontSize: '14px' }}
                  onClick={(e) => e.stopPropagation()}
                />
                {filteredCountries.map((c, idx) => (
                  <div
                    key={`${c.name}-${c.code}-${idx}`}
                    onClick={() => {
                      setForm({...form, selectedCountryName: c.name})
                      setShowCountries(false)
                      setSearchCountry('')
                    }}
                    style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '16px' }}
                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                  >
                    {c.flag} {c.name} {c.code}
                  </div>
                ))}
              </div>
            )}
            {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
          </div>

          <div style={passwordWrapper}>
            <input
              type={showLoginPass? 'text' : 'password'}
              placeholder="Login Password"
              value={form.loginPassword}
              onChange={(e) => setForm({...form, loginPassword: e.target.value})}
              style={inputStyle}
            />
            <span onClick={() => setShowLoginPass(!showLoginPass)} style={eyeStyle}>
              {showLoginPass? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          {errors.loginPassword && <div style={errorStyle}>{errors.loginPassword}</div>}

          <div style={passwordWrapper}>
            <input
              type={showConfirmPass? 'text' : 'password'}
              placeholder="Confirm Login Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              style={inputStyle}
            />
            <span onClick={() => setShowConfirmPass(!showConfirmPass)} style={eyeStyle}>
              {showConfirmPass? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}

          <div style={passwordWrapper}>
            <input
              type={showTxnPass? 'text' : 'password'}
              placeholder="Transaction Password"
              value={form.transactionPassword}
              onChange={(e) => setForm({...form, transactionPassword: e.target.value})}
              style={inputStyle}
            />
            <span onClick={() => setShowTxnPass(!showTxnPass)} style={eyeStyle}>
              {showTxnPass? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          {errors.transactionPassword && <div style={errorStyle}>{errors.transactionPassword}</div>}

          <div style={{...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={{ color: '#666' }}>Gender</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={(e) => setForm({...form, gender: e.target.value})} style={{ accentColor: '#cc0000' }} />
                Male
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={(e) => setForm({...form, gender: e.target.value})} style={{ accentColor: '#cc0000' }} />
                Female
              </label>
            </div>
          </div>
          {errors.gender && <div style={errorStyle}>{errors.gender}</div>}

          {/* REMOVED INVITE CODE INPUT - AUTO GENERATED NOW */}

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" checked={form.acceptTerms} onChange={(e) => setForm({...form, acceptTerms: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#cc0000', cursor: 'pointer' }} />
            <span style={{ color: '#000' }}>Accept ours <Link href="/terms" style={{ color: '#000', textDecoration: 'underline' }}>Terms and Conditions</Link></span>
          </label>
          {errors.acceptTerms && <div style={errorStyle}>{errors.acceptTerms}</div>}

          {errors.submit && <div style={errorStyle}>{errors.submit}</div>}

          <button type="submit" style={{ width: '100%', height: '56px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
            Submit
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Already have an account? <Link href="/login" style={{ color: '#0066cc', fontWeight: '500' }}>Sign In</Link>
          </div>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '8px' }}>
            By signing up, you agree to our <Link href="/terms" style={{ color: '#0066cc' }}>Terms and Conditions</Link>
          </div>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '40px' }}>
            Copyrights 2026 © Disruptive Advertisng Agency
          </div>
        </form>
      </div>
    </div>
  )
}