// Liya AI Chat JS - API Client
import type { 
  LiyaChatConfig, 
  ApiResponse, 
  SendMessageResponse, 
  SessionHistoryResponse,
  Session,
  FileAttachment 
} from './types'

let config: LiyaChatConfig | null = null

export function initializeApi(cfg: LiyaChatConfig): void {
  config = cfg
}

export function getConfig(): LiyaChatConfig {
  if (!config) {
    throw new Error('[LiyaChat] Not initialized. Call LiyaChat.init() first.')
  }
  return config
}

async function request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const cfg = getConfig()
  
  const url = `${cfg.baseUrl}${endpoint}`
  const headers: Record<string, string> = {
    'X-API-Key': cfg.apiKey,
    ...options.headers as Record<string, string>,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function sendMessage(
  message: string,
  sessionId?: string,
  fileIds?: string[]
): Promise<SendMessageResponse> {
  const cfg = getConfig()
  
  const endpoint = fileIds && fileIds.length > 0 
    ? '/api/v1/external/chat/with-files/' 
    : '/api/v1/external/chat/'

  const response = await request<ApiResponse<SendMessageResponse>>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      assistant_id: cfg.assistantId,
      message,
      session_id: sessionId,
      file_ids: fileIds,
    }),
  })

  if (response.status === 'error') {
    throw new Error(response.message || 'Failed to send message')
  }

  return response.data!
}

export async function getSessionHistory(
  sessionId: string
): Promise<SessionHistoryResponse> {
  const response = await request<ApiResponse<SessionHistoryResponse>>(
    `/api/v1/external/sessions/${sessionId}/history/`
  )

  if (response.status === 'error') {
    throw new Error(response.message || 'Failed to get history')
  }

  return response.data!
}

export async function createSession(
  sessionName?: string
): Promise<Session> {
  const cfg = getConfig()
  
  const response = await request<ApiResponse<Session>>(
    '/api/v1/external/sessions/',
    {
      method: 'POST',
      body: JSON.stringify({
        assistant_id: cfg.assistantId,
        session_name: sessionName || 'Yeni Sohbet',
      }),
    }
  )

  if (response.status === 'error') {
    throw new Error(response.message || 'Failed to create session')
  }

  return response.data!
}

export async function uploadFile(
  sessionId: string,
  file: File
): Promise<FileAttachment> {
  const formData = new FormData()
  formData.append('session_id', sessionId)
  formData.append('file', file)

  const response = await request<ApiResponse<FileAttachment>>(
    '/api/v1/external/files/',
    {
      method: 'POST',
      body: formData,
    }
  )

  if (response.status === 'error') {
    throw new Error(response.message || 'Failed to upload file')
  }

  return response.data!
}
