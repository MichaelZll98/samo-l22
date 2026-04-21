'use client'

import { useState } from 'react'
import { User, Mail, GraduationCap, MapPin, Edit2, Award, BookOpen, TrendingUp, Moon, Sun } from 'lucide-react'

export default function ProfiloPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Profilo</h1>
        <p className="page-subtitle">Le tue informazioni e impostazioni</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80,
              borderRadius: 40,
              background: 'linear-gradient(135deg, #0055FF, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28, fontWeight: 800, color: 'white',
            }}>
              MS
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color)', marginBottom: 4 }}>
              Marco Stellato
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              m.stellato@uniroma1.it
            </div>

            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
              <Edit2 size={14} /> Modifica profilo
            </button>
          </div>

          {/* Info */}
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: GraduationCap, label: 'Corso di laurea', value: 'L-22 Scienze Motorie' },
                { icon: MapPin, label: 'Ateneo', value: 'Sapienza - Roma' },
                { icon: BookOpen, label: 'Anno accademico', value: '2025/2026 · II Anno' },
                { icon: Mail, label: 'Email', value: 'm.stellato@uniroma1.it' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats */}
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 16 }}>
              Statistiche accademiche
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { label: 'CFU Ottenuti', value: '81', sub: 'su 180', icon: Award, color: '#0055FF' },
                { label: 'Media voti', value: '27.4', sub: 'su 30', icon: TrendingUp, color: '#F59E0B' },
                { label: 'Esami', value: '9', sub: 'superati', icon: BookOpen, color: '#22C55E' },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} style={{
                  padding: '16px',
                  borderRadius: 12,
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  textAlign: 'center',
                }}>
                  <Icon size={22} color={color} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 16 }}>
              Impostazioni
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Theme toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10,
                background: 'var(--surface)',
                marginBottom: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {theme === 'dark' ? <Moon size={16} color="var(--primary)" /> : <Sun size={16} color="var(--primary)" />}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>Tema</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{theme === 'dark' ? 'Modalità scura' : 'Modalità chiara'}</div>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  style={{
                    width: 48, height: 26,
                    borderRadius: 13,
                    background: theme === 'dark' ? 'var(--primary)' : 'var(--border)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    border: 'none',
                  }}
                >
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: 10,
                    background: 'white',
                    position: 'absolute',
                    top: 3,
                    left: theme === 'dark' ? 25 : 3,
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              {[
                'Notifiche esami',
                'Streak giornaliero',
                'Statistiche avanzate',
                'Sincronizzazione calendario',
              ].map((setting) => (
                <div key={setting} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color)' }}>{setting}</span>
                  <div style={{
                    width: 48, height: 26, borderRadius: 13,
                    background: 'var(--primary)',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 20, height: 20,
                      borderRadius: 10, background: 'white',
                      position: 'absolute', top: 3, right: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ borderColor: 'var(--error-soft)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--error)', marginBottom: 12 }}>Zona pericolosa</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" style={{ background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>
                Esporta dati
              </button>
              <button className="btn" style={{ background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>
                Elimina account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
