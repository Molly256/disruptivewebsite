'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { t } from '@/lib/i18n'

const countries = [
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+1 684', flag: '🇦🇸', name: 'American Samoa' },
  { code: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: '+1 264', flag: '🇦🇮', name: 'Anguilla' },
  { code: '+672', flag: '🇦🇶', name: 'Antarctica' },
  { code: '+1 268', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: '+297', flag: '🇦🇼', name: 'Aruba' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+1 242', flag: '🇧🇸', name: 'Bahamas' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+1 246', flag: '🇧', name: 'Barbados' },
  { code: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+1 441', flag: '🇧🇲', name: 'Bermuda' },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+1 284', flag: '🇻🇬', name: 'British Virgin Islands' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+257', flag: '🇧🇮', name: 'Burundi' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+1 345', flag: '🇰🇾', name: 'Cayman Islands' },
  { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '+235', flag: '🇹🇩', name: 'Chad' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+269', flag: '🇰🇲', name: 'Comoros' },
  { code: '+243', flag: '🇨🇬', name: 'Congo' },
  { code: '+243', flag: '🇨🇩', name: 'Congo DRC' },
  { code: '+682', flag: '🇨🇰', name: 'Cook Islands' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: '+599', flag: '🇨🇼', name: 'Curacao' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
  { code: '+1 767', flag: '🇩🇲', name: 'Dominica' },
  { code: '+1 809', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '+291', flag: '🇪🇷', name: 'Eritrea' },
  { code: '+372', flag: '🇪', name: 'Estonia' },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
  { code: '+298', flag: '🇫🇴', name: 'Faroe Islands' },
  { code: '+679', flag: '🇫🇯', name: 'Fiji' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+220', flag: '🇬🇲', name: 'Gambia' },
  { code: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+350', flag: '🇬🇮', name: 'Gibraltar' },
  { code: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: '+299', flag: '🇬🇱', name: 'Greenland' },
  { code: '+1 473', flag: '🇬🇩', name: 'Grenada' },
  { code: '+1 671', flag: '🇬🇺', name: 'Guam' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', name: 'Guinea' },
  { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '+592', flag: '🇬🇾', name: 'Guyana' },
  { code: '+509', flag: '🇭🇹', name: 'Haiti' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98', flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+1 876', flag: '🇯🇲', name: 'Jamaica' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
  { code: '+850', flag: '🇰🇵', name: 'North Korea' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
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
  { code: '+853', flag: '🇲🇴', name: 'Macao' },
  { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
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
  { code: '+1 664', flag: '🇲🇸', name: 'Montserrat' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+95', flag: '🇲', name: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', name: 'Namibia' },
  { code: '+674', flag: '🇳🇷', name: 'Nauru' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+683', flag: '🇳🇺', name: 'Niue' },
  { code: '+1 670', flag: '🇲🇵', name: 'Northern Mariana Islands' },
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
  { code: '+1 787', flag: '🇵🇷', name: 'Puerto Rico' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+1 869', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
  { code: '+1 758', flag: '🇱🇨', name: 'Saint Lucia' },
  { code: '+1 784', flag: '🇻🇨', name: 'Saint Vincent' },
  { code: '+685', flag: '🇼🇸', name: 'Samoa' },
  { code: '+378', flag: '🇸🇲', name: 'San Marino' },
  { code: '+239', flag: '🇸🇹', name: 'Sao Tome and Principe' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
  { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+1 721', flag: '🇸🇽', name: 'Sint Maarten' },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: '+252', flag: '🇸🇴', name: 'Somalia' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+211', flag: '🇸', name: 'South Sudan' },
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
  { code: '+690', flag: '🇹🇰', name: 'Tokelau' },
  { code: '+676', flag: '🇹🇴', name: 'Tonga' },
  { code: '+1 868', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+1 649', flag: '🇹🇨', name: 'Turks and Caicos' },
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
  { code: '+1 340', flag: '🇻🇮', name: 'US Virgin Islands' },
  { code: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' }
]

export default function Registration() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    selectedCountry: { code: '+1', flag: '🇺🇸', name: 'United States' },
    phone: '',
    inviteCode: '', // USER TYPES THIS MANUALLY
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
    if (!form.inviteCode.trim()) newErrors.inviteCode = 'Invite code is required' // MUST ENTER INVITER CODE
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
      const countryCode = form.selectedCountry.code
      const countryName = form.selectedCountry.name
      const fullPhone = countryCode + form.phone

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
          countryName,
          invitedBy: form.inviteCode, // THE CODE THEY TYPED = WHO INVITED THEM
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

  const selectedCountry = form.selectedCountry
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}> {/* FIXED: was 400px */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}> {/* keeps form centered */}
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
                        setForm({...form, selectedCountry: c})
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

            {/* INVITE CODE INPUT - USER TYPES MANUALLY */}
            <input
              type="text"
              placeholder="Invite Code"
              value={form.inviteCode}
              onChange={(e) => setForm({...form, inviteCode: e.target.value.toUpperCase()})}
              style={inputStyle}
            />
            {errors.inviteCode && <div style={errorStyle}>{errors.inviteCode}</div>}

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
              By signing up, you agree to our <Link href="/terms" style={{ color: '#0066cc' }}>Terms and Conditions</Link></div>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '40px' }}>
              Copyrights 2026 © Disruptive Advertisng Agency
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}