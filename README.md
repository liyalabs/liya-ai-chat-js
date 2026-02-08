# @liyalabs/liya-ai-chat-js

Vanilla JavaScript Chat Widget for Liya AI Assistants. Works with any website - no framework required.

## Features

- 🚀 **Zero Dependencies**: Pure JavaScript, no frameworks needed
- 📦 **Single Script**: Just add one script tag to your website
- 🎨 **Customizable**: Theme, colors, position, and more
- 💬 **Real-time Chat**: Send messages and receive AI responses
- 📁 **File Upload**: Attach files to your messages
- 🎤 **Voice Input**: Speech-to-text support
- 📱 **Responsive**: Mobile-friendly design
- 🔒 **TypeScript**: Full type support

## Installation

### Option 1: Script Tag (Recommended)

Add this script tag to your HTML:

```html
<script 
  src="https://cdn.liyalabs.com/liya-chat.min.js"
  data-api-key="liwhai_your_api_key_here"
  data-base-url="https://app-1-ai.liyalabs.com"
  data-assistant-id="your-assistant-uuid"
  data-assistant-name="Destek Asistanı"
  data-position="bottom-right"
  data-primary-color="#6366f1"
  data-offset-x="32"
  data-offset-y="32"
></script>
```

That's it! The widget will automatically appear on your website.

### Option 2: NPM Package

```bash
npm install @liyalabs/liya-ai-chat-js
```

```javascript
import LiyaChat from '@liyalabs/liya-ai-chat-js'

LiyaChat.init({
  apiKey: 'liwhai_your_api_key_here',
  baseUrl: 'https://app-1-ai.liyalabs.com',
  assistantId: 'your-assistant-uuid',
  assistantName: 'Destek Asistanı',
  position: 'bottom-right',
  theme: {
    primaryColor: '#6366f1'
  }
})
```

### Option 3: CDN with Manual Init

```html
<script src="https://cdn.liyalabs.com/liya-chat.min.js"></script>
<script>
  LiyaChat.init({
    apiKey: 'liwhai_your_api_key_here',
    baseUrl: 'https://app-1-ai.liyalabs.com',
    assistantId: 'your-assistant-uuid',
    assistantName: 'Destek Asistanı',
    position: 'bottom-right',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
    theme: {
      primaryColor: '#6366f1',
      borderRadius: '16px'
    }
  });
</script>
```

## Configuration

### Script Tag Data Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-api-key` | Yes | Your Liya API key |
| `data-base-url` | Yes | API base URL |
| `data-assistant-id` | Yes | Assistant UUID |
| `data-assistant-name` | No | Display name for the assistant |
| `data-position` | No | Widget position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `data-welcome-message` | No | Welcome message text |
| `data-placeholder` | No | Input placeholder text |
| `data-show-branding` | No | Show "Powered by Liya AI" (`true`/`false`) |
| `data-show-voice` | No | Show voice input button (`true`/`false`) |
| `data-voice-enabled` | No | Enable voice input (`true`/`false`) - `false` for STANDARD users |
| `data-show-file-upload` | No | Show file upload button (`true`/`false`) |
| `data-primary-color` | No | Primary theme color (hex) |
| `data-background-color` | No | Background color (hex) |
| `data-text-color` | No | Text color (hex) |
| `data-border-radius` | No | Border radius (e.g., `16px`) |
| `data-z-index` | No | CSS z-index value |
| `data-offset-x` | No | Horizontal offset in pixels (default: `20`) |
| `data-offset-y` | No | Vertical offset in pixels (default: `20`) |
| `data-custom-icon` | No | Custom widget icon (SVG or image URL) |

### JavaScript Configuration

```typescript
interface LiyaChatConfig {
  // Required
  apiKey: string
  baseUrl: string
  assistantId: string
  
  // Optional
  assistantName?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  welcomeMessage?: string
  placeholder?: string
  showBranding?: boolean
  showVoice?: boolean
  voiceEnabled?: boolean  // false for STANDARD users
  showFileUpload?: boolean
  offsetX?: number
  offsetY?: number
  customIcon?: string
  locale?: string
  
  // Theme
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    borderRadius?: string
    zIndex?: number
  }
  
  // Callbacks
  onOpen?: () => void
  onClose?: () => void
  onMessageSent?: (message: string) => void
  onMessageReceived?: (message: string) => void
  onError?: (error: Error) => void
}
```

## API

### LiyaChat.init(config)

Initialize the chat widget.

```javascript
const widget = LiyaChat.init({
  apiKey: 'liwhai_xxx',
  baseUrl: 'https://app-1-ai.liyalabs.com',
  assistantId: 'uuid',
})
```

### LiyaChat.getInstance()

Get the current widget instance.

```javascript
const widget = LiyaChat.getInstance()
widget.open()
```

### LiyaChat.destroy()

Remove the widget from the page.

```javascript
LiyaChat.destroy()
```

### Widget Instance Methods

```javascript
const widget = LiyaChat.getInstance()

// Open/close the chat panel
widget.open()
widget.close()

// Send a message programmatically
widget.sendMessage('Hello!')

// Clear chat history
widget.clearHistory()

// Remove widget from DOM
widget.destroy()
```

## Examples

### E-commerce Website

```html
<script 
  src="https://cdn.liyalabs.com/liya-chat.min.js"
  data-api-key="liwhai_xxx"
  data-base-url="https://app-1-ai.liyalabs.com"
  data-assistant-id="uuid"
  data-assistant-name="Alışveriş Asistanı"
  data-welcome-message="Merhaba! Ürünlerimiz hakkında sorularınızı yanıtlayabilirim."
  data-primary-color="#10b981"
></script>
```

### WordPress

Add to your theme's `footer.php` or use a plugin to inject scripts:

```php
<script 
  src="https://cdn.liyalabs.com/liya-chat.min.js"
  data-api-key="<?php echo get_option('liya_api_key'); ?>"
  data-base-url="https://app-1-ai.liyalabs.com"
  data-assistant-id="<?php echo get_option('liya_assistant_id'); ?>"
></script>
```

### Shopify

Add to `theme.liquid` before `</body>`:

```liquid
<script 
  src="https://cdn.liyalabs.com/liya-chat.min.js"
  data-api-key="{{ settings.liya_api_key }}"
  data-base-url="https://app-1-ai.liyalabs.com"
  data-assistant-id="{{ settings.liya_assistant_id }}"
  data-assistant-name="{{ shop.name }} Asistanı"
></script>
```

### React/Vue/Angular

While we have dedicated packages for these frameworks, you can also use this vanilla JS version:

```javascript
// In your app initialization
import LiyaChat from '@liyalabs/liya-ai-chat-js'

useEffect(() => {
  LiyaChat.init({
    apiKey: process.env.LIYA_API_KEY,
    baseUrl: 'https://app-1-ai.liyalabs.com',
    assistantId: 'uuid',
  })

  return () => LiyaChat.destroy()
}, [])
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with polyfills)

## License

MIT © Liya Labs

## Support

- Documentation: https://docs.liyalabs.com
- Issues: https://github.com/liyalabs/liya-ai-chat-js/issues
- Email: support@liyalabs.com
