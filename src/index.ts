// Liya AI Chat JS - Main Entry Point
// Vanilla JavaScript Chat Widget for Any Website

import type { LiyaChatConfig } from './types'
import { LiyaChatWidget } from './widget'

export type { LiyaChatConfig, ThemeConfig, Message, Session } from './types'
export { LiyaChatWidget } from './widget'
export { sendMessage, getSessionHistory, createSession, uploadFile } from './api'

let widgetInstance: LiyaChatWidget | null = null

/**
 * Initialize Liya Chat Widget
 * @param config Configuration options
 * @returns LiyaChatWidget instance
 */
export function init(config: LiyaChatConfig): LiyaChatWidget {
  if (widgetInstance) {
    widgetInstance.destroy()
  }
  widgetInstance = new LiyaChatWidget(config)
  return widgetInstance
}

/**
 * Get current widget instance
 */
export function getInstance(): LiyaChatWidget | null {
  return widgetInstance
}

/**
 * Destroy widget instance
 */
export function destroy(): void {
  widgetInstance?.destroy()
  widgetInstance = null
}

// Auto-init from script tag data attributes
function autoInit(): void {
  const script = document.currentScript as HTMLScriptElement
  if (!script) return

  const apiKey = script.dataset.apiKey
  const baseUrl = script.dataset.baseUrl
  const assistantId = script.dataset.assistantId

  if (apiKey && baseUrl && assistantId) {
    init({
      apiKey,
      baseUrl,
      assistantId,
      assistantName: script.dataset.assistantName,
      position: script.dataset.position as LiyaChatConfig['position'],
      welcomeMessage: script.dataset.welcomeMessage,
      placeholder: script.dataset.placeholder,
      showBranding: script.dataset.showBranding !== 'false',
      showVoice: script.dataset.showVoice !== 'false',
      voiceEnabled: script.dataset.voiceEnabled !== 'false',
      showFileUpload: script.dataset.showFileUpload !== 'false',
      theme: {
        primaryColor: script.dataset.primaryColor,
        backgroundColor: script.dataset.backgroundColor,
        textColor: script.dataset.textColor,
        borderRadius: script.dataset.borderRadius,
        zIndex: script.dataset.zIndex ? parseInt(script.dataset.zIndex) : undefined,
      },
    })
  }
}

// Auto-init when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit)
  } else {
    autoInit()
  }
}

// Export for UMD/IIFE
const LiyaChat = {
  init,
  getInstance,
  destroy,
  LiyaChatWidget,
}

export default LiyaChat

// Attach to window for script tag usage
if (typeof window !== 'undefined') {
  (window as any).LiyaChat = LiyaChat
}
