import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  X,
  Send,
  Paperclip,
  Mic,
  Plus,
  MessageSquare,
  ChevronLeft,
  Brain,
  Layers3,
  FileText,
  MessageCircle,
} from 'lucide-react-native'
import Svg, { Circle, Ellipse, Path } from 'react-native-svg'
import { useAIChatStore, SAMO_QUICK_ACTIONS } from '@studio-l22/core/src/ai-chat'
import type { ChatMessage } from '@studio-l22/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const COLORS = {
  primary: '#0055FF',
  primarySoft: '#EBF0FF',
  bg: '#FFFFFF',
  surface: '#F3F4F6',
  card: '#FFFFFF',
  color: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  error: '#F43F5E',
  errorSoft: '#FFF1F2',
  accent: '#5C8BFF',
  accentGrad: '#7C3AED',
  furColor: '#F5F0EB',
  furLight: '#FEFCFA',
}

// ── Samoyed Mini Avatar ──────────────────────────────────────────────────────
function SamoMini({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx="60" cy="56" r="34" fill={COLORS.furColor} />
      <Path d="M28 42 L22 18 L42 34 Z" fill={COLORS.furColor} />
      <Path d="M92 42 L98 18 L78 34 Z" fill={COLORS.furColor} />
      <Ellipse cx="46" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <Circle cx="44.8" cy="48.8" r="1.3" fill="white" opacity={0.9} />
      <Ellipse cx="74" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <Circle cx="72.8" cy="48.8" r="1.3" fill="white" opacity={0.9} />
      <Ellipse cx="60" cy="62" rx="12" ry="9" fill={COLORS.furLight} />
      <Ellipse cx="60" cy="58" rx="3.5" ry="2.8" fill="#1A1A1A" />
      <Path d="M54 63 Q57 66 60 63 Q63 66 66 63" stroke="#1A1A1A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </Svg>
  )
}

// ── Samoyed FAB Avatar ───────────────────────────────────────────────────────
function SamoFAB() {
  return (
    <Svg width={36} height={36} viewBox="0 0 120 120">
      <Ellipse cx="60" cy="100" rx="30" ry="20" fill={COLORS.furColor} />
      <Path d="M28 42 L20 14 L44 32 Z" fill={COLORS.furColor} />
      <Path d="M92 42 L100 14 L76 32 Z" fill={COLORS.furColor} />
      <Circle cx="60" cy="56" r="34" fill={COLORS.furColor} />
      <Ellipse cx="46" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <Circle cx="44.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
      <Ellipse cx="74" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <Circle cx="72.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
      <Ellipse cx="60" cy="62" rx="14" ry="10" fill={COLORS.furLight} />
      <Ellipse cx="60" cy="58" rx="4.5" ry="3.5" fill="#1A1A1A" />
      <Path d="M52 64 Q56 70 60 65 Q64 70 68 64" stroke="#1A1A1A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M57 66 Q57 76 60 78 Q63 76 63 66" fill="#FF8FA3" />
      <Path d="M46 84 Q53 90 60 87 Q67 90 74 84" stroke={COLORS.accent} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Circle cx="60" cy="87" r="3" fill={COLORS.accent} />
    </Svg>
  )
}

// ── Samoyed Welcome Avatar ───────────────────────────────────────────────────
function SamoWelcome() {
  return (
    <View style={s.welcomeAvatarCircle}>
      <Svg width={72} height={72} viewBox="0 0 120 120">
        <Circle cx="60" cy="60" r="58" fill={COLORS.accent} opacity={0.08} />
        <Ellipse cx="60" cy="100" rx="30" ry="20" fill={COLORS.furColor} />
        <Path d="M28 42 L20 14 L44 32 Z" fill={COLORS.furColor} />
        <Path d="M29 38 L24 20 L40 33 Z" fill="#FFD6DC" opacity={0.5} />
        <Path d="M92 42 L100 14 L76 32 Z" fill={COLORS.furColor} />
        <Path d="M91 38 L96 20 L80 33 Z" fill="#FFD6DC" opacity={0.5} />
        <Circle cx="60" cy="56" r="34" fill={COLORS.furColor} />
        <Ellipse cx="46" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
        <Circle cx="44.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
        <Ellipse cx="74" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
        <Circle cx="72.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
        <Ellipse cx="37" cy="58" rx="6" ry="3" fill="#FFE0E6" opacity={0.5} />
        <Ellipse cx="83" cy="58" rx="6" ry="3" fill="#FFE0E6" opacity={0.5} />
        <Ellipse cx="60" cy="62" rx="14" ry="10" fill={COLORS.furLight} />
        <Ellipse cx="60" cy="58" rx="4.5" ry="3.5" fill="#1A1A1A" />
        <Path d="M52 64 Q56 70 60 65 Q64 70 68 64" stroke="#1A1A1A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <Path d="M57 66 Q57 76 60 78 Q63 76 63 66" fill="#FF8FA3" />
        <Path d="M46 84 Q53 90 60 87 Q67 90 74 84" stroke={COLORS.accent} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Circle cx="60" cy="87" r="3" fill={COLORS.accent} />
      </Svg>
    </View>
  )
}

// ── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <View style={[s.messageRow, isUser ? s.messageRowUser : s.messageRowAI]}>
      {!isUser && (
        <View style={s.messageAvatar}>
          <SamoMini size={24} />
        </View>
      )}
      <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleAI]}>
        {message.message_type === 'voice' && (
          <View style={s.voiceBadge}>
            <Mic size={10} color={COLORS.accent} />
            <Text style={s.voiceBadgeText}>Vocale</Text>
          </View>
        )}
        <Text style={[s.bubbleText, isUser && s.bubbleTextUser]}>
          {message.content}
        </Text>
        <Text style={[s.bubbleTime, isUser && s.bubbleTimeUser]}>
          {new Date(message.created_at).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  )
}

// ── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -4, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    anim(dot1, 0).start()
    anim(dot2, 150).start()
    anim(dot3, 300).start()
  }, [])

  return (
    <View style={s.typingRow}>
      <View style={s.messageAvatar}>
        <SamoMini size={24} />
      </View>
      <View style={s.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[s.typingDot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  )
}

// ── Quick Action Button ──────────────────────────────────────────────────────
const quickActionIcons: Record<string, React.ElementType> = {
  Brain,
  Layers3,
  FileText,
  MessageCircle,
}

// ── Main Widget ──────────────────────────────────────────────────────────────
export function AIChatWidget() {
  const {
    messages,
    isLoading,
    isOpen,
    conversations,
    activeConversationId,
    toggleOpen,
    setOpen,
    sendMessage,
    createConversation,
    setActiveConversation,
    loadConversations,
    clearError,
    error,
  } = useAIChatStore()

  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const fabScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100)
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    await sendMessage(text)
  }, [input, sendMessage])

  const handleFABPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => toggleOpen())
  }

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <Animated.View style={[s.fab, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity onPress={handleFABPress} activeOpacity={0.85} style={s.fabTouch}>
            <SamoFAB />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chat Modal */}
      <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={s.chatContainer}>
          <KeyboardAvoidingView
            style={s.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={s.header}>
              <View style={s.headerLeft}>
                {showHistory && (
                  <TouchableOpacity onPress={() => setShowHistory(false)} style={s.iconBtn}>
                    <ChevronLeft size={18} color={COLORS.muted} />
                  </TouchableOpacity>
                )}
                <View style={s.headerAvatarCircle}>
                  <SamoMini size={28} />
                </View>
                <View>
                  <Text style={s.headerName}>Samo</Text>
                  <Text style={s.headerStatus}>
                    {isLoading ? 'Sta pensando...' : 'Il tuo compagno di studio'}
                  </Text>
                </View>
              </View>
              <View style={s.headerRight}>
                <TouchableOpacity
                  onPress={() => setShowHistory(!showHistory)}
                  style={s.iconBtn}
                >
                  <MessageSquare size={16} color={COLORS.muted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => createConversation()} style={s.iconBtn}>
                  <Plus size={16} color={COLORS.muted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(false)} style={s.iconBtn}>
                  <X size={16} color={COLORS.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {showHistory ? (
              /* ── Conversation History ─────────────────────────────────── */
              <ScrollView style={s.historyList}>
                <Text style={s.historyTitle}>Conversazioni</Text>
                {conversations.length === 0 ? (
                  <Text style={s.historyEmpty}>Nessuna conversazione ancora.</Text>
                ) : (
                  conversations.map((conv) => (
                    <TouchableOpacity
                      key={conv.id}
                      style={[
                        s.historyItem,
                        conv.id === activeConversationId && s.historyItemActive,
                      ]}
                      onPress={() => {
                        setActiveConversation(conv.id)
                        setShowHistory(false)
                      }}
                    >
                      <MessageSquare size={14} color={conv.id === activeConversationId ? COLORS.primary : COLORS.muted} />
                      <View style={s.historyItemInfo}>
                        <Text style={s.historyItemTitle} numberOfLines={1}>{conv.title}</Text>
                        <Text style={s.historyItemDate}>
                          {new Date(conv.updated_at).toLocaleDateString('it-IT', {
                            day: 'numeric', month: 'short',
                          })}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            ) : (
              <>
                {/* ── Messages ─────────────────────────────────────────── */}
                <ScrollView
                  ref={scrollViewRef}
                  style={s.messagesList}
                  contentContainerStyle={s.messagesContent}
                  showsVerticalScrollIndicator={false}
                >
                  {messages.length === 0 ? (
                    <View style={s.welcome}>
                      <SamoWelcome />
                      <Text style={s.welcomeTitle}>Ciao! Sono Samo</Text>
                      <Text style={s.welcomeText}>
                        Il tuo compagno di studio! Posso aiutarti con le materie di
                        Scienze Motorie, creare quiz, flashcard e molto altro.
                      </Text>
                      <View style={s.quickActions}>
                        {SAMO_QUICK_ACTIONS.map((action) => {
                          const Icon = quickActionIcons[action.icon] || MessageCircle
                          return (
                            <TouchableOpacity
                              key={action.id}
                              style={s.quickAction}
                              onPress={() => sendMessage(action.prompt)}
                            >
                              <Icon size={14} color={COLORS.primary} />
                              <Text style={s.quickActionText}>{action.label}</Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    </View>
                  ) : (
                    messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
                  )}
                  {isLoading && <TypingIndicator />}
                  {error && (
                    <View style={s.errorBanner}>
                      <Text style={s.errorText}>{error}</Text>
                      <TouchableOpacity onPress={clearError}>
                        <X size={14} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>

                {/* ── Input ────────────────────────────────────────────── */}
                <View style={s.inputArea}>
                  <View style={s.inputRow}>
                    <TextInput
                      style={s.input}
                      placeholder="Chatta con Samo..."
                      placeholderTextColor={COLORS.muted}
                      value={input}
                      onChangeText={setInput}
                      onSubmitEditing={handleSend}
                      editable={!isLoading}
                      multiline
                      returnKeyType="send"
                    />
                    <TouchableOpacity
                      onPress={handleSend}
                      disabled={!input.trim() || isLoading}
                      style={[s.sendBtn, input.trim() ? s.sendBtnActive : undefined]}
                    >
                      <Send size={16} color={input.trim() ? '#fff' : COLORS.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  fabTouch: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chat container
  chatContainer: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: { fontSize: 14, fontWeight: '700', color: COLORS.color },
  headerStatus: { fontSize: 11, color: COLORS.muted },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesList: { flex: 1, backgroundColor: COLORS.bg },
  messagesContent: { padding: 16, paddingBottom: 8 },

  // Message row
  messageRow: { flexDirection: 'row', gap: 8, marginBottom: 12, maxWidth: '85%' },
  messageRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  messageRowAI: { alignSelf: 'flex-start' },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.accent}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  // Bubbles
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, maxWidth: '100%' },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20, color: COLORS.color },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: COLORS.muted, marginTop: 4, textAlign: 'right' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.7)' },

  // Voice badge
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.accent}15`,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  voiceBadgeText: { fontSize: 10, color: COLORS.accent, fontWeight: '600' },

  // Typing
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.muted,
  },

  // Welcome
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  welcomeAvatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${COLORS.accent}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: { fontSize: 18, fontWeight: '800', color: COLORS.color },
  welcomeText: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxWidth: 300,
    marginTop: 8,
    justifyContent: 'center',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionText: { fontSize: 12, fontWeight: '600', color: COLORS.color },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.errorSoft,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: { fontSize: 12, color: COLORS.error, flex: 1 },

  // Input area
  inputArea: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.color,
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: COLORS.primary,
  },

  // History
  historyList: { flex: 1, padding: 12 },
  historyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  historyEmpty: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.muted,
    paddingVertical: 40,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  historyItemActive: { backgroundColor: COLORS.primarySoft },
  historyItemInfo: { flex: 1 },
  historyItemTitle: { fontSize: 13, fontWeight: '600', color: COLORS.color },
  historyItemDate: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
})
