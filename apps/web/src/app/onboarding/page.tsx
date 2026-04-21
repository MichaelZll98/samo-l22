'use client'

import { useState } from 'react'
import { GraduationCap, MapPin, BookOpen, ChevronRight, Check, ChevronLeft } from 'lucide-react'

const STEPS = ['Ateneo', 'Anno', 'Materie']

const universities = [
  'Università degli Studi di Roma "La Sapienza"',
  'Università degli Studi di Milano',
  'Università degli Studi di Torino',
  'Università degli Studi di Napoli Federico II',
  'Università degli Studi di Bologna',
  'Università degli Studi di Padova',
  'Altro ateneo',
]

const years = ['1° Anno', '2° Anno', 'Fuori corso']

const allSubjects = [
  { id: '1', name: 'Anatomia Umana', cfu: 9, color: '#FF6B6B' },
  { id: '2', name: 'Fisiologia Applicata', cfu: 9, color: '#4ECDC4' },
  { id: '3', name: 'Biomeccanica', cfu: 6, color: '#45B7D1' },
  { id: '4', name: 'Teoria e Metodologia dell\'Allenamento', cfu: 12, color: '#96CEB4' },
  { id: '5', name: 'Nutrizione e Integrazione Sportiva', cfu: 6, color: '#FFEAA7' },
  { id: '6', name: 'Patologie dello Sport', cfu: 6, color: '#DDA0DD' },
  { id: '7', name: 'Farmacologia e Doping', cfu: 6, color: '#98D8C8' },
  { id: '8', name: 'Radiologia e Diagnostica', cfu: 6, color: '#F7DC6F' },
  { id: '9', name: 'Chirurgia Ortopedica', cfu: 9, color: '#BB8FCE' },
  { id: '10', name: 'Riabilitazione Funzionale', cfu: 12, color: '#82E0AA' },
  { id: '11', name: 'Psicologia dello Sport', cfu: 6, color: '#F1948A' },
  { id: '12', name: 'Statistica e Metodologia Ricerca', cfu: 6, color: '#85C1E9' },
  { id: '13', name: 'Etica e Deontologia', cfu: 6, color: '#FAD7A0' },
  { id: '14', name: 'Tesi di Laurea Magistrale', cfu: 15, color: '#A9CCE3' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [university, setUniversity] = useState('')
  const [year, setYear] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const canContinue = [
    university !== '',
    year !== '',
    selectedSubjects.length > 0,
  ][step]

  return (
    <div className="onboarding-shell">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #0055FF, #7C3AED)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GraduationCap size={18} color="white" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)' }}>Samo L-22</span>
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16,
                background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--surface)',
                border: `2px solid ${i <= step ? 'transparent' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: i <= step ? 'white' : 'var(--muted)',
                fontSize: 13, fontWeight: 700,
              }}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--primary)' : 'var(--muted)' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 80, height: 2, background: i < step ? 'var(--primary)' : 'var(--border)', margin: '0 8px', marginBottom: 20 }} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="auth-card" style={{ maxWidth: 540 }}>
        {/* Step 0: Ateneo */}
        {step === 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <MapPin size={22} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)' }}>Seleziona il tuo ateneo</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Dove stai seguendo il corso L-22?</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {universities.map((uni) => (
                <button
                  key={uni}
                  onClick={() => setUniversity(uni)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: `1.5px solid ${university === uni ? 'var(--primary)' : 'var(--border)'}`,
                    background: university === uni ? 'var(--primary-soft)' : 'var(--surface)',
                    color: university === uni ? 'var(--primary)' : 'var(--color)',
                    fontSize: 14, fontWeight: university === uni ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Anno */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <BookOpen size={22} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)' }}>Quale anno frequenti?</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Così posso personalizzare il piano di studio</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    border: `1.5px solid ${year === y ? 'var(--primary)' : 'var(--border)'}`,
                    background: year === y ? 'var(--primary-soft)' : 'var(--surface)',
                    color: year === y ? 'var(--primary)' : 'var(--color)',
                    fontSize: 16, fontWeight: year === y ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Materie */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)', marginBottom: 4 }}>
                Seleziona le materie
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Scegli le materie che stai studiando ({selectedSubjects.length} selezionate)
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 360, overflowY: 'auto' }}>
              {allSubjects.map(({ id, name, cfu, color }) => {
                const selected = selectedSubjects.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggleSubject(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: `1.5px solid ${selected ? color : 'var(--border)'}`,
                      background: selected ? `${color}18` : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: selected ? color : 'var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selected && <Check size={12} color="white" />}
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: selected ? 600 : 400, color: 'var(--color)' }}>
                      {name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{cfu} CFU</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={16} /> Indietro
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canContinue}
              style={{ opacity: canContinue ? 1 : 0.5, cursor: canContinue ? 'pointer' : 'not-allowed' }}
            >
              Avanti <ChevronRight size={16} />
            </button>
          ) : (
            <a href="/" className="btn btn-primary">
              Inizia! <ChevronRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
