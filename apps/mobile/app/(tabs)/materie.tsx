import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, Filter } from 'lucide-react-native'

const COLORS = {
  primary: '#0055FF',
  success: '#22C55E',
  info: '#3B82F6',
  bg: '#F9FAFB',
  card: '#FFFFFF',
  color: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  surface: '#F3F4F6',
}

const subjects = [
  { id: '1', name: 'Anatomia Umana', cfu: 9, color: '#FF6B6B', progress: 100, status: 'completed' },
  { id: '2', name: 'Fisiologia Applicata', cfu: 9, color: '#4ECDC4', progress: 55, status: 'studying' },
  { id: '3', name: 'Biomeccanica', cfu: 6, color: '#45B7D1', progress: 30, status: 'studying' },
  { id: '4', name: 'Teoria e Metodologia', cfu: 12, color: '#96CEB4', progress: 72, status: 'studying' },
  { id: '5', name: 'Nutrizione Sportiva', cfu: 6, color: '#FFEAA7', progress: 100, status: 'completed' },
  { id: '6', name: 'Patologie dello Sport', cfu: 6, color: '#DDA0DD', progress: 15, status: 'studying' },
  { id: '7', name: 'Farmacologia e Doping', cfu: 6, color: '#98D8C8', progress: 0, status: 'planned' },
  { id: '8', name: 'Radiologia e Diagnostica', cfu: 6, color: '#F7DC6F', progress: 0, status: 'planned' },
  { id: '9', name: 'Chirurgia Ortopedica', cfu: 9, color: '#BB8FCE', progress: 100, status: 'completed' },
  { id: '10', name: 'Riabilitazione Funzionale', cfu: 12, color: '#82E0AA', progress: 40, status: 'studying' },
  { id: '11', name: 'Psicologia dello Sport', cfu: 6, color: '#F1948A', progress: 100, status: 'completed' },
  { id: '12', name: 'Statistica e Ricerca', cfu: 6, color: '#85C1E9', progress: 0, status: 'planned' },
  { id: '13', name: 'Etica e Deontologia', cfu: 6, color: '#FAD7A0', progress: 0, status: 'planned' },
  { id: '14', name: 'Tesi di Laurea', cfu: 15, color: '#A9CCE3', progress: 5, status: 'studying' },
]

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#F0FDF4', color: '#22C55E', label: 'Completata' },
  studying: { bg: '#EFF6FF', color: '#3B82F6', label: 'In corso' },
  planned: { bg: '#EBF0FF', color: '#0055FF', label: 'Pianificata' },
}

export default function MaterieScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Materie L-22</Text>
          <Text style={styles.subtitle}>
            {subjects.filter(s => s.status === 'completed').length} completate su {subjects.length}
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color={COLORS.muted} />
          <Text style={styles.searchPlaceholder}>Cerca materia...</Text>
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {['Tutte', 'In corso', 'Completate', 'Pianificate'].map((f, i) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, i === 0 && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subject cards */}
        <View style={styles.grid}>
          {subjects.map(({ id, name, cfu, color, progress, status }) => {
            const ss = statusStyles[status]
            return (
              <TouchableOpacity key={id} style={styles.subjectCard} activeOpacity={0.75}>
                {/* Header */}
                <View style={styles.subjectCardHeader}>
                  <View style={[styles.subjectIconBg, { backgroundColor: `${color}20` }]}>
                    <Text style={{ fontSize: 18 }}>{name[0]}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: ss.bg }]}>
                    <Text style={[styles.badgeText, { color: ss.color }]}>{ss.label}</Text>
                  </View>
                </View>

                {/* Name */}
                <Text style={styles.subjectName} numberOfLines={2}>{name}</Text>
                <Text style={styles.subjectCfu}>{cfu} CFU</Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progresso</Text>
                    <Text style={[styles.progressValue, { color }]}>{progress}%</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.color, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 3 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 11,
    marginBottom: 12,
  },
  searchPlaceholder: { fontSize: 14, color: COLORS.muted },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '500', color: COLORS.muted },
  filterTextActive: { color: 'white', fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  subjectCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subjectIconBg: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  subjectName: { fontSize: 13, fontWeight: '700', color: COLORS.color, lineHeight: 18 },
  subjectCfu: { fontSize: 11, color: COLORS.muted },
  progressContainer: { gap: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 10, color: COLORS.muted },
  progressValue: { fontSize: 10, fontWeight: '700' },
  progressBg: { height: 4, backgroundColor: COLORS.surface, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
})
