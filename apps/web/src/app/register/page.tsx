'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { supabase } from '@studio-l22/core'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Le password non coincidono.')
      return
    }
    if (!terms) {
      setError('Devi accettare i Termini di servizio e la Privacy Policy.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #0055FF, #7C3AED)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <GraduationCap size={24} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', letterSpacing: -0.5 }}>
            Crea il tuo account
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
            Inizia il tuo percorso verso la laurea
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-input"
                placeholder="Marco"
                autoComplete="given-name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cognome</label>
              <input
                type="text"
                className="form-input"
                placeholder="Rossi"
                autoComplete="family-name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email istituzionale</label>
            <input
              type="email"
              className="form-input"
              placeholder="m.rossi@ateneo.it"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Almeno 8 caratteri"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conferma password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Ripeti la password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Terms */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={e => setTerms(e.target.checked)}
              style={{ marginTop: 3, accentColor: 'var(--primary)', flexShrink: 0 }}
            />
            <label htmlFor="terms" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              Accetto i{' '}
              <a href="#" style={{ color: 'var(--primary)' }}>Termini di servizio</a>
              {' '}e la{' '}
              <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '13px 20px' }}
            disabled={loading}
          >
            {loading ? 'Caricamento...' : 'Crea account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 20 }}>
          Hai già un account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Accedi
          </Link>
        </p>
      </div>
    </div>
  )
}
