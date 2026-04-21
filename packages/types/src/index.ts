export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  university: string;
  year: number;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  cfu: number;
  description?: string;
}

export interface Exam {
  id: string;
  user_id: string;
  subject_id: string;
  grade: number;
  date: string;
  status: 'planned' | 'passed';
}

export interface UserSubject {
  user_id: string;
  subject_id: string;
  status: 'studying' | 'completed';
}

// ── AI Chat Types ────────────────────────────────────────────────────────────

export type ChatMessageType = 'text' | 'voice' | 'file';
export type ChatMessageRole = 'user' | 'assistant';
export type SamoMood = 'normal' | 'thinking' | 'happy' | 'surprised' | 'encouraging';

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  subject_context?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: ChatMessageRole;
  content: string;
  message_type: ChatMessageType;
  file_url?: string;
  file_name?: string;
  file_mime?: string;
  created_at: string;
}

export interface ChatQuickAction {
  id: string;
  label: string;
  icon: string;
  action: 'generate_quiz' | 'generate_flashcard' | 'summarize' | 'explain';
}

export interface AIChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  mood: SamoMood;
  error: string | null;
}