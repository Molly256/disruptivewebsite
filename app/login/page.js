'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const countries = [
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: '+1', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+1', flag: '🇧🇸', name: 'Bahamas' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+1', flag: '🇧🇧', name: 'Barbados' },
  { code: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+257', flag: '🇧🇮', name: 'Burundi' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '+235', flag: '🇹🇩', name: 'Chad' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+269', flag: '🇰🇲', name: 'Comoros' },
  { code: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+243', flag: '🇨🇩', name: 'DR Congo' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
  { code: '+1', flag: '🇩🇲', name: 'Dominica' },
  { code: '+1', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '+291', flag: '🇪🇷', name: 'Eritrea' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+679', flag: '🇫🇯', name: 'Fiji' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+220', flag: '🇬🇲', name: 'Gambia' },
  { code: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: '+1', flag: '🇬🇩', name: 'Grenada' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', name: 'Guinea' },
  { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '+592', flag: '🇬🇾', name: 'Guyana' },
  { code: '+509', flag: '🇭🇹', name: 'Haiti' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98', flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: '+1', flag: '🇯🇲', name: 'Jamaica' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '+856', flag: '🇱🇦', name: 'Laos' },
  { code: '+371', flag: '🇱🇻', name: 'Latvia' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+266', flag: '🇱🇸', name: 'Lesotho' },
  { code: '+231', flag: '🇱🇷', name: 'Liberia' },
  { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
  { code: '+265', flag: '🇲🇼', name: 'Malawi' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', name: 'Maldives' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
  { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+691', flag: '🇫🇲', name: 'Micronesia' },
  { code: '+373', flag: '🇲🇩', name: 'Moldova' },
  { code: '+377', flag: '🇲🇨', name: 'Monaco' },
  { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
  { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', name: 'Namibia' },
  { code: '+674', flag: '🇳🇷', name: 'Nauru' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+850', flag: '🇰🇵', name: 'North Korea' },
  { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+680', flag: '🇵🇼', name: 'Palau' },
  { code: '+970', flag: '🇵🇸', name: 'Palestine' },
  { code: '+507', flag: '🇵🇦', name: 'Panama' },
  { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+1', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
  { code: '+1', flag: '🇱🇨', name: 'Saint Lucia' },
  { code: '+1', flag: '🇻🇨', name: 'Saint Vincent' },
  { code: '+685', flag: '🇼🇸', name: 'Samoa' },
  { code: '+378', flag: '🇸🇲', name: 'San Marino' },
  { code: '+239', flag: '🇸🇹', name: 'Sao Tome and Principe' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
  { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: '+252', flag: '🇸🇴', name: 'Somalia' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+211', flag: '🇸🇸', name: 'South Sudan' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+597', flag: '🇸🇷', name: 'Suriname' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+670', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+676', flag: '🇹🇴', name: 'Tonga' },
  { code: '+1', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+688', flag: '🇹🇻', name: 'Tuvalu' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
  { code: '+379', flag: '🇻🇦', name: 'Vatican City' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' }
]

export default function Login() {
  const router = useRouter()
  const [loginType, setLoginType] = useState('username')
  const [form, setForm] = useState({
    selectedCountryName: 'United States',
    phone: '',
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showCountries, setShowCountries] = useState(false)
  const [searchCountry, setSearchCountry] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.password) {
      setError('Password is required')
      return
    }

    const selectedCountry = countries.find(c => c.name === form.selectedCountryName)
    const countryCode = selectedCountry?.code || '+1'
    const fullPhone = countryCode + form.phone

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        countryCode,
        fullPhone,
        action: 'login',
        loginType
      })
    })
    const data = await res.json()
    
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user))
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      setError(data.error)
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
            Login Successful
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Redirecting to dashboard...
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
            SIGN IN
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setLoginType('username')}
              style={{
                flex: 1,
                height: '40px',
                background: loginType === 'username' ? '#cc0000' : '#f5f5f5',
                color: loginType === 'username' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Username
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              style={{
                flex: 1,
                height: '40px',
                background: loginType === 'phone' ? '#cc0000' : '#f5f5f5',
                color: loginType === 'phone' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Phone
            </button>
          </div>

          {loginType === 'username' ? (
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              style={inputStyle}
            />
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <div onClick={() => setShowCountries(!showCountries)} style={{...selectBoxStyle, width: '120px', marginBottom: 0}}>
                  <span>{selectedCountry.flag} {selectedCountry.code}</span>
                  <span>▼</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter a phone number"
                  autoComplete="tel"
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
            </div>
          )}

          <div style={passwordWrapper}>
            <input
              type={showPassword? 'text' : 'password'}
              name="password"
              placeholder="Login Password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              style={inputStyle}
            />
            <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>
              {showPassword? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px' }}>
            <span style={{ fontSize: '14px', color: '#0066cc', cursor: 'pointer' }}>
              Forgot your password?
            </span>
          </div>

          {error && <div style={{ color: '#cc0000', fontSize: '14px', marginTop: '-8px' }}>{error}</div>}

          <button
            type="submit"
            style={{
              width: '100%',
              height: '56px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Submit
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Don't have an account yet? <Link href="/registration" style={{ color: '#0066cc', fontWeight: '500' }}>Sign Up</Link>
          </div>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Can't sign in? <Link href="/support" style={{ color: '#0066cc', fontWeight: '500' }}>Contact our user support</Link>
          </div>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '40px' }}>
            Copyrights 2026 © Disruptive
          </div>
        </form>
      </div>
    </div>
  )
}