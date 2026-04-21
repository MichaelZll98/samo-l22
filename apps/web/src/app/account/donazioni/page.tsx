'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft, Coffee } from 'lucide-react'

const DONATION_TIERS = [
  { amount: 2, label: '1 caffè', emoji: '☕', message: 'Grazie! Ogni caffè aiuta a tenere Samo sveglio per aiutarti!' },
  { amount: 5, label: '2 caffè', emoji: '☕☕', message: 'Cinque euro! Samo è carichissimo e pronto ad aiutarti con gli esami! 🐕' },
  { amount: 10, label: '4 caffè', emoji: '☕☕☕☕', message: 'Dieci euro?! Sei un eroe! Samo ti dedica la sua zampa d\'oro! 🐾🏆' },
]

const PAST_DONATIONS = [
  { name: 'Giulia R.', amount: 5,  message: 'Grazie, mi avete salvata a Fisiologia!', emoji: '☕☕' },
  { name: 'Luca M.',   amount: 10, message: 'App fantastica, continuate così!',         emoji: '☕☕☕☕' },
  { name: 'Sara T.',   amount: 2,  message: 'Un piccolo contributo con tutto il cuore', emoji: '☕' },
  { name: 'Marco V.',  amount: 5,  message: 'Samo è il migliore tutor che abbia mai avuto 🐕', emoji: '☕☕' },
]

