'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({
    phone: '+1',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Password must be 6 digits
    if (!/^\d{6}$/.test(form.password)) {
      setError('Password must be exactly 6 digits')
      return
    }

    // Check registered creds
    const savedUser = JSON.parse(localStorage.getItem('user'))
    
    if (!savedUser) {
      setError('No account found. Please register first')
      return
    }

    if (form.phone === savedUser.phone && form.password === savedUser.password) {
      alert('Login successful!')
      router.push('/') // go to home after login
    } else {
      setError('Invalid phone or password')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  }

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
          Login
        </h1>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="+1XXXXXXXXXX"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            placeholder="6 digits only"
            maxLength="6"
            inputMode="numeric"
            style={inputStyle}
          />
        </div>

        {error && <div style={{ color: '#cc0000', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

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
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          LOGIN
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <span 
            onClick={() => router.push('/registration')} 
            style={{ color: '#cc0000', cursor: 'pointer', fontWeight: '500' }}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  )
}