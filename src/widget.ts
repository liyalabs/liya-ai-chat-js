// Liya AI Chat JS - Chat Widget
import type { LiyaChatConfig, Message, ParsedResponse } from './types'
import { initializeApi, sendMessage, getSessionHistory } from './api'
import { getStyles } from './styles'

// Helper function to parse JSON response from AI
function parseJsonResponse(content: string): ParsedResponse | null {
  if (!content) return null
  
  try {
    let jsonStr = content.trim()
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Try to extract JSON from text if it contains JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    
    const parsed = JSON.parse(jsonStr)
    
    // Validate it has the expected structure
    if (parsed && typeof parsed.response === 'string') {
      return parsed as ParsedResponse
    }
    return null
  } catch {
    return null
  }
}

export class LiyaChatWidget {
  private container: HTMLElement | null = null
  private panel: HTMLElement | null = null
  private messagesContainer: HTMLElement | null = null
  private inputElement: HTMLTextAreaElement | null = null
  private toggleBtn: HTMLElement | null = null
  private isOpen = false
  private isLoading = false
  private messages: Message[] = []
  private sessionId: string | null = null
  private recognition: any = null
  private isRecording = false

  constructor(private config: LiyaChatConfig) {
    initializeApi(config)
    this.loadSessionFromStorage()
    this.render()
    this.attachEvents()
  }

  private loadSessionFromStorage(): void {
    try {
      this.sessionId = localStorage.getItem('liya_chat_session_id')
    } catch {
      // localStorage not available
    }
  }

  private saveSessionToStorage(sessionId: string): void {
    try {
      localStorage.setItem('liya_chat_session_id', sessionId)
    } catch {
      // localStorage not available
    }
  }

  private render(): void {
    // Create container
    this.container = document.createElement('div')
    this.container.className = `liya-chat-widget ${this.config.position || 'bottom-right'}`
    this.container.id = 'liya-chat-widget'

    // Inject styles
    const styleEl = document.createElement('style')
    const offsetX = this.config.offsetX ?? 20
    const offsetY = this.config.offsetY ?? 20
    styleEl.textContent = getStyles(this.config.theme, offsetX, offsetY)
    this.container.appendChild(styleEl)

    // Toggle button
    this.toggleBtn = document.createElement('button')
    this.toggleBtn.className = 'liya-toggle-btn'
    this.toggleBtn.innerHTML = this.getChatIcon()
    this.toggleBtn.setAttribute('aria-label', 'Sohbeti aç')
    this.container.appendChild(this.toggleBtn)

    // Chat panel
    this.panel = document.createElement('div')
    this.panel.className = 'liya-chat-panel'
    this.panel.innerHTML = this.getPanelHTML()
    this.container.appendChild(this.panel)

    // Add to DOM
    document.body.appendChild(this.container)

    // Get references
    this.messagesContainer = this.panel.querySelector('.liya-messages')
    this.inputElement = this.panel.querySelector('.liya-input')

    // Load history if session exists
    if (this.sessionId) {
      this.loadHistory()
    }
  }

