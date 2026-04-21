'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@studio-l22/core'
import Link from 'next/link'
import {
  User, Mail, GraduationCap, MapPin, BookOpen, Edit3,
  Bell, Sun, Moon, Globe, Timer, Target, Lock,
  Download, Trash2, LogOut, Info, FileText, Shield,
  Mail as MailIcon, Heart, Crown, Star, Zap,
  Clock, CheckCircle, TrendingUp, Camera, Hash, AlignLeft,
  ChevronRight, Laptop, Smartphone,
} from 'lucide-react'

type Tab = 'profilo' | 'preferenze' | 'statistiche' | 'premium' | 'donazioni' | 'gestione' | 'info'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profilo',      label: 'Profilo',          icon: User },
  { key: 'preferenze',   label: 'Preferenze',        icon: Bell },
  { key: 'statistiche',  label: 'Statistiche',       icon: TrendingUp },
  { key: 'premium',      label: 'Samo L-22 Pro',    icon: Crown },
  { key: 'donazioni',    label: 'Offri un caffè',    icon: Heart },
  { key: 'gestione',     label: 'Gestione account',  icon: Lock },
  { key: 'info',         label: 'Info app',          icon: Info },
]

/* ── Toggle Switch ────────────────────────────────────────────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-checked={on}
      role="switch"
      style={{
        width: 46, height: 26, borderRadius: 13,
        background: on ? 'var(--primary)' : 'var(--border)',
        position: 'relative', border: 'none', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 10, background: 'white',
        position: 'absolute', top: 3,
        left: on ? 23 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

/* ── Section Header ───────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14 }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 1. PROFILO ────────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ProfiloSection() {
  const [form, setForm] = useState({
    firstName: 'Marco', lastName: 'Stellato',
    email: 'm.stellato@uniroma1.it',
    university: 'Sapienza - Roma',
    corso: 'L-22 Scienze Motorie',
    anno: '2',
    matricola: '',
    bio: '',
  })
  const [saved, setSaved] = useState(false)
  const [editAvatar, setEditAvatar] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setForm(f => ({
        ...f,
        email: user.email ?? f.email,
        firstName: user.user_metadata?.first_name ?? f.firstName,
        lastName: user.user_metadata?.last_name ?? f.lastName,
      }))
      const { data } = await supabase.from('profiles').select('first_name,last_name,anno_corso').eq('id', user.id).single()
      if (data) {
        setForm(f => ({
          ...f,
          firstName: data.first_name ?? f.firstName,
          lastName: data.last_name ?? f.lastName,
          anno: String(data.anno_corso ?? f.anno),
        }))
      }
    })
  }, [])

  const initials = `${form.firstName[0] || ''}${form.lastName[0] || ''}`.toUpperCase()

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      anno_corso: Number(form.anno),
    })
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const field = (label: string, key: keyof typeof form, icon: React.ElementType, readonly = false, placeholder = '') => {
    const Icon = icon
    return (
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={13} color="var(--muted)" /> {label}
        </label>
        <input
          className="form-input"
          value={form[key]}
          onChange={e => !readonly && setForm(f => ({ ...f, [key]: e.target.value }))}
          readOnly={readonly}
          placeholder={placeholder || label}
          style={readonly ? { background: 'var(--surface)', color: 'var(--muted)', cursor: 'not-allowed' } : {}}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Avatar */}
      <div className="card">
        <SectionTitle>Foto profilo</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              background: 'linear-gradient(135deg, #0055FF, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
            }}>
              {initials}
            </div>
            <button
              onClick={() => setEditAvatar(!editAvatar)}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: 13,
                background: 'var(--primary)', border: '2px solid var(--card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={12} color="white" />
            </button>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 4 }}>
              {form.firstName} {form.lastName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
              Avatar generato con le iniziali del nome
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>
                Carica foto
              </button>
              <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>
                Rimuovi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dati personali */}
      <div className="card">
        <SectionTitle>Dati personali</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {field('Nome', 'firstName', User)}
          {field('Cognome', 'lastName', User)}
          {field('Email', 'email', Mail, true)}
          {field('Numero matricola', 'matricola', Hash, false, 'Opzionale')}
        </div>
        <div style={{ marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlignLeft size={13} color="var(--muted)" /> Bio breve
            </label>
            <textarea
              className="form-input"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Scrivi qualcosa di te... (opzionale)"
              rows={3}
              maxLength={200}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
              {form.bio.length}/200
            </div>
          </div>
        </div>
      </div>

      {/* Dati accademici */}
      <div className="card">
        <SectionTitle>Dati accademici</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {field('Università / Ateneo', 'university', MapPin)}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GraduationCap size={13} color="var(--muted)" /> Corso di laurea
            </label>
            <input className="form-input" value={form.corso} readOnly style={{ background: 'var(--surface)', color: 'var(--muted)', cursor: 'not-allowed' }} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={13} color="var(--muted)" /> Anno di corso
            </label>
            <select
              className="form-input"
              value={form.anno}
              onChange={e => setForm(f => ({ ...f, anno: e.target.value }))}
            >
              <option value="1">1° Anno</option>
              <option value="2">2° Anno</option>
              <option value="3">3° Anno</option>
              <option value="99">Fuori corso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          style={{ padding: '11px 28px' }}
        >
          {saved ? <><CheckCircle size={16} /> Salvato!</> : <><Edit3 size={16} /> Salva modifiche</>}
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
            Profilo aggiornato con successo
          </span>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 2. PREFERENZE ─────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PreferenzeSection() {
  const [pomodoroMin, setPomodoroMin] = useState(25)
  const [studyGoal, setStudyGoal] = useState(2)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [lang, setLang] = useState('it')
  const [notif, setNotif] = useState({
    studioReminder: true, scadenzeEsami: true,
    flashcardReview: true, community: false,
  })
  const [saved, setSaved] = useState(false)

  const toggleNotif = (key: keyof typeof notif) =>
    setNotif(n => ({ ...n, [key]: !n[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    if (theme !== 'system') {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Pomodoro */}
      <div className="card">
        <SectionTitle>Timer pomodoro</SectionTitle>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Timer size={13} color="var(--muted)" /> Durata sessione default
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[15, 25, 30, 45].map(min => (
              <button
                key={min}
                onClick={() => setPomodoroMin(min)}
                style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12, border: '2px solid',
                  borderColor: pomodoroMin === min ? 'var(--primary)' : 'var(--border)',
                  background: pomodoroMin === min ? 'var(--primary-soft)' : 'var(--surface)',
                  color: pomodoroMin === min ? 'var(--primary)' : 'var(--muted)',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font)',
                  transition: 'all 0.15s',
                }}
              >
                {min}<span style={{ fontSize: 10, display: 'block', fontWeight: 500 }}>min</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Obiettivo studio */}
      <div className="card">
        <SectionTitle>Obiettivo studio</SectionTitle>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Target size={13} color="var(--muted)" /> Ore di studio al giorno: <strong style={{ color: 'var(--primary)', marginLeft: 4 }}>{studyGoal}h</strong>
          </label>
          <input
            type="range" min={1} max={8} value={studyGoal}
            onChange={e => setStudyGoal(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            <span>1h</span><span>4h</span><span>8h</span>
          </div>
        </div>
      </div>

      {/* Notifiche */}
      <div className="card">
        <SectionTitle>Notifiche</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { key: 'studioReminder' as const, label: 'Reminder studio', desc: 'Ti avvisa all\'ora di studiare' },
            { key: 'scadenzeEsami' as const, label: 'Scadenze esami', desc: 'Promemoria esami in avvicino' },
            { key: 'flashcardReview' as const, label: 'Review flashcard', desc: 'Ripeti le flashcard in scadenza' },
            { key: 'community' as const, label: 'Community', desc: 'Like, commenti e nuovi contenuti' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{desc}</div>
              </div>
              <Toggle on={notif[key]} onToggle={() => toggleNotif(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Lingua */}
      <div className="card">
        <SectionTitle>Lingua e tema</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={13} color="var(--muted)" /> Lingua interfaccia
            </label>
            <select className="form-input" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Tema */}
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: 12 }}>
              Tema interfaccia
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {([
                { key: 'light', label: 'Chiaro', icon: Sun },
                { key: 'dark',  label: 'Scuro',  icon: Moon },
                { key: 'system', label: 'Sistema', icon: Laptop },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  style={{
                    flex: 1, padding: '14px 8px', borderRadius: 12, border: '2px solid',
                    borderColor: theme === key ? 'var(--primary)' : 'var(--border)',
                    background: theme === key ? 'var(--primary-soft)' : 'var(--surface)',
                    color: theme === key ? 'var(--primary)' : 'var(--muted)',
                    cursor: 'pointer', fontFamily: 'var(--font)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ padding: '11px 28px' }}>
          {saved ? <><CheckCircle size={16} /> Salvato!</> : 'Salva preferenze'}
        </button>
        {saved && <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Preferenze aggiornate</span>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 3. STATISTICHE ────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StatisticheSection() {
  const stats = [
    { label: 'Data iscrizione',      value: '21 Apr 2025',   icon: Clock,        color: '#0055FF' },
    { label: 'Ore studiate (tot.)',  value: '248h',          icon: Target,       color: '#7C3AED' },
    { label: 'Quiz completati',      value: '134',           icon: CheckCircle,  color: '#22C55E' },
    { label: 'Flashcard reviewate',  value: '1.842',         icon: BookOpen,     color: '#F59E0B' },
    { label: 'Note create',          value: '67',            icon: AlignLeft,    color: '#3B82F6' },
    { label: 'Streak massimo',       value: '18 giorni',     icon: TrendingUp,   color: '#F43F5E' },
    { label: 'Livello attuale',      value: 'Studente Lv.4', icon: Star,         color: '#F59E0B' },
    { label: 'XP totali',            value: '1.240 XP',      icon: Zap,          color: '#8B5CF6' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card">
        <SectionTitle>Il tuo percorso su Samo L-22</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              padding: 16, borderRadius: 12,
              background: `${color}10`, border: `1px solid ${color}25`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP progress */}
      <div className="card">
        <SectionTitle>Progressione livello</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Studente Lv. 4</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>1.240 / 2.000 XP per il prossimo livello</div>
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: 'linear-gradient(135deg, #7C3AED, #0055FF)',
            fontSize: 12, fontWeight: 700, color: 'white',
          }}>
            Lv. 4
          </div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: '62%', background: 'linear-gradient(90deg, #7C3AED, #0055FF)' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>62% completato — 760 XP al prossimo livello</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 4. PREMIUM ────────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PremiumSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [isPro, setIsPro] = useState(false)
  const [subInfo, setSubInfo] = useState<{ plan: string; expires_at: string | null } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('user_subscriptions')
        .select('plan,status,expires_at,billing_interval')
        .eq('user_id', user.id)
        .single()
      if (data?.plan === 'pro' && data.status === 'active') {
        setIsPro(true)
        setSubInfo({ plan: data.plan, expires_at: data.expires_at })
        setBilling((data.billing_interval as 'monthly' | 'yearly') ?? 'yearly')
      }
    })
  }, [])

  const freeFeatures = [
    'Quiz e flashcard illimitati',
    'Note e appunti',
    'Pomodoro timer',
    'CFU tracker',
    'Community base',
    'AI Samo: 10 msg/giorno',
    'Generazione AI: 5 al giorno',
  ]

  const proFeatures = [
    'Tutto del piano Free',
    'AI Samo illimitato',
    'Generazione quiz/flashcard illimitata',
    'Q&A documenti illimitato',
    'Nessuna pubblicità',
    'Temi esclusivi',
    'Badge Pro esclusivo',
    'Priorità nel supporto',
    'Export note in PDF',
    'Statistiche avanzate',
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="account-premium-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Crown size={28} color="#F59E0B" />
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)' }}>Samo L-22 Pro</div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Sblocca tutto il potenziale dell&apos;app. AI illimitata, nessun limite, nessuna pubblicità.
        </div>
      </div>

      {/* Billing toggle */}
      {!isPro && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', gap: 4,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 999, padding: 4, position: 'relative',
          }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '8px 20px', borderRadius: 999, border: 'none',
                  fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: billing === b ? 'var(--card)' : 'transparent',
                  color: billing === b ? 'var(--color)' : 'var(--muted)',
                  boxShadow: billing === b ? 'var(--shadow-sm)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {b === 'monthly' ? 'Mensile' : 'Annuale'}
                {b === 'yearly' && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
                    background: '#22C55E20', color: '#22C55E',
                  }}>-50%</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Free card */}
        <div className="card" style={{ opacity: isPro ? 0.6 : 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Piano gratuito
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color)', marginBottom: 4 }}>€0</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>per sempre</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {freeFeatures.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: 'var(--color)' }}>{f}</span>
              </div>
            ))}
          </div>
          {!isPro && (
            <div style={{ marginTop: 16, padding: '8px 14px', borderRadius: 10, background: 'var(--surface)', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
              Piano attuale
            </div>
          )}
        </div>

        {/* Pro card */}
        <div className="account-pro-card">
          <div style={{
            position: 'absolute', top: -1, left: 0, right: 0,
            height: 4, borderRadius: '16px 16px 0 0',
            background: 'linear-gradient(90deg, #F59E0B, #D97706)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pro
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: '#FEF3C7', color: '#D97706' }}>
              CONSIGLIATO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color)' }}>
              €{billing === 'monthly' ? '4,99' : '2,50'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>/mese</div>
          </div>

          {billing === 'yearly' && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
              Fatturato €29,99 annualmente
            </div>
          )}
          <div style={{ marginBottom: 16 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {proFeatures.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: 'var(--color)' }}>{f}</span>
              </div>
            ))}
          </div>

          {!isPro && (
            <button
              className="account-pro-btn"
              onClick={() => alert('Coming soon — Disponibile a breve! Contattaci a support@samo-l22.app per info.')}
            >
              <Crown size={16} />
              Passa a Pro — €{billing === 'monthly' ? '4,99/mese' : '29,99/anno'}
            </button>
          )}
        </div>
      </div>

      {!isPro && (
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
          Nessun vincolo. Cancella quando vuoi. Pagamento sicuro con Stripe.
        </div>
      )}

      {isPro && (
        <div className="card" style={{ borderColor: '#F59E0B40' }}>
          <SectionTitle>Il tuo abbonamento</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#D97706' }}>Samo L-22 Pro — Annuale</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Rinnovo il 21 Aprile 2027</div>
            </div>
            <button className="btn btn-outline" style={{ fontSize: 12 }}>Gestisci abbonamento</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 5. DONAZIONI ──────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function DonazioniSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const [donated, setDonated] = useState(false)

  const amounts = [2, 5, 10]
  const samoMessages: Record<number, string> = {
    2: 'Grazie! Ogni caffè ci aiuta a tenere Samo sveglio! ☕',
    5: 'Wow, cinque caffè! Samo è pieno di energia per aiutarti! 🐕',
    10: 'Dieci euro?! Sei il migliore! Samo ti ama! 🐕❤️',
  }

  const handleDonate = async () => {
    const amt = selected ?? (custom ? parseFloat(custom) : null)
    if (!amt || amt <= 0) return
    const amountCents = Math.round(amt * 100)
    // Salva nel DB
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('donations').insert({
      user_id: user?.id ?? null,
      amount_cents: amountCents,
      currency: 'EUR',
      payment_provider: 'paypal',
      status: 'completed',
    })
    // Apri PayPal in nuova tab
    const paypalUrl = `https://paypal.me/samol22/${amt}`
    window.open(paypalUrl, '_blank')
    setDonated(true)
  }

  const amount = selected ?? (custom ? parseFloat(custom) : null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Samoyed card */}
      <div className="account-donation-hero">
        {/* Samoyed SVG */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Body */}
            <ellipse cx="60" cy="88" rx="32" ry="22" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1.5"/>
            {/* Head */}
            <circle cx="60" cy="52" r="30" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            {/* Left ear */}
            <path d="M36 34 C28 18 42 10 46 26" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            {/* Right ear */}
            <path d="M84 34 C92 18 78 10 74 26" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            {/* Eyes */}
            <circle cx="50" cy="48" r="4" fill="#1F2937"/>
            <circle cx="70" cy="48" r="4" fill="#1F2937"/>
            <circle cx="51.5" cy="46.5" r="1.5" fill="white"/>
            <circle cx="71.5" cy="46.5" r="1.5" fill="white"/>
            {/* Nose */}
            <ellipse cx="60" cy="57" rx="4.5" ry="3" fill="#111827"/>
            {/* Smile */}
            <path d="M54 62 Q60 67 66 62" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            {/* Coffee cup */}
            <rect x="76" y="82" width="24" height="20" rx="4" fill="#F59E0B"/>
            <rect x="74" y="78" width="28" height="6" rx="3" fill="#D97706"/>
            <path d="M100 85 Q108 89 100 97" stroke="#D97706" strokeWidth="3" strokeLinecap="round" fill="none"/>
            {/* Steam */}
            <path d="M82 74 Q84 68 82 62" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M88 72 Q90 66 88 60" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Paw */}
            <ellipse cx="82" cy="83" rx="9" ry="5" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1"/>
            {/* Cup text */}
            <text x="81" y="94" fontSize="7" fill="white" fontWeight="bold">☕</text>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', marginBottom: 8 }}>
            Offri un caffè a Samo 🐾
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
            Se Samo L-22 ti aiuta nello studio, puoi offrire un caffè al team!
            Ogni piccolo contributo ci aiuta a migliorare l&apos;app e a tenere Samo
            (il nostro samoiedo mascotte) sempre in forma.
          </div>
        </div>
      </div>

      {/* Donation amounts */}
      {!donated ? (
        <div className="card">
          <SectionTitle>Scegli quanto offrire</SectionTitle>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {amounts.map(a => (
              <button
                key={a}
                onClick={() => { setSelected(a); setCustom('') }}
                style={{
                  flex: 1, padding: '16px 8px', borderRadius: 14, border: '2px solid',
                  borderColor: selected === a ? '#F59E0B' : 'var(--border)',
                  background: selected === a ? '#FFFBEB' : 'var(--surface)',
                  cursor: 'pointer', fontFamily: 'var(--font)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: selected === a ? '#D97706' : 'var(--color)' }}>
                  €{a}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                  {a === 2 ? '1 caffè ☕' : a === 5 ? '2 caffè ☕☕' : '4 caffè ☕☕☕☕'}
                </div>
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Oppure importo personalizzato (€)</label>
            <input
              className="form-input"
              type="number" min="1" max="999"
              placeholder="es. 3, 7, 15..."
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(null) }}
            />
          </div>

          {(selected !== null || custom) && (
            <div style={{
              marginTop: 16, padding: 14, borderRadius: 12,
              background: '#FFFBEB', border: '1px solid #F59E0B40',
              fontSize: 13, color: '#92400E', fontStyle: 'italic',
            }}>
              {samoMessages[selected ?? 0] || `Grazie per il tuo contributo di €${custom}! Samo ti ringrazia! 🐕`}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              className="btn"
              onClick={handleDonate}
              disabled={!selected && !custom}
              style={{
                flex: 1, padding: '13px 0', borderRadius: 12,
                background: selected || custom ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--border)',
                color: selected || custom ? 'white' : 'var(--muted)',
                fontWeight: 700, fontSize: 15, justifyContent: 'center',
                cursor: selected || custom ? 'pointer' : 'not-allowed',
                border: 'none', fontFamily: 'var(--font)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Heart size={16} />
              Dona con PayPal {selected || custom ? `— €${selected ?? custom}` : ''}
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            Pagamento sicuro. Non è richiesto un account PayPal.
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 32, border: '2px solid #F59E0B40', background: '#FFFBEB' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#D97706', marginBottom: 8 }}>Grazie mille!</div>
          <div style={{ fontSize: 14, color: '#92400E', lineHeight: 1.5 }}>
            La tua donazione di <strong>€{amount}</strong> è stata ricevuta.<br />
            Samo e tutto il team ti ringraziano di cuore! 🐾
          </div>
          <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => { setDonated(false); setSelected(null); setCustom('') }}>
            Dona di nuovo
          </button>
        </div>
      )}

      {/* Counter */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Donazioni ricevute dalla community</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#F59E0B', letterSpacing: -1 }}>€ 1.247</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>da 312 studenti — grazie a tutti! 🐕</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 6. GESTIONE ───────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function GestioneSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteStep, setDeleteStep] = useState(0)
  const [deleteInput, setDeleteInput] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Cambia password */}
      <div className="card">
        <SectionTitle>Sicurezza</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Password attuale</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Nuova password</label>
            <input className="form-input" type="password" placeholder="Minimo 8 caratteri" />
          </div>
          <div className="form-group">
            <label className="form-label">Conferma nuova password</label>
            <input className="form-input" type="password" placeholder="Ripeti la nuova password" />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
            <Lock size={14} /> Aggiorna password
          </button>
        </div>
      </div>

      {/* Dati */}
      <div className="card">
        <SectionTitle>I tuoi dati</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)' }}>Esporta i miei dati</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Scarica un archivio ZIP con tutte le tue note, quiz e flashcard</div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 13, flexShrink: 0 }}>
              <Download size={14} /> Esporta
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)' }}>Logout</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Esci dall&apos;account su questo dispositivo</div>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 13, flexShrink: 0 }}
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/login'
              }}
            >
              <LogOut size={14} /> Esci
            </button>
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="card" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
        <SectionTitle>Zona pericolosa</SectionTitle>
        {!showDeleteConfirm ? (
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>
              L&apos;eliminazione dell&apos;account è permanente. Tutti i tuoi dati verranno rimossi e non potranno essere recuperati.
            </div>
            <button
              className="btn"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <Trash2 size={14} /> Elimina account
            </button>
          </div>
        ) : deleteStep === 0 ? (
          <div style={{ padding: 16, background: 'var(--error-soft)', borderRadius: 12, border: '1px solid rgba(244,63,94,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--error)', marginBottom: 8 }}>Sei sicuro?</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
              Questa azione eliminerà permanentemente tutti i tuoi dati: note, quiz, flashcard, statistiche e profilo.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Annulla</button>
              <button className="btn" onClick={() => setDeleteStep(1)} style={{ background: 'var(--error)', color: 'white' }}>
                Sì, voglio eliminare
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: 16, background: 'var(--error-soft)', borderRadius: 12, border: '1px solid rgba(244,63,94,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--error)', marginBottom: 8 }}>Conferma finale</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
              Scrivi <strong>ELIMINA</strong> per confermare:
            </div>
            <input
              className="form-input" value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Scrivi ELIMINA"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => { setShowDeleteConfirm(false); setDeleteStep(0); setDeleteInput('') }}>
                Annulla
              </button>
              <button
                className="btn"
                disabled={deleteInput !== 'ELIMINA'}
                style={{
                  background: deleteInput === 'ELIMINA' ? 'var(--error)' : 'var(--border)',
                  color: deleteInput === 'ELIMINA' ? 'white' : 'var(--muted)',
                  cursor: deleteInput === 'ELIMINA' ? 'pointer' : 'not-allowed',
                }}
              >
                Elimina definitivamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── 7. INFO ───────────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function InfoSection() {
  const items = [
    { icon: Smartphone, label: 'Versione app', value: '1.0.0 (build 6)' },
    { icon: FileText, label: 'Termini di servizio', value: 'Visualizza →', href: '#' },
    { icon: Shield, label: 'Privacy policy', value: 'Visualizza →', href: '#' },
    { icon: MailIcon, label: 'Contattaci', value: 'support@samo-l22.app', href: 'mailto:support@samo-l22.app' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card">
        <SectionTitle>Informazioni</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map(({ icon: Icon, label, value, href }, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="var(--primary)" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color)' }}>{label}</span>
              </div>
              {href ? (
                <a href={href} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{value}</a>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🐕</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color)', marginBottom: 6 }}>Samo L-22</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
          Creato con ❤️ per gli studenti di Scienze Motorie.<br />
          Samo il samoiedo vi augura buono studio!
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          © 2025–2026 Samo L-22. Tutti i diritti riservati.
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── PAGE ──────────────────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function AccountPage() {
  const [tab, setTab] = useState<Tab>('profilo')

  const activeTab = TABS.find(t => t.key === tab)!

  const sectionMap: Record<Tab, React.ReactNode> = {
    profilo:      <ProfiloSection />,
    preferenze:   <PreferenzeSection />,
    statistiche:  <StatisticheSection />,
    premium:      <PremiumSection />,
    donazioni:    <DonazioniSection />,
    gestione:     <GestioneSection />,
    info:         <InfoSection />,
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Account</h1>
        <p className="page-subtitle">Gestisci il tuo profilo, le preferenze e il tuo piano</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar tabs */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--card-border)',
          borderRadius: 16, padding: 8,
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky', top: 24,
        }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500,
                color: tab === key ? 'var(--nav-active)' : 'var(--nav-item)',
                background: tab === key ? 'var(--nav-active-bg)' : 'transparent',
                marginBottom: 2,
                transition: 'background 0.15s, color 0.15s',
                textAlign: 'left',
              } as React.CSSProperties}
            >
              <Icon size={16} />
              <span>{label}</span>
              {key === 'premium' && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, fontWeight: 700,
                  padding: '2px 5px', borderRadius: 4,
                  background: '#FEF3C7', color: '#D97706',
                }}>PRO</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {sectionMap[tab]}
        </div>
      </div>
    </div>
  )
}
