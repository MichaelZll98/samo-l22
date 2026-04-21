import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  User, Mail, BookOpen, Edit3,
  Globe, Target, Lock, Download,
  Trash2, LogOut, Info, FileText, Shield, Heart,
  Crown, Star, Zap, Clock, CheckCircle,
  TrendingUp, Camera, ChevronRight, Coffee,
} from 'lucide-react-native'
import { useState } from 'react'

/* ── Colors ──────────────────────────────────────────────────────────────── */
const C = {
  primary:  '#0055FF',
  gold:     '#F59E0B',
  goldDeep: '#D97706',
  goldSoft: '#FFFBEB',
  success:  '#22C55E',
  error:    '#F43F5E',
  warning:  '#F59E0B',
  purple:   '#7C3AED',
  bg:       '#F9FAFB',
  card:     '#FFFFFF',
  color:    '#111827',
  muted:    '#6B7280',
  border:   '#E5E7EB',
  surface:  '#F3F4F6',
}

type Section = 'profilo' | 'preferenze' | 'statistiche' | 'premium' | 'donazioni' | 'gestione' | 'info'

/* ── Section label ───────────────────────────────────────────────────────── */
function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
  )
}

/* ── Info row (settings style) ───────────────────────────────────────────── */
function InfoRow({ label, value, icon: Icon, last = false }: {
  label: string; value: string; icon: React.ElementType; last?: boolean
}) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.infoIcon}>
        <Icon size={16} color={C.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  )
}