  private getPanelHTML(): string {
    const assistantName = this.config.assistantName || 'Assistant'
    const welcomeMessage = this.config.welcomeMessage || 'Bu chat hizmeti Liya AI tarafından sağlanmaktadır. Size bugün nasıl yardımcı olabilirim?'
    const placeholder = this.config.placeholder || 'Mesajınızı yazın...'
    const showBranding = this.config.showBranding !== false
    const showVoice = this.config.showVoice !== false
    const voiceEnabled = this.config.voiceEnabled !== false
    const showFileUpload = this.config.showFileUpload !== false

    return `
      <div class="liya-header">
        <div class="liya-header-info">
          <div class="liya-avatar">${this.getAssistantIcon()}</div>
          <div class="liya-header-text">
            <h3 class="liya-title">${assistantName}</h3>
            <span class="liya-status">Çevrimiçi</span>
          </div>
        </div>
        <button class="liya-close-btn" aria-label="Kapat">${this.getCloseIcon()}</button>
      </div>
      <div class="liya-messages">
        <div class="liya-welcome">
          <div class="liya-welcome-icon">${this.getChatIcon(48)}</div>
          <p class="liya-welcome-text">${welcomeMessage}</p>
        </div>
      </div>
      <div class="liya-input-area">
        <div class="liya-files" style="display: none;"></div>
        <div class="liya-input-wrapper">
          ${showFileUpload ? `
            <button class="liya-btn file-btn" title="Dosya ekle">${this.getAttachIcon()}</button>
            <input type="file" class="liya-file-input" multiple />
          ` : ''}
          <textarea class="liya-input" placeholder="${placeholder}" rows="1"></textarea>
          ${showVoice ? `
            <button class="liya-btn voice-btn ${!voiceEnabled ? 'voice-disabled' : ''}" 
                    title="${!voiceEnabled ? 'Sesli yazma özelliği Premium üyelik gerektirir' : 'Sesle yaz'}"
                    ${!voiceEnabled ? 'disabled' : ''}>
              ${!voiceEnabled ? this.getMicOffIcon() : this.getMicIcon()}
            </button>
          ` : ''}
          <button class="liya-btn send send-btn" title="Gönder" disabled>${this.getSendIcon()}</button>
        </div>
      </div>
      ${showBranding ? `
        <div class="liya-branding">
          Powered by <a href="https://liyalabs.com" target="_blank" rel="noopener">Liya AI</a>
        </div>
      ` : ''}
    `
  }

