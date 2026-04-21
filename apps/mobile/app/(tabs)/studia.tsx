import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookOpen, Brain, Layers3, Timer, FileText, Wand2, MessageSquare } from 'lucide-react-native'

const COLORS = {
  primary: '#0055FF',
  bg: '#F9FAFB',
  card: '#FFFFFF',
  color: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  aiPurple: '#7C3AED',
  aiBlue: '#5C8BFF',
}

const sections = [
  { key: 'note', label: 'Note e riassunti', icon: BookOpen, description: 'Editor ricco, tag, ricerca full-text' },
  { key: 'quiz', label: 'Quiz engine', icon: Brain, description: 'Multipla, vero/falso, pratica e simulazione' },
  { key: 'flashcard', label: 'Flashcard SM-2', icon: Layers3, description: 'Review giornaliera con valutazione 0-5' },
  { key: 'pomodoro', label: 'Pomodoro', icon: Timer, description: 'Timer 25/5/15 con tracking sessioni' },
  { key: 'materiali', label: 'Materiali', icon: FileText, description: 'Upload PDF/PPT/immagini per materia' },
]

const aiSections = [
  { key: 'ai-quiz', label: 'Genera Quiz', icon: Brain, description: 'Crea domande da PDF e note con AI', color: COLORS.aiBlue },
  { key: 'ai-flashcard', label: 'Genera Flashcard', icon: Layers3, description: 'Deck automatici per spaced repetition', color: COLORS.aiPurple },
  { key: 'ai-summary', label: 'Genera Riassunto', icon: FileText, description: 'Sintesi breve, media o dettagliata', color: '#22C55E' },
  { key: 'ai-qa', label: 'Chiedi ai Documenti', icon: MessageSquare, description: 'Q&A sui tuoi materiali con citazioni', color: '#F59E0B' },
]

export default function StudiaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Studia</Text>
        <Text style={styles.subtitle}>Tutti gli strumenti per studiare e creare contenuti con AI.</Text>

        {/* Strumenti standard */}
        <View style={styles.list}>
          {sections.map(({ key, label, description, icon: Icon }) => (
            <TouchableOpacity key={key} style={styles.card}>
              <View style={styles.iconWrap}>
                <Icon size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{label}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Studio section */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <Wand2 size={16} color={COLORS.aiBlue} />
            <Text style={styles.aiTitle}>AI Studio</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>Fase 4</Text>
            </View>
          </View>
          <Text style={styles.aiSubtitle}>
            Samo genera quiz, flashcard e riassunti dai tuoi materiali
          </Text>
          <View style={styles.list}>
            {aiSections.map(({ key, label, description, icon: Icon, color }) => (
              <TouchableOpacity key={key} style={[styles.card, styles.aiCard]}>
                <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
                  <Icon size={18} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{label}</Text>
                  <Text style={styles.cardDescription}>{description}</Text>
                </View>
                <View style={[styles.aiTag, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.aiTagText, { color }]}>AI</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.color, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginBottom: 14 },
  list: { gap: 10 },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiCard: {
    borderColor: COLORS.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF0FF',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.color, marginBottom: 2 },
  cardDescription: { fontSize: 12, color: COLORS.muted },
  aiSection: {
    marginTop: 24,
    backgroundColor: 'rgba(92,139,255,0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(92,139,255,0.12)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.color,
  },
  aiBadge: {
    backgroundColor: 'rgba(92,139,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.aiBlue,
  },
  aiSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 12,
    lineHeight: 17,
  },
  aiTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
})