import { create } from 'zustand'
import { supabase } from './supabase'
import type {
  ChatConversation,
  ChatMessage,
  ChatMessageType,
  AIChatState,
  SamoMood,
} from '@studio-l22/types'

// ── Edge Function URL ────────────────────────────────────────────────────────
const AI_CHAT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  ''

function getEdgeFunctionUrl(): string {
  return `${AI_CHAT_URL}/functions/v1/ai-chat`
}

// ── Zustand Store ────────────────────────────────────────────────────────────

interface AIChatActions {
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  setMood: (mood: SamoMood) => void
  loadConversations: () => Promise<void>
  createConversation: (title?: string, subjectContext?: string) => Promise<string | null>
  setActiveConversation: (id: string) => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  sendMessage: (content: string, type?: ChatMessageType, fileUrl?: string, fileName?: string, fileMime?: string) => Promise<void>
  clearError: () => void
}

export const useAIChatStore = create<AIChatState & AIChatActions>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isOpen: false,
  isLoading: false,
  mood: 'normal',
  error: null,

  setOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setMood: (mood) => set({ mood }),
  clearError: () => set({ error: null }),

  loadConversations: async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      set({ conversations: data ?? [] })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  createConversation: async (title, subjectContext) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non autenticato')

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: title || 'Nuova conversazione',
          subject_context: subjectContext || null,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        conversations: [data, ...state.conversations],
        activeConversationId: data.id,
        messages: [],
      }))

      return data.id
    } catch (err: any) {
      set({ error: err.message })
      return null
    }
  },

  setActiveConversation: async (id) => {
    set({ activeConversationId: id })
    await get().loadMessages(id)
  },

  loadMessages: async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ messages: data ?? [] })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  sendMessage: async (content, type = 'text', fileUrl, fileName, fileMime) => {
    const state = get()
    let conversationId = state.activeConversationId

    // Auto-create a conversation if none is active
    if (!conversationId) {
      conversationId = await get().createConversation(
        content.slice(0, 50) + (content.length > 50 ? '...' : '')
      )
      if (!conversationId) return
    }

    set({ isLoading: true, mood: 'thinking', error: null })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non autenticato')

      // Save user message
      const userMessage: Partial<ChatMessage> = {
        conversation_id: conversationId,
        role: 'user',
        content,
        message_type: type,
        file_url: fileUrl,
        file_name: fileName,
        file_mime: fileMime,
      }

      const { data: savedUserMsg, error: userMsgError } = await supabase
        .from('chat_messages')
        .insert(userMessage)
        .select()
        .single()

      if (userMsgError) throw userMsgError

      set((state) => ({
        messages: [...state.messages, savedUserMsg],
      }))

      // Call AI edge function
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(getEdgeFunctionUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: content,
          message_type: type,
          file_url: fileUrl,
          file_name: fileName,
          file_mime: fileMime,
          subject_context: state.conversations.find(
            (c) => c.id === conversationId
          )?.subject_context,
        }),
      })

      if (!response.ok) {
        throw new Error('Errore nella risposta AI')
      }

      const aiResponse = await response.json()

      // Save AI response
      const { data: savedAiMsg, error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: aiResponse.reply,
          message_type: 'text',
        })
        .select()
        .single()

      if (aiMsgError) throw aiMsgError

      set((state) => ({
        messages: [...state.messages, savedAiMsg],
        mood: 'happy',
        isLoading: false,
      }))

      // Reset mood after a moment
      setTimeout(() => set({ mood: 'normal' }), 2000)

      // Update conversation timestamp
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
    } catch (err: any) {
      set({
        isLoading: false,
        mood: 'normal',
        error: err.message || 'Si è verificato un errore',
      })
    }
  },
}))

// ── Quick Actions ────────────────────────────────────────────────────────────

export const SAMO_QUICK_ACTIONS = [
  {
    id: 'quiz',
    label: 'Genera Quiz',
    icon: 'Brain',
    action: 'generate_quiz' as const,
    prompt: 'Genera un quiz con 5 domande a risposta multipla su questo argomento.',
  },
  {
    id: 'flashcard',
    label: 'Genera Flashcard',
    icon: 'Layers3',
    action: 'generate_flashcard' as const,
    prompt: 'Crea 5 flashcard (domanda/risposta) su questo argomento.',
  },
  {
    id: 'summarize',
    label: 'Riassumi',
    icon: 'FileText',
    action: 'summarize' as const,
    prompt: 'Fai un riassunto chiaro e conciso di questo argomento.',
  },
  {
    id: 'explain',
    label: 'Spiega',
    icon: 'MessageCircle',
    action: 'explain' as const,
    prompt: 'Spiegami questo concetto in modo semplice e chiaro.',
  },
]
