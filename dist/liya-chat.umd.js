(function(l,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(l=typeof globalThis<"u"?globalThis:l||self,c(l.LiyaChat={}))})(this,function(l){"use strict";var _=Object.defineProperty;var R=(l,c,u)=>c in l?_(l,c,{enumerable:!0,configurable:!0,writable:!0,value:u}):l[c]=u;var h=(l,c,u)=>R(l,typeof c!="symbol"?c+"":c,u);let c=null;function u(s){c=s}function x(){if(!c)throw new Error("[LiyaChat] Not initialized. Call LiyaChat.init() first.");return c}async function m(s,e={}){const t=x(),i=`${t.baseUrl}${s}`,n={"X-API-Key":t.apiKey,...e.headers};e.body instanceof FormData||(n["Content-Type"]="application/json");const a=await fetch(i,{...e,headers:n});if(!a.ok){const o=await a.json().catch(()=>({message:"Request failed"}));throw new Error(o.message||`HTTP ${a.status}`)}return a.json()}async function L(s,e,t){const i=x(),n=t&&t.length>0?"/api/v1/external/chat/with-files/":"/api/v1/external/chat/",a=await m(n,{method:"POST",body:JSON.stringify({assistant_id:i.assistantId,message:s,session_id:e,file_ids:t})});if(a.status==="error")throw new Error(a.message||"Failed to send message");return a.data}async function $(s){const e=await m(`/api/v1/external/sessions/${s}/history/`);if(e.status==="error")throw new Error(e.message||"Failed to get history");return e.data}async function E(s){const e=x(),t=await m("/api/v1/external/sessions/",{method:"POST",body:JSON.stringify({assistant_id:e.assistantId,session_name:s||"Yeni Sohbet"})});if(t.status==="error")throw new Error(t.message||"Failed to create session");return t.data}async function B(s,e){const t=new FormData;t.append("session_id",s),t.append("file",e);const i=await m("/api/v1/external/files/",{method:"POST",body:t});if(i.status==="error")throw new Error(i.message||"Failed to upload file");return i.data}function z(s={},e=20,t=20){const i=s.primaryColor||"#6366f1",n=T(i,-10),a=s.backgroundColor||"#ffffff",o=s.textColor||"#374151",d=s.fontFamily||"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",p=s.borderRadius||"16px";return`
    .liya-chat-widget {
      position: fixed;
      z-index: ${s.zIndex||9999};
      font-family: ${d};
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }
    .liya-chat-widget * { box-sizing: border-box; }
    
    .liya-chat-widget.bottom-right { bottom: ${t}px; right: ${e}px; }
    .liya-chat-widget.bottom-left { bottom: ${t}px; left: ${e}px; }
    .liya-chat-widget.top-right { top: ${t}px; right: ${e}px; }
    .liya-chat-widget.top-left { top: ${t}px; left: ${e}px; }

    .liya-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      background: ${i};
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
      background: ${a};
      border-radius: ${p};
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
      background: ${i};
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
    .liya-msg-avatar.assistant { background: ${i}; color: white; }
    .liya-msg-avatar.user { background: #e5e7eb; color: ${o}; }

    .liya-msg-content { flex: 1; min-width: 0; }
    .liya-msg-bubble {
      padding: 12px 16px;
      border-radius: 12px;
      word-wrap: break-word;
    }
    .liya-message.user .liya-msg-bubble {
      background: ${i};
      color: white;
      border-bottom-right-radius: 4px;
    }
    .liya-message.assistant .liya-msg-bubble {
      background: #f3f4f6;
      color: ${o};
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
      color: ${i};
      background: transparent;
      border: 1px solid ${i};
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .liya-suggestion-btn:hover {
      background: ${i};
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
      background: ${i};
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
      background: ${a};
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
      color: ${o};
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
    .liya-btn:hover:not(:disabled) { background: ${a}; color: ${o}; }
    .liya-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .liya-btn.send { background: ${i}; color: white; }
    .liya-btn.send:hover:not(:disabled) { background: ${n}; }
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
    .liya-branding a { color: ${i}; text-decoration: none; }
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
  `}function T(s,e){const t=parseInt(s.replace("#",""),16),i=Math.round(2.55*e),n=(t>>16)+i,a=(t>>8&255)+i,o=(t&255)+i;return"#"+(16777216+(n<255?n<1?0:n:255)*65536+(a<255?a<1?0:a:255)*256+(o<255?o<1?0:o:255)).toString(16).slice(1)}function H(s){if(!s)return null;try{let e=s.trim();e.startsWith("```json")?e=e.replace(/^```json\s*/,"").replace(/\s*```$/,""):e.startsWith("```")&&(e=e.replace(/^```\s*/,"").replace(/\s*```$/,""));const t=e.match(/\{[\s\S]*\}/);t&&(e=t[0]);const i=JSON.parse(e);return i&&typeof i.response=="string"?i:null}catch{return null}}class v{constructor(e){h(this,"container",null);h(this,"panel",null);h(this,"messagesContainer",null);h(this,"inputElement",null);h(this,"toggleBtn",null);h(this,"isOpen",!1);h(this,"isLoading",!1);h(this,"messages",[]);h(this,"sessionId",null);h(this,"recognition",null);h(this,"isRecording",!1);this.config=e,u(e),this.loadSessionFromStorage(),this.render(),this.attachEvents()}loadSessionFromStorage(){try{this.sessionId=localStorage.getItem("liya_chat_session_id")}catch{}}saveSessionToStorage(e){try{localStorage.setItem("liya_chat_session_id",e)}catch{}}render(){this.container=document.createElement("div"),this.container.className=`liya-chat-widget ${this.config.position||"bottom-right"}`,this.container.id="liya-chat-widget";const e=document.createElement("style"),t=this.config.offsetX??20,i=this.config.offsetY??20;e.textContent=z(this.config.theme,t,i),this.container.appendChild(e),this.toggleBtn=document.createElement("button"),this.toggleBtn.className="liya-toggle-btn",this.toggleBtn.innerHTML=this.getChatIcon(),this.toggleBtn.setAttribute("aria-label","Sohbeti aç"),this.container.appendChild(this.toggleBtn),this.panel=document.createElement("div"),this.panel.className="liya-chat-panel",this.panel.innerHTML=this.getPanelHTML(),this.container.appendChild(this.panel),document.body.appendChild(this.container),this.messagesContainer=this.panel.querySelector(".liya-messages"),this.inputElement=this.panel.querySelector(".liya-input"),this.sessionId&&this.loadHistory()}getPanelHTML(){const e=this.config.assistantName||"Assistant",t=this.config.welcomeMessage||"Bu chat hizmeti Liya AI tarafından sağlanmaktadır. Size bugün nasıl yardımcı olabilirim?",i=this.config.placeholder||"Mesajınızı yazın...",n=this.config.showBranding!==!1,a=this.config.showVoice!==!1,o=this.config.voiceEnabled!==!1,d=this.config.showFileUpload!==!1;return`
      <div class="liya-header">
        <div class="liya-header-info">
          <div class="liya-avatar">${this.getAssistantIcon()}</div>
          <div class="liya-header-text">
            <h3 class="liya-title">${e}</h3>
            <span class="liya-status">Çevrimiçi</span>
          </div>
        </div>
        <button class="liya-close-btn" aria-label="Kapat">${this.getCloseIcon()}</button>
      </div>
      <div class="liya-messages">
        <div class="liya-welcome">
          <div class="liya-welcome-icon">${this.getChatIcon(48)}</div>
          <p class="liya-welcome-text">${t}</p>
        </div>
      </div>
      <div class="liya-input-area">
        <div class="liya-files" style="display: none;"></div>
        <div class="liya-input-wrapper">
          ${d?`
            <button class="liya-btn file-btn" title="Dosya ekle">${this.getAttachIcon()}</button>
            <input type="file" class="liya-file-input" multiple />
          `:""}
          <textarea class="liya-input" placeholder="${i}" rows="1"></textarea>
          ${a?`
            <button class="liya-btn voice-btn ${o?"":"voice-disabled"}" 
                    title="${o?"Sesle yaz":"Sesli yazma özelliği Premium üyelik gerektirir"}"
                    ${o?"":"disabled"}>
              ${o?this.getMicIcon():this.getMicOffIcon()}
            </button>
          `:""}
          <button class="liya-btn send send-btn" title="Gönder" disabled>${this.getSendIcon()}</button>
        </div>
      </div>
      ${n?`
        <div class="liya-branding">
          Powered by <a href="https://liyalabs.com" target="_blank" rel="noopener">Liya AI</a>
        </div>
      `:""}
    `}attachEvents(){var n,a,o,d,p,y,f,r,b,k;(n=this.toggleBtn)==null||n.addEventListener("click",()=>this.toggle()),(o=(a=this.panel)==null?void 0:a.querySelector(".liya-close-btn"))==null||o.addEventListener("click",()=>this.close()),(d=this.inputElement)==null||d.addEventListener("input",()=>{this.adjustTextareaHeight(),this.updateSendButton()}),(p=this.inputElement)==null||p.addEventListener("keydown",S=>{S.key==="Enter"&&!S.shiftKey&&(S.preventDefault(),this.handleSend())}),(f=(y=this.panel)==null?void 0:y.querySelector(".send-btn"))==null||f.addEventListener("click",()=>this.handleSend());const e=(r=this.panel)==null?void 0:r.querySelector(".voice-btn");e&&this.config.voiceEnabled!==!1&&e.addEventListener("click",()=>this.toggleVoice());const t=(b=this.panel)==null?void 0:b.querySelector(".file-btn"),i=(k=this.panel)==null?void 0:k.querySelector(".liya-file-input");t&&i&&(t.addEventListener("click",()=>i.click()),i.addEventListener("change",()=>this.handleFileSelect(i)))}toggle(){this.isOpen?this.close():this.open()}open(){var e,t,i,n,a;this.isOpen=!0,(e=this.panel)==null||e.classList.add("visible"),(t=this.toggleBtn)==null||t.classList.add("open"),this.toggleBtn&&(this.toggleBtn.innerHTML=this.getCloseIcon()),(i=this.inputElement)==null||i.focus(),(a=(n=this.config).onOpen)==null||a.call(n)}close(){var e,t,i,n;this.isOpen=!1,(e=this.panel)==null||e.classList.remove("visible"),(t=this.toggleBtn)==null||t.classList.remove("open"),this.toggleBtn&&(this.toggleBtn.innerHTML=this.getChatIcon()),(n=(i=this.config).onClose)==null||n.call(i)}async handleSend(){var i,n,a,o,d,p,y,f;const e=(i=this.inputElement)==null?void 0:i.value.trim();if(!e||this.isLoading)return;this.inputElement&&(this.inputElement.value="",this.adjustTextareaHeight(),this.updateSendButton());const t={id:`temp-${Date.now()}`,content:e,role:"user",created_at:new Date().toISOString()};this.messages.push(t),this.renderMessages(),this.isLoading=!0,this.showTypingIndicator();try{const r=await L(e,this.sessionId||void 0);r.session_id&&(this.sessionId=r.session_id,this.saveSessionToStorage(r.session_id)),r.assistant_message?this.messages.push(r.assistant_message):r.response&&this.messages.push({id:r.message_id||`msg-${Date.now()}`,content:r.response,role:"assistant",created_at:new Date().toISOString(),response_time:r.response_time}),(a=(n=this.config).onMessageSent)==null||a.call(n,e),(p=(d=this.config).onMessageReceived)==null||p.call(d,r.response||((o=r.assistant_message)==null?void 0:o.content)||"")}catch(r){(f=(y=this.config).onError)==null||f.call(y,r),this.messages=this.messages.filter(b=>b.id!==t.id)}finally{this.isLoading=!1,this.hideTypingIndicator(),this.renderMessages()}}async loadHistory(){if(this.sessionId)try{const e=await $(this.sessionId);this.messages=e.messages,this.renderMessages()}catch{this.sessionId=null;try{localStorage.removeItem("liya_chat_session_id")}catch{}}}renderMessages(){if(this.messagesContainer){if(this.messages.length===0){const e=this.config.welcomeMessage||"Bu chat hizmeti Liya AI tarafından sağlanmaktadır. Size bugün nasıl yardımcı olabilirim?";this.messagesContainer.innerHTML=`
        <div class="liya-welcome">
          <div class="liya-welcome-icon">${this.getChatIcon(48)}</div>
          <p class="liya-welcome-text">${e}</p>
        </div>
      `;return}this.messagesContainer.innerHTML=this.messages.map(e=>this.getMessageHTML(e)).join(""),this.messagesContainer.querySelectorAll(".liya-suggestion-btn").forEach(e=>{e.addEventListener("click",t=>{const n=t.currentTarget.dataset.suggestion;n&&this.sendMessage(n)})}),this.scrollToBottom()}}getMessageHTML(e){const t=e.role==="user",i=new Date(e.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});let n=e.content,a="";if(!t){const o=H(e.raw_response||e.content);o&&(n=o.response,o.suggestions&&o.suggestions.length>0&&(a=`
            <div class="liya-suggestions">
              ${o.suggestions.map((d,p)=>`
                <button class="liya-suggestion-btn" data-suggestion="${this.escapeHtml(d)}" data-index="${p}">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  ${this.escapeHtml(d)}
                </button>
              `).join("")}
            </div>
          `))}return`
      <div class="liya-message ${t?"user":"assistant"}">
        <div class="liya-msg-avatar ${t?"user":"assistant"}">
          ${t?this.getUserIcon():this.getAssistantIcon()}
        </div>
        <div class="liya-msg-content">
          <div class="liya-msg-bubble">
            <div class="liya-msg-text">${this.escapeHtml(n)}</div>
          </div>
          ${a}
          <div class="liya-msg-meta">
            <span>${i}</span>
            ${e.response_time?`<span>${e.response_time.toFixed(1)}s</span>`:""}
          </div>
        </div>
      </div>
    `}showTypingIndicator(){var t;const e=document.createElement("div");e.className="liya-typing",e.id="liya-typing-indicator",e.innerHTML=`
      <div class="liya-typing-avatar">${this.getAssistantIcon()}</div>
      <div class="liya-typing-dots"><span></span><span></span><span></span></div>
    `,(t=this.messagesContainer)==null||t.appendChild(e),this.scrollToBottom()}hideTypingIndicator(){var e;(e=document.getElementById("liya-typing-indicator"))==null||e.remove()}scrollToBottom(){this.messagesContainer&&(this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight)}adjustTextareaHeight(){this.inputElement&&(this.inputElement.style.height="auto",this.inputElement.style.height=Math.min(this.inputElement.scrollHeight,150)+"px")}updateSendButton(){var t,i;const e=(t=this.panel)==null?void 0:t.querySelector(".send-btn");e&&(e.disabled=!((i=this.inputElement)!=null&&i.value.trim()))}toggleVoice(){!("webkitSpeechRecognition"in window)&&!("SpeechRecognition"in window)||(this.isRecording?this.stopRecording():this.startRecording())}startRecording(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;e&&(this.recognition=new e,this.recognition.continuous=!0,this.recognition.interimResults=!0,this.recognition.lang=this.config.locale||"tr-TR",this.recognition.onresult=t=>{let i="";for(let n=0;n<t.results.length;n++)i+=t.results[n][0].transcript;this.inputElement&&(this.inputElement.value=i,this.updateSendButton())},this.recognition.onend=()=>{this.isRecording=!1,this.updateVoiceButton()},this.recognition.start(),this.isRecording=!0,this.updateVoiceButton())}stopRecording(){var e;(e=this.recognition)==null||e.stop(),this.isRecording=!1,this.updateVoiceButton()}updateVoiceButton(){var t;const e=(t=this.panel)==null?void 0:t.querySelector(".voice-btn");e&&(e.classList.toggle("recording",this.isRecording),e.innerHTML=this.isRecording?this.getStopIcon():this.getMicIcon())}handleFileSelect(e){var n;const t=e.files;if(!t||t.length===0)return;const i=(n=this.panel)==null?void 0:n.querySelector(".liya-files");i&&(i.style.display="flex",i.innerHTML=Array.from(t).map(a=>`
        <div class="liya-file-chip">
          <span>📎</span>
          <span>${a.name}</span>
          <button type="button">✕</button>
        </div>
      `).join("")),e.value=""}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML.replace(/\n/g,"<br>")}getChatIcon(e=28){return`<svg viewBox="0 0 80 92" fill="none" width="${e}" height="${e}">
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
    </svg>`}getCloseIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'}getAssistantIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'}getUserIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}getSendIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'}getMicIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>'}getMicOffIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>'}getStopIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 6h12v12H6z"/></svg>'}getAttachIcon(){return'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>'}destroy(){var e,t;(e=this.container)==null||e.remove(),(t=this.recognition)==null||t.stop()}sendMessage(e){return this.inputElement&&(this.inputElement.value=e),this.handleSend()}clearHistory(){this.messages=[],this.sessionId=null;try{localStorage.removeItem("liya_chat_session_id")}catch{}this.renderMessages()}}let g=null;function w(s){return g&&g.destroy(),g=new v(s),g}function F(){return g}function I(){g==null||g.destroy(),g=null}function C(){const s=document.currentScript;if(!s)return;const e=s.dataset.apiKey,t=s.dataset.baseUrl,i=s.dataset.assistantId;e&&t&&i&&w({apiKey:e,baseUrl:t,assistantId:i,assistantName:s.dataset.assistantName,position:s.dataset.position,welcomeMessage:s.dataset.welcomeMessage,placeholder:s.dataset.placeholder,showBranding:s.dataset.showBranding!=="false",showVoice:s.dataset.showVoice!=="false",voiceEnabled:s.dataset.voiceEnabled!=="false",showFileUpload:s.dataset.showFileUpload!=="false",theme:{primaryColor:s.dataset.primaryColor,backgroundColor:s.dataset.backgroundColor,textColor:s.dataset.textColor,borderRadius:s.dataset.borderRadius,zIndex:s.dataset.zIndex?parseInt(s.dataset.zIndex):void 0}})}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",C):C());const M={init:w,getInstance:F,destroy:I,LiyaChatWidget:v};typeof window<"u"&&(window.LiyaChat=M),l.LiyaChatWidget=v,l.createSession=E,l.default=M,l.destroy=I,l.getInstance=F,l.getSessionHistory=$,l.init=w,l.sendMessage=L,l.uploadFile=B,Object.defineProperties(l,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
