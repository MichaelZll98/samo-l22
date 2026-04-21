import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from 'lucide-react-native'

const COLORS = {
  primary: '#0055FF',
  bg: '#F9FAFB', card: '#FFFFFF', color: '#111827',
  muted: '#6B7280', border: '#E5E7EB', surface: '#F3F4F6',
}

const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const calDays = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, null, null, null, null],
]

const events = [
  { day: 15, label: 'Anatomia Umana', color: '#FF6B6B', time: '09:00' },
  { day: 28, label: 'Fisiologia Appl.', color: '#4ECDC4', time: '14:00' },
  { day: 21, label: 'Riunione studio', color: COLORS.primary, time: '16:00' },
]

export default function CalendarioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendario</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.card}>
          <View style={styles.calHeader}>
            <TouchableOpacity style={styles.navBtn}><ChevronLeft size={18} color={COLORS.primary} /></TouchableOpacity>
            <Text style={styles.monthTitle}>Maggio 2026</Text>
            <TouchableOpacity style={styles.navBtn}><ChevronRight size={18} color={COLORS.primary} /></TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.daysRow}>
            {days.map((d, i) => (
              <Text key={i} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          {calDays.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                const hasEvent = events.some(e => e.day === day)
                const isToday = day === 21
                return (
                  <TouchableOpacity
                    key={di}
                    style={[
                      styles.dayCell,
                      isToday && styles.dayCellToday,
                      !day && styles.dayCellEmpty,
                    ]}
                    disabled={!day}
                  >
                    {day && (
                      <>
                        <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>
                          {day}
                        </Text>
                        {hasEvent && (
                          <View style={[styles.eventDot, { backgroundColor: events.find(e => e.day === day)?.color }]} />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>

        {/* Upcoming events */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Prossimi eventi</Text>
          {events.sort((a, b) => a.day - b.day).map((ev, i) => (
            <View key={i} style={styles.eventRow}>
              <View style={[styles.eventIcon, { backgroundColor: `${ev.color}20` }]}>
                <CalIcon size={16} color={ev.color} />
              </View>
              <View>
                <Text style={styles.eventLabel}>{ev.label}</Text>
                <Text style={styles.eventMeta}>Mag {ev.day} · {ev.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.color, letterSpacing: -0.5 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { fontSize: 15, fontWeight: '700', color: COLORS.color },
  daysRow: { flexDirection: 'row', marginBottom: 6 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: COLORS.muted },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  dayCell: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, gap: 2 },
  dayCellToday: { backgroundColor: COLORS.primary },
  dayCellEmpty: { opacity: 0 },
  dayNum: { fontSize: 13, fontWeight: '500', color: COLORS.color },
  dayNumToday: { color: 'white', fontWeight: '800' },
  eventDot: { width: 5, height: 5, borderRadius: 2.5 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.color, marginBottom: 12 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  eventIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  eventLabel: { fontSize: 13, fontWeight: '600', color: COLORS.color },
  eventMeta: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
})
