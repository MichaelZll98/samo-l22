import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Flame, Award, BookOpen, TrendingUp, Clock, ArrowRight, Zap, Star, BarChart2, Trophy, Sparkles } from 'lucide-react-native'

const COLORS = {
  primary: '#0055FF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#F43F5E',
  violet: '#7C3AED',
  bg: '#F9FAFB',
  card: '#FFFFFF',
  color: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  surface: '#F3F4F6',
}

const upcomingExams = [
  { subject: 'Anatomia Umana',       date: '15 Mag 2026', days: 24, color: '#FF6B6B' },
  { subject: 'Fisiologia Applicata', date: '28 Mag 2026', days: 37, color: '#4ECDC4' },
]

const stats = [
  { label: 'CFU',   value: '81',   color: COLORS.primary, icon: Award      },
  { label: 'Media', value: '27.4', color: COLORS.warning, icon: TrendingUp },
  { label: 'XP',    value: '1240', color: COLORS.violet,  icon: Zap        },
  { label: 'Streak',value: '12d',  color: COLORS.error,   icon: Flame      },
]

const weeklyGoals = [
  { label: 'Ore studio', current: 6,  target: 10, color: COLORS.primary, unit: 'h' },
  { label: 'Quiz',       current: 3,  target: 5,  color: COLORS.violet,  unit: ''  },
  { label: 'Flashcard',  current: 28, target: 50, color: COLORS.success, unit: ''  },
]

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ciao, Marco! 👋</Text>
            <Text style={styles.greetingSub}>3 esami nelle prossime settimane</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={14} color={COLORS.error} />
            <Text style={styles.streakText}>12</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map(({ label, value, color, icon: Icon }) => (
            <View key={label} style={styles.statCard}>
              <Icon size={16} color={color} />
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* XP / Livello */}
        <View style={[styles.card, { borderColor: `${COLORS.violet}30`, backgroundColor: '#F5F3FF' }]}>
          <View style={styles.cardHeader}>
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Star size={14} color="white" fill="white" />
              </View>
              <View>
                <Text style={styles.levelName}>Studente</Text>
                <Text style={styles.mutedText}>1.240 XP totali</Text>
              </View>
            </View>
            <Text style={[styles.levelPct, { color: COLORS.violet }]}>48%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '48%', backgroundColor: COLORS.violet }]} />
          </View>
          <Text style={[styles.mutedText, { marginTop: 6 }]}>
            260 XP al prossimo livello: Veterano
          </Text>
        </View>

        {/* CFU Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Progresso CFU</Text>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Dettaglio</Text>
              <ArrowRight size={12} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '45%' }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.mutedText}>81 / 180 CFU</Text>
            <Text style={styles.mutedText}>45%</Text>
          </View>
        </View>

        {/* Obiettivi settimanali */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Obiettivi Settimanali</Text>
            <Text style={[styles.mutedText, { fontSize: 11 }]}>2/4 completati</Text>
          </View>
          <View style={{ gap: 12 }}>
            {weeklyGoals.map(g => {
              const pct = Math.min((g.current / g.target) * 100, 100)
              return (
                <View key={g.label}>
                  <View style={styles.goalRow}>
                    <Text style={styles.goalLabel}>{g.label}</Text>
                    <Text style={[styles.goalValue, { color: g.color }]}>
                      {g.current}/{g.target}{g.unit}
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: g.color }]} />
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* Prossimi esami */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Prossimi esami</Text>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Tutti</Text>
              <ArrowRight size={12} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          {upcomingExams.map(({ subject, date, days, color }) => (
            <View key={subject} style={styles.examRow}>
              <View style={[styles.examBar, { backgroundColor: color }]} />
              <View style={styles.examInfo}>
                <Text style={styles.examName}>{subject}</Text>
                <View style={styles.examDateRow}>
                  <Clock size={11} color={COLORS.muted} />
                  <Text style={styles.examDate}>{date}</Text>
                </View>
              </View>
              <View style={styles.examDays}>
                <Text style={[styles.examDaysNum, { color: days <= 14 ? COLORS.error : COLORS.primary }]}>
                  {days}
                </Text>
                <Text style={styles.examDaysLabel}>giorni</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 14 }]}>Azioni rapide</Text>
          <View style={styles.actionsGrid}>
            {[
              { label: 'Analytics', icon: BarChart2, color: COLORS.primary  },
              { label: 'Badge',     icon: Trophy,    color: COLORS.warning   },
              { label: 'Planner',  icon: Sparkles,  color: COLORS.violet    },
              { label: 'Studia',   icon: Zap,       color: COLORS.success   },
            ].map(({ label, icon: Icon, color }) => (
              <TouchableOpacity key={label} style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: `${color}18` }]}>
                  <Icon size={18} color={color} />
                </View>
                <Text style={styles.actionLabel}>{label}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.color, letterSpacing: -0.5 },
  greetingSub: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF1F2', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
  },
  streakText: { fontSize: 14, fontWeight: '800', color: COLORS.error },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 12, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontWeight: '600', color: COLORS.muted },

  // Level
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelBadge: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.violet,
    alignItems: 'center', justifyContent: 'center',
  },
  levelName: { fontSize: 14, fontWeight: '700', color: COLORS.color },
  levelPct: { fontSize: 18, fontWeight: '800' },

  // Goals
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalLabel: { fontSize: 12, fontWeight: '600', color: COLORS.color },
  goalValue: { fontSize: 12, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.color },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  progressBarBg: { height: 8, backgroundColor: COLORS.surface, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  mutedText: { fontSize: 12, color: COLORS.muted },
  examRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  examBar: { width: 4, height: 40, borderRadius: 2 },
  examInfo: { flex: 1 },
  examName: { fontSize: 13, fontWeight: '600', color: COLORS.color, marginBottom: 3 },
  examDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  examDate: { fontSize: 11, color: COLORS.muted },
  examDays: { alignItems: 'flex-end' },
  examDaysNum: { fontSize: 18, fontWeight: '800', lineHeight: 20 },
  examDaysLabel: { fontSize: 10, color: COLORS.muted },
  actionsGrid: { flexDirection: 'row', gap: 10 },
  actionItem: { flex: 1, alignItems: 'center', gap: 8 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.color },
})
