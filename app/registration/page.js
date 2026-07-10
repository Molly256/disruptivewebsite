'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Registration() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    phone: '+1',
    password: '',
    repeatPassword: '',
    email: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!/^[a-zA-Z0-9]{6}$/.test(form.username)) {
      newErrors.username = 'Username must be exactly 6 letters or numbers'
    }

    if (!/^\+1\d*$/.test(form.phone)) {
      newErrors.phone = 'Phone must start with +1'
    }

    if (!/^\d{6}$/.test(form.password)) {
      newErrors.password = 'Password must be exactly 6 digits'
    }

    if (form.password !== form.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Save creds to localStorage for login check
      localStorage.setItem('user', JSON.stringify({
        phone: form.phone,
        password: form.password
      }))
      router.push('/login') // go to login page
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

  const errorStyle = {
    color: '#cc0000',
    fontSize: '14px',
    marginBottom: '16px'
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
          Create Account
        </h1>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            placeholder="6 letters or numbers"
            maxLength="6"
            style={inputStyle}
          />
          {errors.username && <div style={errorStyle}>{errors.username}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="+1XXXXXXXXXX"
            style={inputStyle}
          />
          {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
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
          {errors.password && <div style={errorStyle}>{errors.password}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Repeat Password</label>
          <input
            type="password"
            value={form.repeatPassword}
            onChange={(e) => setForm({...form, repeatPassword: e.target.value})}
            placeholder="6 digits only"
            maxLength="6"
            inputMode="numeric"
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
      </form>
    </div>
  )
}