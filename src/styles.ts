// Liya AI Chat JS - Embedded Styles
import type { ThemeConfig } from './types'

export function getStyles(theme: ThemeConfig = {}, offsetX = 20, offsetY = 20): string {
  const primaryColor = theme.primaryColor || '#6366f1'
  const primaryHover = adjustColor(primaryColor, -10)
  const bgColor = theme.backgroundColor || '#ffffff'
  const textColor = theme.textColor || '#374151'
  const fontFamily = theme.fontFamily || "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  const borderRadius = theme.borderRadius || '16px'
  const zIndex = theme.zIndex || 9999

  return `
    .liya-chat-widget {
      position: fixed;
      z-index: ${zIndex};
      font-family: ${fontFamily};
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }
    .liya-chat-widget * { box-sizing: border-box; }
    
    .liya-chat-widget.bottom-right { bottom: ${offsetY}px; right: ${offsetX}px; }
    .liya-chat-widget.bottom-left { bottom: ${offsetY}px; left: ${offsetX}px; }
    .liya-chat-widget.top-right { top: ${offsetY}px; right: ${offsetX}px; }
    .liya-chat-widget.top-left { top: ${offsetY}px; left: ${offsetX}px; }

    .liya-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: ${primaryColor};
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }
    .liya-toggle-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    .liya-toggle-btn.open { background: #9ca3af; }

    .liya-chat-panel {
      position: absolute;
      width: 380px;
      height: 550px;
      max-height: calc(100vh - 100px);
      background: ${bgColor};
      border-radius: ${borderRadius};
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    .liya-chat-panel.visible { display: flex; }
    
    .bottom-right .liya-chat-panel, .bottom-left .liya-chat-panel { bottom: 70px; }
    .top-right .liya-chat-panel, .top-left .liya-chat-panel { top: 70px; }
    .bottom-right .liya-chat-panel, .top-right .liya-chat-panel { right: 0; }
    .bottom-left .liya-chat-panel, .top-left .liya-chat-panel { left: 0; }

    .liya-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: ${primaryColor};
      color: white;
    }
    .liya-header-info { display: flex; align-items: center; gap: 12px; }
    .liya-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .liya-header-text { display: flex; flex-direction: column; }
    .liya-title { margin: 0; font-size: 16px; font-weight: 600; }
    .liya-status { font-size: 12px; opacity: 0.9; }
    .liya-close-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      opacity: 0.8;
    }
    .liya-close-btn:hover { opacity: 1; }

    .liya-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .liya-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
    }
    .liya-welcome-icon { margin-bottom: 16px; opacity: 0.5; }
    .liya-welcome-text { font-size: 14px; max-width: 280px; margin: 0; }

    .liya-message {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      max-width: 85%;
    }
    .liya-message.user { margin-left: auto; flex-direction: row-reverse; }
    .liya-message.assistant { margin-right: auto; }

    .liya-msg-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .liya-msg-avatar.assistant { background: ${primaryColor}; color: white; }
    .liya-msg-avatar.user { background: #e5e7eb; color: ${textColor}; }

    .liya-msg-content { flex: 1; min-width: 0; }
    .liya-msg-bubble {
      padding: 12px 16px;
      border-radius: 12px;
      word-wrap: break-word;
    }
    .liya-message.user .liya-msg-bubble {
      background: ${primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }
    .liya-message.assistant .liya-msg-bubble {
      background: #f3f4f6;
      color: ${textColor};
      border-bottom-left-radius: 4px;
    }
    .liya-msg-text { font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
    .liya-msg-meta {
      display: flex;
      gap: 8px;
      margin-top: 4px;
      font-size: 11px;
      color: #9ca3af;
    }
    .liya-message.user .liya-msg-meta { justify-content: flex-end; }

    .liya-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .liya-suggestion-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      font-size: 13px;
      font-family: inherit;
      color: ${primaryColor};
      background: transparent;
      border: 1px solid ${primaryColor};
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .liya-suggestion-btn:hover {
      background: ${primaryColor};
      color: white;
    }
    .liya-suggestion-btn svg {
      flex-shrink: 0;
    }

    .liya-typing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .liya-typing-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .liya-typing-dots {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
    }
    .liya-typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      animation: liya-bounce 1.4s infinite ease-in-out both;
    }
    .liya-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .liya-typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes liya-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .liya-input-area {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      background: ${bgColor};
    }
    .liya-input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: #f3f4f6;
      border-radius: 24px;
      padding: 8px 12px;
    }
    .liya-input {
      flex: 1;
      border: none;
      background: transparent;
      resize: none;
      font-size: 14px;
      line-height: 1.5;
      max-height: 150px;
      color: ${textColor};
      font-family: inherit;
      outline: none;
    }
    .liya-input::placeholder { color: #9ca3af; }

    .liya-btn {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      background: transparent;
      color: #9ca3af;
    }
    .liya-btn:hover:not(:disabled) { background: ${bgColor}; color: ${textColor}; }
    .liya-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .liya-btn.send { background: ${primaryColor}; color: white; }
    .liya-btn.send:hover:not(:disabled) { background: ${primaryHover}; }
    .liya-btn.recording { background: #dc2626; color: white; animation: liya-pulse 1.5s infinite; }
    .liya-btn.voice-disabled { opacity: 0.4; cursor: not-allowed; }
    @keyframes liya-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

    .liya-branding {
      padding: 8px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
    .liya-branding a { color: ${primaryColor}; text-decoration: none; }
    .liya-branding a:hover { text-decoration: underline; }

    .liya-file-input { display: none; }
    .liya-files { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .liya-file-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: #f3f4f6;
      border-radius: 8px;
      font-size: 12px;
    }
    .liya-file-chip button {
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      color: #9ca3af;
      display: flex;
    }

    @media (max-width: 480px) {
      .liya-chat-panel {
        width: calc(100vw - 40px);
        height: calc(100vh - 100px);
        max-height: none;
      }
    }
  `
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}