export default function DonazioniPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [donated, setDonated] = useState(false)
  const [message, setMessage] = useState('')

  const amount = selected ?? (custom ? parseFloat(custom) : null)
  const tierMessage = DONATION_TIERS.find(t => t.amount === selected)?.message

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Torna all&apos;account
        </Link>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)',
        borderRadius: 20, padding: '40px 32px', textAlign: 'center', marginBottom: 28,
        border: '1px solid #F59E0B40', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: 120 }}>🐕</div>

        {/* Samoyed SVG */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            <ellipse cx="70" cy="105" rx="38" ry="26" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <circle cx="70" cy="62" r="36" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <path d="M42 38 C32 20 48 10 53 28" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <path d="M98 38 C108 20 92 10 87 28" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <circle cx="58" cy="57" r="4.5" fill="#1F2937"/>
            <circle cx="82" cy="57" r="4.5" fill="#1F2937"/>
            <circle cx="59.8" cy="55.2" r="1.8" fill="white"/>
            <circle cx="83.8" cy="55.2" r="1.8" fill="white"/>
            <ellipse cx="70" cy="67" rx="5.5" ry="3.5" fill="#111827"/>
            <path d="M63 73 Q70 79 77 73" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <rect x="90" y="98" width="28" height="24" rx="5" fill="#F59E0B"/>
            <rect x="88" y="93" width="32" height="7" rx="3.5" fill="#D97706"/>
            <path d="M118 101 Q128 106 118 115" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M96 87 Q98 80 96 73" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M103 85 Q105 78 103 71" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <ellipse cx="96" cy="99" rx="11" ry="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1"/>
            <text x="93" y="113" fontSize="10" fill="white" fontWeight="bold">☕</text>
          </svg>
        </div>

        <div style={{ fontSize: 28, fontWeight: 900, color: '#92400E', marginBottom: 10 }}>
          Offri un caffè a Samo! 🐾
        </div>
        <div style={{ fontSize: 15, color: '#78350F', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
          Se Samo L-22 ti aiuta nello studio, puoi supportare il progetto offrendo
          un caffè al team! Ogni contributo ci aiuta a migliorare l&apos;app e a tenere
          Samo sempre pronto ad aiutarti. 🐕
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: donation form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!donated ? (
            <>
              {/* Amounts */}
              <div className="card">
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 16 }}>
                  Scegli quanto offrire
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {DONATION_TIERS.map(({ amount: a, label, emoji }) => (
                    <button
                      key={a}
                      onClick={() => { setSelected(a); setCustom('') }}
                      style={{
                        flex: 1, padding: '18px 8px', borderRadius: 16, border: '2px solid',
                        borderColor: selected === a ? '#F59E0B' : 'var(--border)',
                        background: selected === a ? '#FFFBEB' : 'var(--surface)',
                        cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      }}
                    >
                      <div style={{ fontSize: 20 }}>{emoji}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: selected === a ? '#D97706' : 'var(--color)', letterSpacing: -0.5 }}>
                        €{a}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Oppure importo personalizzato</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, fontWeight: 600, color: 'var(--muted)' }}>€</span>
                    <input
                      className="form-input"
                      type="number" min="1" max="999" step="1"
                      placeholder="Inserisci importo"
                      value={custom}
                      onChange={e => { setCustom(e.target.value); setSelected(null) }}
                      style={{ paddingLeft: 32 }}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="card">
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 12 }}>
                  Lascia un messaggio a Samo (opzionale)
                </div>
                <textarea
                  className="form-input"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="es. Grazie per avermi aiutato con l'anatomia! 🐕"
                  rows={3}
                  maxLength={200}
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Samo reaction */}
              {(selected !== null || custom) && (
                <div style={{
                  padding: 16, borderRadius: 16,
                  background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                  border: '1.5px solid #F59E0B40',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontSize: 32, flexShrink: 0 }}>🐕</div>
                    <div style={{ fontSize: 14, color: '#78350F', lineHeight: 1.6, fontStyle: 'italic' }}>
                      &ldquo;{tierMessage || `Grazie per il tuo contributo di €${custom}! Stesso ti ringraziano di cuore! 🐾`}&rdquo;
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                disabled={!selected && !custom}
                onClick={() => setDonated(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                  fontFamily: 'var(--font)', fontSize: 16, fontWeight: 800, cursor: selected || custom ? 'pointer' : 'not-allowed',
                  background: selected || custom
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'var(--border)',
                  color: selected || custom ? 'white' : 'var(--muted)',
                  boxShadow: selected || custom ? '0 4px 20px rgba(245,158,11,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Heart size={20} />
                {amount ? `Dona €${amount} con PayPal` : 'Scegli un importo'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
                Pagamento sicuro tramite PayPal. Non è richiesto un account PayPal.
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40, border: '2px solid #F59E0B40', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706', marginBottom: 10 }}>Grazie mille!</div>
              <div style={{ fontSize: 15, color: '#92400E', lineHeight: 1.6, marginBottom: 20 }}>
                La tua donazione di <strong>€{amount}</strong> è stata ricevuta!<br />
                Samo e tutto il team ti ringraziano di cuore.<br />
                Sei il migliore! 🐾
              </div>
              <div style={{ fontSize: 32, marginBottom: 20 }}>🐕☕</div>
              <button
                className="btn btn-outline"
                onClick={() => { setDonated(false); setSelected(null); setCustom(''); setMessage('') }}
              >
                Fai un&apos;altra donazione
              </button>
            </div>
          )}
        </div>

        {/* Right: stats + messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Counter */}
          <div className="card" style={{ textAlign: 'center', border: '1.5px solid #F59E0B30', background: 'linear-gradient(135deg, #FFFBEB, var(--card))' }}>
            <Coffee size={28} color="#D97706" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 36, fontWeight: 900, color: '#D97706', letterSpacing: -1 }}>€ 1.247</div>
            <div style={{ fontSize: 13, color: '#92400E', marginBottom: 4, fontWeight: 600 }}>
              donati dalla community
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              312 studenti hanno già supportato il progetto ☕
            </div>
          </div>

          {/* Recent messages */}
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
              Messaggi recenti
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PAST_DONATIONS.map(({ name, amount: a, message: m, emoji }) => (
                <div key={name} style={{
                  padding: 12, borderRadius: 12,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14,
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: 'white',
                      }}>
                        {name[0]}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10 }}>{emoji}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706' }}>€{a}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>&ldquo;{m}&rdquo;</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
