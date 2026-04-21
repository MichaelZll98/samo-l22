'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Star, CheckCircle, ArrowLeft, Zap, Shield, Download, BarChart2, Sparkles } from 'lucide-react'

export default function PremiumPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const isPro = false

  const comparison = [
    { feature: 'Quiz e flashcard',          free: 'Illimitati',     pro: 'Illimitati' },
    { feature: 'Note e appunti',            free: '✓',              pro: '✓' },
    { feature: 'Pomodoro timer',            free: '✓',              pro: '✓' },
    { feature: 'CFU tracker',               free: '✓',              pro: '✓' },
    { feature: 'Community',                 free: 'Base',           pro: 'Completa' },
    { feature: 'AI Samo (chat)',            free: '10 msg/giorno',  pro: 'Illimitata' },
    { feature: 'Generazione AI',            free: '5 al giorno',    pro: 'Illimitata' },
    { feature: 'Q&A documenti',             free: '—',              pro: '✓' },
    { feature: 'Pubblicità',                free: 'Presenti',       pro: 'Nessuna' },
    { feature: 'Temi esclusivi',            free: '—',              pro: '✓' },
    { feature: 'Badge Pro',                 free: '—',              pro: '✓' },
    { feature: 'Supporto prioritario',      free: '—',              pro: '✓' },
    { feature: 'Export note in PDF',        free: '—',              pro: '✓' },
    { feature: 'Statistiche avanzate',      free: 'Base',           pro: 'Avanzate' },
  ]

  const highlights = [
    { icon: Zap,        color: '#7C3AED', title: 'AI illimitata',      desc: 'Samo risponde sempre, senza limiti giornalieri' },
    { icon: Shield,     color: '#0055FF', title: 'Zero pubblicità',    desc: 'Studia senza distrazioni, sempre' },
    { icon: Download,   color: '#22C55E', title: 'Export PDF',         desc: 'Esporta le tue note in PDF con un click' },
    { icon: BarChart2,  color: '#F59E0B', title: 'Stats avanzate',     desc: 'Analisi dettagliate del tuo rendimento' },
    { icon: Sparkles,   color: '#EC4899', title: 'Temi esclusivi',     desc: 'Personalizza l\'app con temi Pro' },
    { icon: Star,       color: '#D97706', title: 'Badge esclusivo',    desc: 'Mostra il badge Pro nel tuo profilo community' },
  ]

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Torna all&apos;account
        </Link>
      </div>

      {/* Hero */}
      <div className="account-premium-hero">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #F59E0B40',
            marginBottom: 16,
          }}>
            <Crown size={18} color="#D97706" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#D97706', letterSpacing: 0.5 }}>SAMO L-22 PRO</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--color)', letterSpacing: -1, marginBottom: 12 }}>
            Studia senza limiti
          </div>
          <div style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            AI Samo illimitata, generazione di contenuti senza vincoli, nessuna pubblicità.
            Tutto quello che ti serve per superare ogni esame.
          </div>
        </div>

        {/* Billing */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', gap: 4,
            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 999, padding: 4,
          }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '10px 24px', borderRadius: 999, border: 'none',
                  fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: billing === b ? 'white' : 'transparent',
                  color: billing === b ? '#D97706' : 'rgba(255,255,255,0.7)',
                  boxShadow: billing === b ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {b === 'monthly' ? 'Mensile' : 'Annuale'}
                {b === 'yearly' && (
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#22C55E20', color: '#22C55E' }}>
                    RISPARMIA 50%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: 'white', letterSpacing: -2, lineHeight: 1 }}>
              €{billing === 'monthly' ? '4,99' : '2,50'}
            </span>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>/mese</span>
          </div>
          {billing === 'yearly' && (
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              Fatturato €29,99/anno · Risparmi €29,89
            </div>
          )}
        </div>

        <button className="account-hero-pro-btn">
          <Crown size={20} />
          Inizia ora — {billing === 'yearly' ? '€29,99/anno' : '€4,99/mese'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
          Annulla quando vuoi. Nessun vincolo.
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 28 }}>
        {highlights.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, margin: '0 auto 14px',
              background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={24} color={color} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)', marginBottom: 20 }}>
          Confronto piani
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, color: 'var(--muted)', fontWeight: 600, borderBottom: '2px solid var(--border)' }}>
                  Funzionalità
                </th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, color: 'var(--muted)', fontWeight: 600, borderBottom: '2px solid var(--border)' }}>
                  Free
                </th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, color: '#D97706', fontWeight: 700, borderBottom: '2px solid #F59E0B' }}>
                  ⭐ Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(({ feature, free, pro }, i) => (
                <tr key={feature} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--color)', fontWeight: 500 }}>{feature}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>{free}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#D97706', fontWeight: 600, textAlign: 'center' }}>{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA bottom */}
      <div style={{ textAlign: 'center', margin: '28px 0' }}>
        <button className="account-hero-pro-btn" style={{ display: 'inline-flex' }}>
          <Crown size={18} />
          Passa a Pro — {billing === 'yearly' ? '€29,99/anno' : '€4,99/mese'}
        </button>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
          Pagamento sicuro con Stripe. Annulla quando vuoi.
        </div>
      </div>
    </div>
  )
}
