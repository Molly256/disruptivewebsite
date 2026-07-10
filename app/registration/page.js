'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const countries = [
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
]

export default function Registration() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    countryCode: '+44',
    phone: '',
    password: '',
    repeatPassword: '',
    email: '',
    gender: '',
    inviteCode: ''
  })
  const [errors, setErrors] = useState({})
  const [showCountries, setShowCountries] = useState(false)
  const [showGender, setShowGender] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!form.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!form.phone || !/^\d{7,15}$/.test(form.phone)) {
      newErrors.phone = 'Enter valid phone number'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    }

    if (form.password !== form.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (!form.gender) {
      newErrors.gender = 'Please select gender'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const fullPhone = form.countryCode + form.phone
      localStorage.setItem('user', JSON.stringify({
        phone: fullPhone,
        password: form.password,
        username: form.username,
        gender: form.gender,
        inviteCode: form.inviteCode
      }))
      router.push('/login')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '4px',
    boxSizing: 'border-box'
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

  const selectedCountry = countries.find(c => c.code === form.countryCode)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '120px 20px 40px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          marginBottom: '30px', 
          textAlign: 'center',
          color: '#000'
        }}>
          Create Account
        </h1>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            placeholder="Enter any username"
            style={inputStyle}
          />
          {errors.username && <div style={errorStyle}>{errors.username}</div>}
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div 
              onClick={() => setShowCountries(!showCountries)}
              style={{
                ...selectBoxStyle,
                width: '110px',
                marginBottom: 0
              }}
            >
              <span>{selectedCountry.flag} {selectedCountry.code}</span>
              <span>▼</span>
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              placeholder="XXXXXXXXXX"
              inputMode="numeric"
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
          </div>
          {showCountries && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {countries.map(c => (
                <div
                  key={c.code}
                  onClick={() => {
                    setForm({...form, countryCode: c.code})
                    setShowCountries(false)
                  }}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    fontSize: '16px'
                  }}
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

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', marginTop: '16px' }}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            placeholder="Enter any password"
            style={inputStyle}
          />
          {errors.password && <div style={errorStyle}>{errors.password}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Repeat Password</label>
          <input
            type="password"
            value={form.repeatPassword}
            onChange={(e) => setForm({...form, repeatPassword: e.target.value})}
            placeholder="Repeat password"
            style={inputStyle}
          />
          {errors.repeatPassword && <div style={errorStyle}>{errors.repeatPassword}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            placeholder="you@example.com"
            style={inputStyle}
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Gender</label>
          <div 
            onClick={() => setShowGender(!showGender)}
            style={selectBoxStyle}
          >
            <span style={{ color: form.gender ? '#000' : '#999' }}>
              {form.gender || 'Select gender'}
            </span>
            <span>▼</span>
          </div>
          {showGender && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {['Male', 'Female'].map(g => (
                <div
                  key={g}
                  onClick={() => {
                    setForm({...form, gender: g})
                    setShowGender(false)
                  }}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    borderBottom: g === 'Male' ? '1px solid #eee' : 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = '#fff'}
                >
                  {g}
                </div>
              ))}
            </div>
          )}
          {errors.gender && <div style={errorStyle}>{errors.gender}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', marginTop: '16px' }}>Invite Code</label>
          <input
            type="text"
            value={form.inviteCode}
            onChange={(e) => setForm({...form, inviteCode: e.target.value})}
            placeholder="Enter invite code (optional)"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            background: '#cc0000',
            color: '#000',
            fontWeight: '500',
            fontSize: '16px',
            letterSpacing: '1px',
            padding: '16px',
            border: 'none',
            borderRadius: '6px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          REGISTER
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <span 
            onClick={() => router.push('/login')} 
            style={{ color: '#cc0000', cursor: 'pointer', fontWeight: '500' }}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  )
}