/* ── Toggle row ──────────────────────────────────────────────────────────── */
function ToggleRow({ label, desc, value, onToggle, last = false }: {
  label: string; desc?: string; value: boolean; onToggle: () => void; last?: boolean
}) {
  return (
    <View style={[styles.toggleRow, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {desc && <Text style={styles.toggleDesc}>{desc}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: C.border, true: C.primary }}
        thumbColor="white"
      />
    </View>
  )
}

/* ── Setting item (tap) ──────────────────────────────────────────────────── */
function SettingItem({ icon: Icon, label, value, onPress, color, last = false }: {
  icon: React.ElementType; label: string; value?: string;
  onPress?: () => void; color?: string; last?: boolean
}) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, last && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: color ? `${color}18` : C.surface }]}>
        <Icon size={18} color={color || C.primary} />
      </View>
      <Text style={[styles.settingLabel, color && { color }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <ChevronRight size={16} color={C.muted} />
      </View>
    </TouchableOpacity>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── SECTIONS ────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ProfiloSection({ onBack }: { onBack: () => void }) {
  const [firstName, setFirstName] = useState('Marco')
  const [lastName, setLastName] = useState('Stellato')
  const [university, setUniversity] = useState('Sapienza - Roma')
  const [anno, setAnno] = useState('2° Anno')
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <View>
      {/* Avatar */}
      <View style={styles.card}>
        <SectionHeader title="Foto profilo" />
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>MS</Text>
            </View>
            <TouchableOpacity style={styles.avatarCameraBtn} activeOpacity={0.8}>
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>Marco Stellato</Text>
          <Text style={styles.avatarEmail}>m.stellato@uniroma1.it</Text>
          <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.7}>
            <Text style={styles.editAvatarBtnText}>Carica foto profilo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal */}
      <View style={styles.card}>
        <SectionHeader title="Dati personali" />
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Nome</Text>
          <TextInput style={styles.formInput} value={firstName} onChangeText={setFirstName} placeholder="Nome" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Cognome</Text>
          <TextInput style={styles.formInput} value={lastName} onChangeText={setLastName} placeholder="Cognome" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email (read-only)</Text>
          <TextInput style={[styles.formInput, styles.formInputReadonly]} value="m.stellato@uniroma1.it" editable={false} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Bio breve (opzionale)</Text>
          <TextInput
            style={[styles.formInput, { minHeight: 80, textAlignVertical: 'top' }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Scrivi qualcosa di te..."
            multiline
            maxLength={200}
          />
        </View>
      </View>

      {/* Academic */}
      <View style={styles.card}>
        <SectionHeader title="Dati accademici" />
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Università / Ateneo</Text>
          <TextInput style={styles.formInput} value={university} onChangeText={setUniversity} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Corso di laurea</Text>
          <TextInput style={[styles.formInput, styles.formInputReadonly]} value="L-22 Scienze Motorie" editable={false} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Anno di corso</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['1° Anno', '2° Anno', '3° Anno', 'F.C.'].map(a => (
              <TouchableOpacity
                key={a}
                onPress={() => setAnno(a)}
                style={[styles.annoPill, anno === a && styles.annoPillActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.annoPillText, anno === a && styles.annoPillTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        {saved
          ? <><CheckCircle size={18} color="white" /><Text style={styles.saveBtnText}>  Salvato!</Text></>
          : <><Edit3 size={18} color="white" /><Text style={styles.saveBtnText}>  Salva modifiche</Text></>
        }
      </TouchableOpacity>
    </View>
  )
}

function PreferenzeSection({ onBack }: { onBack: () => void }) {
  const [pomodoroMin, setPomodoroMin] = useState(25)
  const [studyGoal, setStudyGoal] = useState(2)
  const [notif, setNotif] = useState({ studio: true, esami: true, flashcard: true, community: false })
  const toggleNotif = (key: keyof typeof notif) => setNotif(n => ({ ...n, [key]: !n[key] }))

  return (
    <View>
      <View style={styles.card}>
        <SectionHeader title="Pomodoro timer" />
        <Text style={styles.prefsLabel}>Durata sessione default</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          {[15, 25, 30, 45].map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => setPomodoroMin(m)}
              style={[styles.pomoPill, pomodoroMin === m && styles.pomoPillActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.pomoPillValue, pomodoroMin === m && { color: C.primary }]}>{m}</Text>
              <Text style={[styles.pomoPillUnit, pomodoroMin === m && { color: C.primary }]}>min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Obiettivo giornaliero" />
        <Text style={styles.prefsLabel}>
          Ore di studio al giorno: <Text style={{ color: C.primary, fontWeight: '700' }}>{studyGoal}h</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map(h => (
            <TouchableOpacity
              key={h}
              onPress={() => setStudyGoal(h)}
              style={[styles.hourPill, studyGoal === h && styles.hourPillActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.hourPillText, studyGoal === h && { color: C.primary }]}>{h}h</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Notifiche" />
        <ToggleRow label="Reminder studio" desc="Ti avvisa all'ora di studiare" value={notif.studio} onToggle={() => toggleNotif('studio')} />
        <ToggleRow label="Scadenze esami" desc="Promemoria esami in avvicino" value={notif.esami} onToggle={() => toggleNotif('esami')} />
        <ToggleRow label="Review flashcard" desc="Ripeti le flashcard in scadenza" value={notif.flashcard} onToggle={() => toggleNotif('flashcard')} />
        <ToggleRow label="Community" desc="Like, commenti e nuovi contenuti" value={notif.community} onToggle={() => toggleNotif('community')} last />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Lingua" />
        <SettingItem icon={Globe} label="Lingua interfaccia" value="Italiano" last />
      </View>
    </View>
  )
}

function StatisticheSection({ onBack }: { onBack: () => void }) {
  const stats = [
    { label: 'Data iscrizione',    value: '21 Apr 2025',  icon: Clock,        color: C.primary },
    { label: 'Ore studiate',       value: '248h',          icon: Target,       color: C.purple },
    { label: 'Quiz completati',    value: '134',           icon: CheckCircle,  color: C.success },
    { label: 'Flashcard review',   value: '1.842',         icon: BookOpen,     color: C.warning },
    { label: 'Note create',        value: '67',            icon: FileText,     color: '#3B82F6' },
    { label: 'Streak massimo',     value: '18 giorni',     icon: TrendingUp,   color: C.error },
    { label: 'Livello',            value: 'Studente Lv.4', icon: Star,         color: C.gold },
    { label: 'XP totali',          value: '1.240 XP',      icon: Zap,          color: C.purple },
  ]

  return (
    <View>
      <View style={styles.card}>
        <SectionHeader title="Il tuo percorso" />
        <View style={styles.statsGrid}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <View key={label} style={[styles.statGridItem, { borderColor: `${color}25`, backgroundColor: `${color}10` }]}>
              <View style={[styles.statGridIcon, { backgroundColor: `${color}20` }]}>
                <Icon size={18} color={color} />
              </View>
              <Text style={[styles.statGridValue, { color }]}>{value}</Text>
              <Text style={styles.statGridLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.card}>
        <SectionHeader title="Progressione livello" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.color }}>Studente Lv. 4</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>1.240 / 2.000 XP</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Lv. 4</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '62%' }]} />
        </View>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>62% — 760 XP al prossimo livello</Text>
      </View>
    </View>
  )
}

function PremiumSection({ onBack }: { onBack: () => void }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const isPro = false

  const proFeatures = [
    'AI Samo illimitata',
    'Generazione quiz/flashcard illimitata',
    'Q&A documenti illimitato',
    'Nessuna pubblicità',
    'Temi esclusivi + Badge Pro',
    'Export note in PDF',
    'Statistiche avanzate',
    'Supporto prioritario',
  ]

  return (
    <View>
      {/* Hero */}
      <View style={styles.premiumHero}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Crown size={36} color="#FCD34D" style={{ marginBottom: 8 }} />
          <Text style={styles.premiumHeroTitle}>Samo L-22 Pro</Text>
          <Text style={styles.premiumHeroSub}>Studia senza limiti</Text>
        </View>

        {/* Billing toggle */}
        <View style={styles.billingToggle}>
          {(['monthly', 'yearly'] as const).map(b => (
            <TouchableOpacity
              key={b}
              onPress={() => setBilling(b)}
              style={[styles.billingOption, billing === b && styles.billingOptionActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.billingOptionText, billing === b && { color: C.goldDeep }]}>
                {b === 'monthly' ? 'Mensile' : 'Annuale'}
              </Text>
              {b === 'yearly' && <Text style={styles.billingBadge}>-50%</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Price */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
            <Text style={styles.premiumPrice}>€{billing === 'monthly' ? '4,99' : '2,50'}</Text>
            <Text style={styles.premiumPriceUnit}>/mese</Text>
          </View>
          {billing === 'yearly' && (
            <Text style={styles.premiumYearly}>Fatturato €29,99 annualmente · risparmi 50%</Text>
          )}
        </View>
      </View>

      {/* Features */}
      <View style={styles.card}>
        <SectionHeader title="Cosa include Pro" />
        {proFeatures.map((f, i) => (
          <View key={f} style={[styles.featureRow, i === proFeatures.length - 1 && { borderBottomWidth: 0 }]}>
            <Star size={14} color={C.gold} fill={C.gold} style={{ marginRight: 10 }} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      {!isPro && (
        <TouchableOpacity style={styles.proCTA} activeOpacity={0.85}>
          <Crown size={20} color="white" />
          <Text style={styles.proCTAText}>
            Passa a Pro — €{billing === 'yearly' ? '29,99/anno' : '4,99/mese'}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 8 }}>
        Nessun vincolo. Cancella quando vuoi.
      </Text>
    </View>
  )
}

function DonazioniSection({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [donated, setDonated] = useState(false)

  const handleDonate = () => {
    if (!selected) return
    setDonated(true)
  }

  const messages: Record<number, string> = {
    2: 'Grazie! Ogni caffè aiuta a tenere Samo sveglio! ☕',
    5: 'Cinque euro! Samo è pieno di energia per aiutarti! 🐕',
    10: 'Dieci euro?! Sei un eroe! Samo ti ama! 🐕❤️',
  }

  if (donated) {
    return (
      <View style={[styles.card, { alignItems: 'center', padding: 40 }]}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>🎉</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: C.goldDeep, marginBottom: 8 }}>Grazie mille!</Text>
        <Text style={{ fontSize: 14, color: '#92400E', textAlign: 'center', lineHeight: 22 }}>
          La tua donazione di €{selected} è stata ricevuta!{'\n'}
          Samo e tutto il team ti ringraziano di cuore! 🐾
        </Text>
        <TouchableOpacity
          style={[styles.editAvatarBtn, { marginTop: 24 }]}
          onPress={() => { setDonated(false); setSelected(null) }}
        >
          <Text style={styles.editAvatarBtnText}>Dona di nuovo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {/* Hero */}
      <View style={styles.donationHero}>
        <Text style={{ fontSize: 64, textAlign: 'center', marginBottom: 8 }}>🐕☕</Text>
        <Text style={styles.donationTitle}>Offri un caffè a Samo!</Text>
        <Text style={styles.donationSub}>
          Se Samo L-22 ti aiuta nello studio, puoi supportare il progetto!
          Ogni contributo aiuta a migliorare l&apos;app.
        </Text>
      </View>

      {/* Amounts */}
      <View style={styles.card}>
        <SectionHeader title="Scegli importo" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {([2, 5, 10] as const).map(a => (
            <TouchableOpacity
              key={a}
              onPress={() => setSelected(a)}
              style={[styles.donationPill, selected === a && styles.donationPillActive]}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>{a === 2 ? '☕' : a === 5 ? '☕☕' : '☕☕☕'}</Text>
              <Text style={[styles.donationPillAmount, selected === a && { color: C.goldDeep }]}>€{a}</Text>
              <Text style={styles.donationPillLabel}>{a === 2 ? '1 caffè' : a === 5 ? '2 caffè' : '4 caffè'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected && (
          <View style={styles.samoMessage}>
            <Text style={styles.samoMessageText}>🐕 &ldquo;{messages[selected]}&rdquo;</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.donationCTA, !selected && { opacity: 0.5 }]}
        onPress={handleDonate}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <Heart size={20} color="white" />
        <Text style={styles.donationCTAText}>
          {selected ? `Dona €${selected} con PayPal` : 'Scegli un importo'}
        </Text>
      </TouchableOpacity>

      {/* Counter */}
      <View style={[styles.card, { alignItems: 'center' }]}>
        <Coffee size={24} color={C.goldDeep} style={{ marginBottom: 6 }} />
        <Text style={{ fontSize: 28, fontWeight: '900', color: C.gold, letterSpacing: -0.5 }}>€ 1.247</Text>
        <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>donati dalla community</Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>312 studenti vi hanno già supportato ☕</Text>
      </View>
    </View>
  )
}

function GestioneSection({ onBack }: { onBack: () => void }) {
  const handleDeleteAccount = () => {
    Alert.alert(
      'Elimina account',
      'Sei sicuro? Questa azione è permanente e irreversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina', style: 'destructive',
          onPress: () => Alert.alert('Conferma finale', 'Digita ELIMINA nell\'app web per confermare.'),
        },
      ]
    )
  }

  return (
    <View>
      <View style={styles.card}>
        <SectionHeader title="Sicurezza" />
        <SettingItem icon={Lock} label="Cambia password" onPress={() => {}} last />
      </View>

      <View style={styles.card}>
        <SectionHeader title="I tuoi dati" />
        <SettingItem icon={Download} label="Esporta i miei dati" onPress={() => {}} />
        <SettingItem icon={LogOut} label="Logout" onPress={() => {}} last />
      </View>

      <View style={[styles.card, { borderColor: 'rgba(244,63,94,0.3)', borderWidth: 1.5 }]}>
        <SectionHeader title="Zona pericolosa" />
        <SettingItem
          icon={Trash2}
          label="Elimina account"
          onPress={handleDeleteAccount}
          color={C.error}
          last
        />
      </View>
    </View>
  )
}

function InfoSection({ onBack }: { onBack: () => void }) {
  return (
    <View>
      <View style={styles.card}>
        <SectionHeader title="App" />
        <SettingItem icon={Info} label="Versione" value="1.0.0 (6)" last={false} />
        <SettingItem icon={FileText} label="Termini di servizio" onPress={() => {}} />
        <SettingItem icon={Shield} label="Privacy policy" onPress={() => {}} />
        <SettingItem icon={Mail} label="Contattaci" value="support@samo-l22.app" last />
      </View>

      <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🐕</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: C.color, marginBottom: 6 }}>Samo L-22</Text>
        <Text style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 }}>
          Creato con ❤️ per gli studenti di Scienze Motorie.{'\n'}
          Samo il samoiedo vi augura buono studio!
        </Text>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
          © 2025–2026 Samo L-22
        </Text>
      </View>
    </View>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── MAIN SCREEN ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ProfiloScreen() {
  const [section, setSection] = useState<Section | null>(null)

  const menuItems: { key: Section; label: string; icon: React.ElementType; color?: string; badge?: string }[] = [
    { key: 'profilo',     label: 'Profilo',           icon: User,       color: C.primary },
    { key: 'preferenze',  label: 'Preferenze studio', icon: Bell,       color: C.purple },
    { key: 'statistiche', label: 'Statistiche',        icon: TrendingUp, color: C.success },
    { key: 'premium',     label: 'Samo L-22 Pro',     icon: Crown,      color: C.goldDeep, badge: 'PRO' },
    { key: 'donazioni',   label: 'Offri un caffè 🐾', icon: Heart,      color: C.error },
    { key: 'gestione',    label: 'Gestione account',  icon: Lock,       color: C.muted },
    { key: 'info',        label: 'Info app',           icon: Info,       color: C.muted },
  ]

  const sectionTitles: Record<Section, string> = {
    profilo: 'Profilo', preferenze: 'Preferenze', statistiche: 'Statistiche',
    premium: 'Samo L-22 Pro', donazioni: 'Offri un caffè', gestione: 'Gestione', info: 'Info app',
  }

  if (section) {
    const sectionProps = { onBack: () => setSection(null) }
    const contentMap: Record<Section, React.ReactNode> = {
      profilo:     <ProfiloSection {...sectionProps} />,
      preferenze:  <PreferenzeSection {...sectionProps} />,
      statistiche: <StatisticheSection {...sectionProps} />,
      premium:     <PremiumSection {...sectionProps} />,
      donazioni:   <DonazioniSection {...sectionProps} />,
      gestione:    <GestioneSection {...sectionProps} />,
      info:        <InfoSection {...sectionProps} />,
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sectionTopBar}>
          <TouchableOpacity onPress={() => setSection(null)} style={styles.backBtn} activeOpacity={0.7}>
            <ChevronRight size={20} color={C.primary} style={{ transform: [{ rotate: '180deg' }] }} />
            <Text style={styles.backBtnText}>Account</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTopTitle}>{sectionTitles[section]}</Text>
          <View style={{ width: 70 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {contentMap[section]}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    )
  }

  /* ── Main menu ── */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* Avatar card */}
        <View style={[styles.card, styles.avatarCard]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>
          <Text style={styles.name}>Marco Stellato</Text>
          <Text style={styles.email}>m.stellato@uniroma1.it</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.levelChip}>
              <Zap size={11} color={C.purple} />
              <Text style={styles.levelChipText}>Lv. 4 · 1.240 XP</Text>
            </View>
            <View style={styles.freeChip}>
              <Text style={styles.freeChipText}>Piano Free</Text>
            </View>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Ore studio', value: '248h', color: C.primary },
            { label: 'Quiz',       value: '134',  color: C.success },
            { label: 'Streak',     value: '18gg',  color: C.error },
          ].map(({ label, value, color }) => (
            <View key={label} style={[styles.quickStatCard, { borderColor: `${color}25` }]}>
              <Text style={[styles.quickStatValue, { color }]}>{value}</Text>
              <Text style={styles.quickStatLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.card}>
          {menuItems.map(({ key, label, icon: Icon, color, badge }, i) => (
            <TouchableOpacity
              key={key}
              style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => setSection(key)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: `${color || C.primary}15` }]}>
                <Icon size={18} color={color || C.primary} />
              </View>
              <Text style={[styles.menuLabel, key === 'premium' && { color: C.goldDeep, fontWeight: '700' }]}>
                {label}
              </Text>
              {badge && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>{badge}</Text>
                </View>
              )}
              <ChevronRight size={16} color={C.muted} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── STYLES ──────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.bg },
  scroll:      { padding: 16, paddingBottom: 40 },
  header:      { marginBottom: 16 },
  title:       { fontSize: 26, fontWeight: '800', color: C.color, letterSpacing: -0.5 },

  /* Card */
  card: {
    backgroundColor: C.card, borderRadius: 16, borderWidth: 1,
    borderColor: C.border, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },

  /* Avatar card (main) */
  avatarCard:     { alignItems: 'center', paddingVertical: 24 },
  avatar:         { width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:     { fontSize: 24, fontWeight: '800', color: 'white' },
  name:           { fontSize: 20, fontWeight: '800', color: C.color, marginBottom: 2 },
  email:          { fontSize: 13, color: C.muted, marginBottom: 12 },

  /* Avatar large (edit) */
  avatarLarge:    { width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarLargeText:{ fontSize: 32, fontWeight: '800', color: 'white' },
  avatarCameraBtn:{
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.primary,
    borderWidth: 2, borderColor: 'white',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarName:     { fontSize: 18, fontWeight: '800', color: C.color, marginTop: 12, marginBottom: 2 },
  avatarEmail:    { fontSize: 13, color: C.muted, marginBottom: 14 },
  editAvatarBtn:  { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: C.primary },
  editAvatarBtnText: { fontSize: 13, fontWeight: '600', color: C.primary },

  /* Chips */
  levelChip:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: `${C.purple}15` },
  levelChipText:  { fontSize: 11, fontWeight: '700', color: C.purple },
  freeChip:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.surface },
  freeChipText:   { fontSize: 11, fontWeight: '600', color: C.muted },

  /* Stats row (main) */
  statsRow:       { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickStatCard:  { flex: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  quickStatValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  quickStatLabel: { fontSize: 11, color: C.muted, fontWeight: '600' },

  /* Menu items */
  menuItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 },
  menuIconWrap:   { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel:      { fontSize: 15, fontWeight: '500', color: C.color, flex: 1 },
  proBadge:       { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: '#FEF3C7' },
  proBadgeText:   { fontSize: 10, fontWeight: '800', color: '#D97706' },

  /* Section top bar */
  sectionTopBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 0 },
  backBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText:    { fontSize: 14, fontWeight: '600', color: C.primary },
  sectionTopTitle:{ fontSize: 16, fontWeight: '800', color: C.color },

  /* Section header */
  sectionHeader:  { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: 0.6, marginBottom: 12 },

  /* Info rows */
  infoRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  infoIcon:       { width: 32, height: 32, borderRadius: 8, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  infoLabel:      { fontSize: 10, color: C.muted, marginBottom: 2 },
  infoValue:      { fontSize: 13, fontWeight: '600', color: C.color },

  /* Toggle rows */
  toggleRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  toggleLabel:    { fontSize: 14, fontWeight: '500', color: C.color },
  toggleDesc:     { fontSize: 11, color: C.muted, marginTop: 1 },

  /* Setting items */
  settingItem:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 },
  settingIconWrap:{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel:   { fontSize: 14, fontWeight: '500', color: C.color, flex: 1 },
  settingValue:   { fontSize: 13, color: C.muted },

  /* Form */
  formGroup:      { marginBottom: 14 },
  formLabel:      { fontSize: 12, fontWeight: '600', color: C.color, marginBottom: 6 },
  formInput:      { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 15, color: C.color, fontFamily: 'System' },
  formInputReadonly: { color: C.muted },

  /* Anno pills */
  annoPill:       { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center' },
  annoPillActive: { borderColor: C.primary, backgroundColor: '#EBF0FF' },
  annoPillText:   { fontSize: 11, fontWeight: '700', color: C.muted },
  annoPillTextActive: { color: C.primary },

  /* Save button */
  saveBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: 14, padding: 15, marginBottom: 14 },
  saveBtnText:    { fontSize: 15, fontWeight: '800', color: 'white' },

  /* Preferences */
  prefsLabel:     { fontSize: 13, fontWeight: '500', color: C.color },
  pomoPill:       { flex: 1, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center' },
  pomoPillActive: { borderColor: C.primary, backgroundColor: '#EBF0FF' },
  pomoPillValue:  { fontSize: 20, fontWeight: '800', color: C.muted },
  pomoPillUnit:   { fontSize: 10, fontWeight: '500', color: C.muted },
  hourPill:       { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface },
  hourPillActive: { borderColor: C.primary, backgroundColor: '#EBF0FF' },
  hourPillText:   { fontSize: 14, fontWeight: '700', color: C.muted },

  /* Stats grid */
  statsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statGridItem:   { width: '47%', borderRadius: 12, borderWidth: 1, padding: 14, flexDirection: 'column', gap: 8 },
  statGridIcon:   { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statGridValue:  { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  statGridLabel:  { fontSize: 11, color: C.muted, fontWeight: '600' },

  /* Level */
  levelBadge:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: C.purple },
  levelBadgeText: { fontSize: 12, fontWeight: '800', color: 'white' },
  progressBar:    { height: 10, backgroundColor: C.surface, borderRadius: 999, overflow: 'hidden' },
  progressFill:   { height: '100%', borderRadius: 999, backgroundColor: C.purple },

  /* Premium */
  premiumHero:    {
    borderRadius: 20, padding: 28, marginBottom: 14,
    backgroundColor: '#D97706',
    shadowColor: '#D97706', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  premiumHeroTitle: { fontSize: 26, fontWeight: '900', color: 'white', letterSpacing: -0.5 },
  premiumHeroSub:   { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  billingToggle:    { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: 4, marginTop: 16 },
  billingOption:    { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  billingOptionActive: { backgroundColor: 'white' },
  billingOptionText:   { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  billingBadge:     { fontSize: 9, fontWeight: '800', color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  premiumPrice:     { fontSize: 48, fontWeight: '900', color: 'white', letterSpacing: -1 },
  premiumPriceUnit: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  premiumYearly:    { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  featureRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  featureText:      { fontSize: 14, color: C.color, flex: 1 },
  proCTA:           {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: C.goldDeep, borderRadius: 16, padding: 18, marginBottom: 10,
    shadowColor: C.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  proCTAText:       { fontSize: 16, fontWeight: '800', color: 'white' },

  /* Donation */
  donationHero:     { borderRadius: 20, padding: 28, marginBottom: 14, backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: 'rgba(245,158,11,0.3)', alignItems: 'center' },
  donationTitle:    { fontSize: 22, fontWeight: '900', color: '#92400E', marginBottom: 10 },
  donationSub:      { fontSize: 13, color: '#78350F', textAlign: 'center', lineHeight: 20 },
  donationPill:     { flex: 1, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', gap: 4 },
  donationPillActive: { borderColor: C.gold, backgroundColor: '#FFFBEB' },
  donationPillAmount: { fontSize: 22, fontWeight: '900', color: C.color },
  donationPillLabel:  { fontSize: 10, color: C.muted, fontWeight: '500' },
  samoMessage:      { marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  samoMessageText:  { fontSize: 13, color: '#78350F', fontStyle: 'italic', lineHeight: 20 },
  donationCTA:      {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: 18, borderRadius: 16, marginBottom: 14,
    backgroundColor: C.gold,
    shadowColor: C.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  donationCTAText: { fontSize: 16, fontWeight: '800', color: 'white' },
})
