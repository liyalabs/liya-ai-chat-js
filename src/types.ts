// Liya AI Chat JS - TypeScript Type Definitions

export interface LiyaChatConfig {
  apiKey: string
  baseUrl: string
  assistantId: string
  assistantName?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: ThemeConfig
  welcomeMessage?: string
  placeholder?: string
  showBranding?: boolean
  showVoice?: boolean
  voiceEnabled?: boolean
  showFileUpload?: boolean
  offsetX?: number  // horizontal offset in pixels
  offsetY?: number  // vertical offset in pixels
  customIcon?: string  // custom icon URL or SVG
  locale?: string
  onOpen?: () => void
  onClose?: () => void
  onMessageSent?: (message: string) => void
  onMessageReceived?: (message: string) => void
  onError?: (error: Error) => void
}

export interface ThemeConfig {
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  borderRadius?: string
  zIndex?: number
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  response_time?: number
  raw_response?: string
}

// Parsed JSON response structure from AI
export interface ParsedResponse {
  response: string
  suggestions?: string[]
  source?: string
  metadata?: {
    confidence?: number
    category?: string
    requires_followup?: boolean
  }
}

export interface Session {
  id: string
  session_name: string
  message_count: number
  created_at: string
  last_message_at: string | null
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  data?: T
  message?: string
}

export interface SendMessageResponse {
  session_id: string
  message_id?: string
  response?: string
  response_time?: number
  user_message?: Message
  assistant_message?: Message
}

export interface SessionHistoryResponse {
  session_id: string
  messages: Message[]
  total: number
}

export interface FileAttachment {
  id: string
  file_name: string
  file_size: number
  file_type: string
}
