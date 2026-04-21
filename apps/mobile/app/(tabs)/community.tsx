import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, Users, MessageCircle, Heart, Bookmark, Download, Star } from 'lucide-react-native'
import { useState } from 'react'

const COLORS = {
  primary: '#0055FF',
  bg: '#F9FAFB', card: '#FFFFFF', color: '#111827',
  muted: '#6B7280', border: '#E5E7EB', surface: '#F3F4F6',
  success: '#22C55E', warning: '#F59E0B', error: '#F43F5E',
  info: '#3B82F6',
}

const FILTERS = ['Tutto', 'Appunti', 'Materiali', 'Popolari']

const FEED = [
  {
    id: '1',
    type: 'note' as const,
    author: 'Laura M.',
    avatar: 'LM',
    avatarColor: '#4ECDC4',
    authorLevel: 8,
    time: '2 ore fa',
    subject: 'Anatomia',
    subjectColor: '#FF6B6B',
    title: 'Sistema nervoso autonomo — Riassunto completo',
    excerpt: 'Simpatico e parasimpatico: differenze funzionali, neurotrasmettitori, vie efferenti...',
    likes: 47,
    saves: 23,
    comments: 8,
    rating: 4.7,
    liked: false,
    saved: false,
  },
  {
    id: '2',
    type: 'material' as const,
    author: 'Giovanni R.',
    avatar: 'GR',
    avatarColor: '#96CEB4',
    authorLevel: 5,
    time: '5 ore fa',
    subject: 'Biomeccanica',
    subjectColor: '#45B7D1',
    title: 'Slide Biomeccanica Cap. 1-6',
    excerpt: 'Slide con annotazioni del Prof. Martini. Cinematica, dinamica e analisi del movimento.',
    likes: 31,
    saves: 44,
    comments: 15,
    downloads: 67,
    fileType: 'PPTX',
    liked: false,
    saved: true,
  },
  {
    id: '3',
    type: 'note' as const,
    author: 'Sofia B.',
    avatar: 'SB',
    avatarColor: '#F1948A',
    authorLevel: 11,
    time: '1 giorno fa',
    subject: 'Fisiologia',
    subjectColor: '#96CEB4',
    title: 'Metabolismo aerobico completo',
    excerpt: 'Via glicolitica, ciclo di Krebs e catena respiratoria per l\'esame di Fisiologia.',
    likes: 89,
    saves: 56,
    comments: 32,
    rating: 4.9,
    liked: true,
    saved: false,
  },
]

const GROUPS = [
  { id: 'g1', name: 'Anatomia Esame Giugno', members: 18, color: '#FF6B6B', joined: true },
  { id: 'g2', name: 'Biomeccanica Study Group', members: 12, color: '#45B7D1', joined: false },
  { id: 'g3', name: 'Psicologia dello Sport', members: 21, color: '#EC4899', joined: false },
]

