import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const C = {
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  pinkMid:    '#c026d3',
  glow:       '#c026d3',
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#8878a8',
  sub:        '#d8b4fe',
}

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${C.cardBorder}`, borderTopColor: C.pink, animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '15px', color: C.muted }}>Signing you in...</p>
      </div>
    )
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: C.bg, border: `1px solid ${C.cardBorder}`,
    borderRadius: '12px', fontSize: '14px',
    color: C.text, fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'inherit' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } ::placeholder { color: ${C.muted}; }`}</style>

      <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '40px 36px', width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', boxShadow: `0 0 14px ${C.glow}66` }}>AI</div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>Interview AI</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: '6px' }}>Welcome back</h1>
        <p style={{ fontSize: '13.5px', color: C.muted, textAlign: 'center', marginBottom: '32px' }}>Sign in to your account to continue</p>

        {/* Email */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: C.sub, marginBottom: '7px' }}>Email address</label>
          <input
            type="email" value={email} placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = C.pink; e.target.style.boxShadow = `0 0 0 3px ${C.pink}22` }}
            onBlur={(e)  => { e.target.style.borderColor = C.cardBorder; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: C.sub, marginBottom: '7px' }}>Password</label>
          <input
            type="password" value={password} placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = C.pink; e.target.style.boxShadow = `0 0 0 3px ${C.pink}22` }}
            onBlur={(e)  => { e.target.style.borderColor = C.cardBorder; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '14px', marginTop: '8px', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 0 20px ${C.glow}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: C.muted }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: C.pinkMid, fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login