  private attachEvents(): void {
    // Toggle button
    this.toggleBtn?.addEventListener('click', () => this.toggle())

    // Close button
    this.panel?.querySelector('.liya-close-btn')?.addEventListener('click', () => this.close())

    // Input events
    this.inputElement?.addEventListener('input', () => {
      this.adjustTextareaHeight()
      this.updateSendButton()
    })

    this.inputElement?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.handleSend()
      }
    })

    // Send button
    this.panel?.querySelector('.send-btn')?.addEventListener('click', () => this.handleSend())

    // Voice button
    const voiceBtn = this.panel?.querySelector('.voice-btn')
    if (voiceBtn && this.config.voiceEnabled !== false) {
      voiceBtn.addEventListener('click', () => this.toggleVoice())
    }

    // File upload
    const fileBtn = this.panel?.querySelector('.file-btn')
    const fileInput = this.panel?.querySelector('.liya-file-input') as HTMLInputElement
    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', () => fileInput.click())
      fileInput.addEventListener('change', () => this.handleFileSelect(fileInput))
    }
  }

  private toggle(): void {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  public open(): void {
    this.isOpen = true
    this.panel?.classList.add('visible')
    this.toggleBtn?.classList.add('open')
    if (this.toggleBtn) this.toggleBtn.innerHTML = this.getCloseIcon()
    this.inputElement?.focus()
    this.config.onOpen?.()
  }

  public close(): void {
    this.isOpen = false
    this.panel?.classList.remove('visible')
    this.toggleBtn?.classList.remove('open')
    if (this.toggleBtn) this.toggleBtn.innerHTML = this.getChatIcon()
    this.config.onClose?.()
  }

  private async handleSend(): Promise<void> {
    const message = this.inputElement?.value.trim()
    if (!message || this.isLoading) return

    // Clear input
    if (this.inputElement) {
      this.inputElement.value = ''
      this.adjustTextareaHeight()
      this.updateSendButton()
    }

    // Add user message
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      content: message,
      role: 'user',
      created_at: new Date().toISOString(),
    }
    this.messages.push(userMsg)
    this.renderMessages()

    // Show loading
    this.isLoading = true
    this.showTypingIndicator()

    try {
      const response = await sendMessage(message, this.sessionId || undefined)

      // Update session
      if (response.session_id) {
        this.sessionId = response.session_id
        this.saveSessionToStorage(response.session_id)
      }

      // Add assistant message
      if (response.assistant_message) {
        this.messages.push(response.assistant_message)
      } else if (response.response) {
        this.messages.push({
          id: response.message_id || `msg-${Date.now()}`,
          content: response.response,
          role: 'assistant',
          created_at: new Date().toISOString(),
          response_time: response.response_time,
        })
      }

      this.config.onMessageSent?.(message)
      this.config.onMessageReceived?.(response.response || response.assistant_message?.content || '')

    } catch (error) {
      this.config.onError?.(error as Error)
      // Remove temp message on error
      this.messages = this.messages.filter(m => m.id !== userMsg.id)
    } finally {
      this.isLoading = false
      this.hideTypingIndicator()
      this.renderMessages()
    }
  }

  private async loadHistory(): Promise<void> {
    if (!this.sessionId) return

    try {
      const response = await getSessionHistory(this.sessionId)
      this.messages = response.messages
      this.renderMessages()
    } catch {
      // Session might be invalid, clear it
      this.sessionId = null
      try {
        localStorage.removeItem('liya_chat_session_id')
      } catch {
        // ignore
      }
    }
  }

  private renderMessages(): void {
    if (!this.messagesContainer) return

    if (this.messages.length === 0) {
      const welcomeMessage = this.config.welcomeMessage || 'Bu chat hizmeti Liya AI tarafından sağlanmaktadır. Size bugün nasıl yardımcı olabilirim?'
      this.messagesContainer.innerHTML = `
        <div class="liya-welcome">
          <div class="liya-welcome-icon">${this.getChatIcon(48)}</div>
          <p class="liya-welcome-text">${welcomeMessage}</p>
        </div>
      `
      return
    }

    this.messagesContainer.innerHTML = this.messages.map(msg => this.getMessageHTML(msg)).join('')
    
    // Attach click handlers for suggestion buttons
    this.messagesContainer.querySelectorAll('.liya-suggestion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement
        const suggestion = target.dataset.suggestion
        if (suggestion) {
          this.sendMessage(suggestion)
        }
      })
    })
    
    this.scrollToBottom()
  }

  private getMessageHTML(msg: Message): string {
    const isUser = msg.role === 'user'
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Parse JSON response for assistant messages
    let displayContent = msg.content
    let suggestionsHtml = ''
    
    if (!isUser) {
      const parsed = parseJsonResponse(msg.raw_response || msg.content)
      if (parsed) {
        displayContent = parsed.response
        if (parsed.suggestions && parsed.suggestions.length > 0) {
          suggestionsHtml = `
            <div class="liya-suggestions">
              ${parsed.suggestions.map((suggestion, index) => `
                <button class="liya-suggestion-btn" data-suggestion="${this.escapeHtml(suggestion)}" data-index="${index}">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  ${this.escapeHtml(suggestion)}
                </button>
              `).join('')}
            </div>
          `
        }
      }
    }

    return `
      <div class="liya-message ${isUser ? 'user' : 'assistant'}">
        <div class="liya-msg-avatar ${isUser ? 'user' : 'assistant'}">
          ${isUser ? this.getUserIcon() : this.getAssistantIcon()}
        </div>
        <div class="liya-msg-content">
          <div class="liya-msg-bubble">
            <div class="liya-msg-text">${this.escapeHtml(displayContent)}</div>
          </div>
          ${suggestionsHtml}
          <div class="liya-msg-meta">
            <span>${time}</span>
            ${msg.response_time ? `<span>${msg.response_time.toFixed(1)}s</span>` : ''}
          </div>
        </div>
      </div>
    `
  }

  private showTypingIndicator(): void {
    const indicator = document.createElement('div')
    indicator.className = 'liya-typing'
    indicator.id = 'liya-typing-indicator'
    indicator.innerHTML = `
      <div class="liya-typing-avatar">${this.getAssistantIcon()}</div>
      <div class="liya-typing-dots"><span></span><span></span><span></span></div>
    `
    this.messagesContainer?.appendChild(indicator)
    this.scrollToBottom()
  }

  private hideTypingIndicator(): void {
    document.getElementById('liya-typing-indicator')?.remove()
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    }
  }

  private adjustTextareaHeight(): void {
    if (this.inputElement) {
      this.inputElement.style.height = 'auto'
      this.inputElement.style.height = Math.min(this.inputElement.scrollHeight, 150) + 'px'
    }
  }

  private updateSendButton(): void {
    const sendBtn = this.panel?.querySelector('.send-btn') as HTMLButtonElement
    if (sendBtn) {
      sendBtn.disabled = !this.inputElement?.value.trim()
    }
  }

  private toggleVoice(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    if (this.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  }

  private startRecording(): void {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    this.recognition = new SpeechRecognitionAPI()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = this.config.locale || 'tr-TR'

    this.recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (this.inputElement) {
        this.inputElement.value = transcript
        this.updateSendButton()
      }
    }

    this.recognition.onend = () => {
      this.isRecording = false
      this.updateVoiceButton()
    }

    this.recognition.start()
    this.isRecording = true
    this.updateVoiceButton()
  }

  private stopRecording(): void {
    this.recognition?.stop()
    this.isRecording = false
    this.updateVoiceButton()
  }

  private updateVoiceButton(): void {
    const voiceBtn = this.panel?.querySelector('.voice-btn')
    if (voiceBtn) {
      voiceBtn.classList.toggle('recording', this.isRecording)
      voiceBtn.innerHTML = this.isRecording ? this.getStopIcon() : this.getMicIcon()
    }
  }

  private handleFileSelect(input: HTMLInputElement): void {
    // File upload logic - simplified for now
    const files = input.files
    if (!files || files.length === 0) return

    // Show file chips
    const filesContainer = this.panel?.querySelector('.liya-files') as HTMLElement
    if (filesContainer) {
      filesContainer.style.display = 'flex'
      filesContainer.innerHTML = Array.from(files).map(f => `
        <div class="liya-file-chip">
          <span>📎</span>
          <span>${f.name}</span>
          <button type="button">✕</button>
        </div>
      `).join('')
    }

    input.value = ''
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML.replace(/\n/g, '<br>')
  }

  // SVG Icons - Liya AI Logo
  private getChatIcon(size = 28): string {
    return `<svg viewBox="0 0 80 92" fill="none" width="${size}" height="${size}">
      <rect x="0" y="0" width="80" height="80" rx="18" fill="#6366F1"/>
      <path d="M22 80 L34 80 L28 92 Z" fill="#6366F1"/>
      <path d="M36 26 V58 H56" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <circle cx="36" cy="26" r="3" fill="#FFFFFF"/>
      <circle cx="36" cy="58" r="3" fill="#FFFFFF"/>
      <circle cx="56" cy="58" r="3" fill="#FFFFFF"/>
      <text x="40" y="52" font-size="12" font-weight="600" font-family="system-ui, sans-serif" fill="#FFFFFF">ai</text>
      <path d="M58 16 L60 20 L64 22 L60 24 L58 28 L56 24 L52 22 L56 20 Z" fill="#FFFFFF"/>
      <path d="M66 30 L67.5 33 L71 34.5 L67.5 36 L66 39 L64.5 36 L61 34.5 L64.5 33 Z" fill="#FFFFFF"/>
      <path d="M50 18 L51.5 21 L55 22.5 L51.5 24 L50 27 L48.5 24 L45 22.5 L48.5 21 Z" fill="#FFFFFF"/>
    </svg>`
  }

  private getCloseIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
  }

  private getAssistantIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  }

  private getUserIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
  }

  private getSendIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`
  }

  private getMicIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`
  }

  private getMicOffIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>`
  }

  private getStopIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 6h12v12H6z"/></svg>`
  }

  private getAttachIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>`
  }

  // Public methods
  public destroy(): void {
    this.container?.remove()
    this.recognition?.stop()
  }

  public sendMessage(message: string): Promise<void> {
    if (this.inputElement) {
      this.inputElement.value = message
    }
    return this.handleSend()
  }

  public clearHistory(): void {
    this.messages = []
    this.sessionId = null
    try {
      localStorage.removeItem('liya_chat_session_id')
    } catch {
      // ignore
    }
    this.renderMessages()
  }
}