export default function CommunityScreen() {
  const [activeFilter, setActiveFilter] = useState('Tutto')
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(FEED.map((f) => [f.id, f.liked]))
  )
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(FEED.map((f) => [f.id, f.saved]))
  )

  const filteredFeed = FEED.filter((item) => {
    if (activeFilter === 'Appunti') return item.type === 'note'
    if (activeFilter === 'Materiali') return item.type === 'material'
    return true
  })

  const toggleLike = (id: string) => setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleSave = (id: string) => setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>Condividi e scopri</Text>
          </View>
          <View style={styles.headerRight}>
            <Users size={14} color={COLORS.primary} />
            <Text style={styles.memberCount}>1.2k studenti</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={15} color={COLORS.muted} />
          <TextInput
            placeholder="Cerca note, materiali, studenti..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Feed */}
        {filteredFeed.map((item) => {
          const liked = likedMap[item.id]
          const saved = savedMap[item.id]
          return (
            <View key={item.id} style={styles.feedCard}>
              {/* Author row */}
              <View style={styles.authorRow}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                  <Text style={styles.avatarText}>{item.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Lv {item.authorLevel}</Text>
                    </View>
                  </View>
                  <Text style={styles.postTime}>{item.time}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: item.type === 'note' ? '#EFF6FF' : '#F0FDF4' }]}>
                  <Text style={[styles.typeText, { color: item.type === 'note' ? COLORS.info : COLORS.success }]}>
                    {item.type === 'note' ? 'Appunti' : 'Materiale'}
                  </Text>
                </View>
              </View>

              {/* Subject */}
              <View style={[styles.subjectTag, { backgroundColor: `${item.subjectColor}20` }]}>
                <Text style={[styles.subjectText, { color: item.subjectColor }]}>{item.subject}</Text>
              </View>

              {/* Title + excerpt */}
              <Text style={styles.feedTitle}>{item.title}</Text>
              <Text style={styles.feedExcerpt}>{item.excerpt}</Text>

              {/* Rating (only for notes) */}
              {'rating' in item && item.rating && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <Star size={13} color={COLORS.warning} fill={COLORS.warning} />
                  <Text style={{ fontSize: 12, color: COLORS.muted, fontWeight: '600' }}>{item.rating}</Text>
                </View>
              )}

              {/* File info (for materials) */}
              {'fileType' in item && item.fileType && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <View style={{ backgroundColor: '#EFF6FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.info }}>{item.fileType}</Text>
                  </View>
                  {'downloads' in item && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Download size={11} color={COLORS.muted} />
                      <Text style={{ fontSize: 11, color: COLORS.muted }}>{item.downloads}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable style={[styles.actionBtn, liked && styles.actionBtnLiked]} onPress={() => toggleLike(item.id)}>
                  <Heart size={14} color={liked ? COLORS.error : COLORS.muted} fill={liked ? COLORS.error : 'none'} />
                  <Text style={[styles.actionCount, liked && { color: COLORS.error }]}>{item.likes}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, saved && styles.actionBtnSaved]} onPress={() => toggleSave(item.id)}>
                  <Bookmark size={14} color={saved ? COLORS.warning : COLORS.muted} fill={saved ? COLORS.warning : 'none'} />
                  <Text style={[styles.actionCount, saved && { color: COLORS.warning }]}>{item.saves}</Text>
                </Pressable>
                <Pressable style={styles.actionBtn}>
                  <MessageCircle size={14} color={COLORS.muted} />
                  <Text style={styles.actionCount}>{item.comments}</Text>
                </Pressable>
              </View>
            </View>
          )
        })}

        {/* Groups section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gruppi di studio</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Vedi tutti</Text>
          </TouchableOpacity>
        </View>

        {GROUPS.map((g) => (
          <View key={g.id} style={styles.groupCard}>
            <View style={[styles.groupDot, { backgroundColor: g.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.groupName}>{g.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Users size={11} color={COLORS.muted} />
                <Text style={styles.groupMembers}>{g.members} membri</Text>
              </View>
            </View>
            <View style={[styles.joinBtn, g.joined && styles.joinBtnJoined]}>
              <Text style={[styles.joinText, g.joined && styles.joinTextJoined]}>
                {g.joined ? 'Membro' : 'Entra'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.color, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  memberCount: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.color },
  filterRow: { flexDirection: 'row', gap: 6, paddingRight: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  filterTextActive: { color: 'white' },
  feedCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '800', color: 'white' },
  authorName: { fontSize: 13, fontWeight: '700', color: COLORS.color },
  postTime: { fontSize: 11, color: COLORS.muted },
  levelBadge: { backgroundColor: '#EBF0FF', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  levelText: { fontSize: 9, fontWeight: '700', color: COLORS.primary },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  typeText: { fontSize: 10, fontWeight: '700' },
  subjectTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  subjectText: { fontSize: 10, fontWeight: '700' },
  feedTitle: { fontSize: 14, fontWeight: '700', color: COLORS.color, marginBottom: 5, lineHeight: 20 },
  feedExcerpt: { fontSize: 13, color: COLORS.muted, lineHeight: 19, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 6, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  actionBtnLiked: { backgroundColor: '#FFF1F2' },
  actionBtnSaved: { backgroundColor: '#FFFBEB' },
  actionCount: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.color },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  groupCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 8 },
  groupDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  groupName: { fontSize: 13, fontWeight: '700', color: COLORS.color, marginBottom: 2 },
  groupMembers: { fontSize: 11, color: COLORS.muted },
  joinBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.primary },
  joinBtnJoined: { backgroundColor: COLORS.surface, borderColor: COLORS.border },
  joinText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  joinTextJoined: { color: COLORS.muted },
})
