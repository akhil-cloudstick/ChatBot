(function () {
    const SERVER_URL = 'http://localhost:3001';
    const WEBSITE_ID = window.LC_WEBSITE_ID || 'd894d558-a671-473a-a1b6-a5b11176b8e5';
    let audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .lc-widget-bubble { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5); cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; transition: all 0.3s; }
    .lc-widget-bubble:hover { transform: scale(1.1) translateY(-5px); }
    .lc-widget-bubble svg { width: 28px; height: 28px; fill: white; }
    .lc-badge { position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; min-width: 20px; height: 20px; border-radius: 10px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700; padding: 0 5px; box-sizing: border-box; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    
    .lc-widget-window { position: fixed; bottom: 100px; right: 20px; width: 380px; height: 600px; background: #fff; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); z-index: 9999; display: none; flex-direction: column; overflow: hidden; font-family: 'Inter', sans-serif; border: 1px solid rgba(0,0,0,0.05); }
    .lc-widget-window.open { display: flex; }
    
    .lc-header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .lc-header-info { display: flex; flex: 1; align-items: center; gap: 10px; }
    .lc-header-text { display: flex; flex-direction: column; color: white; }
    .lc-header-title { font-weight: 600; font-size: 15px; letter-spacing: -0.2px; }
    .lc-header-controls { display: flex; gap: 12px; align-items: center; justify-content: flex-end; flex: 1; }
    
    .lc-end-btn { background: rgba(255, 255, 255, 0.2); color: white; border: none; padding: 6px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
    .lc-end-btn:hover { background: #ef4444; color: white; }

    .lc-icon-btn { cursor: pointer; opacity: 0.8; width: 30px; height: 30px; border-radius: 50%; background: transparent; border: none; color: white; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .lc-icon-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .lc-icon-btn:hover { opacity: 1; background: rgba(255, 255, 255, 0.2); }
    
    .lc-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f8fafc; position: relative; }
    
    .lc-form-view { padding: 35px 25px 25px 25px; display: flex; flex-direction: column; gap: 12px; height: 100%; box-sizing: border-box; justify-content: flex-start; background: #fff; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; }
    .lc-form-view::-webkit-scrollbar { display: none; }
    .lc-form-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 5px; letter-spacing: -0.3px; }
    .lc-field { display: flex; flex-direction: column; gap: 4px; }
    .lc-label { font-size: 0.75rem; color: #475569; font-weight: 600; margin-left: 2px; }
    .lc-input-field { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-family: inherit; font-size: 0.85rem; color: #0f172a; background: #f8fafc; transition: all 0.2s; }
    .lc-input-field::placeholder { color: #cbd5e1; }
    .lc-input-field:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    textarea.lc-input-field { resize: vertical; min-height: 80px; max-height: 250px; }
    
    .lc-custom-select-wrapper { position: relative; }
    .lc-custom-select { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.85rem; background: #f8fafc; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
    .lc-custom-select:hover { border-color: #cbd5e1; }
    .lc-custom-select.active { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .lc-custom-select svg { width: 16px; height: 16px; stroke: #64748b; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.2s; }
    .lc-custom-select.active svg { transform: rotate(180deg); }
    .lc-custom-options { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 20; display: none; flex-direction: column; max-height: 200px; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }
    .lc-custom-options::-webkit-scrollbar { display: none; }
    .lc-custom-options.open { display: flex; }
    .lc-custom-search { padding: 8px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: white; z-index: 21; }
    .lc-custom-search-input { width: 100%; box-sizing: border-box; padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.8rem; outline: none; font-family: inherit; }
    .lc-custom-search-input:focus { border-color: #3b82f6; }
    .lc-custom-option { padding: 10px 12px; font-size: 0.85rem; color: #0f172a; cursor: pointer; transition: background 0.1s; }
    .lc-custom-option:hover { background: #f1f5f9; }

    .lc-submit-btn { margin-top: 5px; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); }
    .lc-submit-btn:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3); }

    .lc-waiting-view { display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; text-align: center; color: #64748b; }
    .lc-feedback-view { display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px 30px; text-align: center; background: #fff; }
    .lc-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .lc-chat-view { display: none; flex-direction: column; height: 100%; position: relative; }
    .lc-messages { flex: 1; padding: 20px 10px 20px 20px; overflow-y: auto; display: flex; flex-direction: column; scrollbar-width: none; -ms-overflow-style: none; }
    .lc-messages::-webkit-scrollbar { display: none; }
    .lc-scroll-down { position: absolute; bottom: 85px; right: 20px; width: 36px; height: 36px; background: white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: none; align-items: center; justify-content: center; cursor: pointer; color: #3b82f6; border: 1px solid #e2e8f0; z-index: 10; transition: all 0.2s; }
    .lc-scroll-down:hover { background: #f8fafc; transform: translateY(-2px); }
    .lc-scroll-down svg { width: 20px; height: 20px; fill: currentColor; }
    .lc-message { display: flex; flex-direction: column; width: 100%; margin-bottom: 16px; }
    .lc-message.group-first, .lc-message.group-middle { margin-bottom: 2px; }
    .lc-message.visitor { align-items: flex-end; }
    .lc-message.admin { align-items: flex-start; }
    .lc-msg-meta { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
    .lc-message.admin .lc-msg-meta { margin-left: 36px; }
    .lc-msg-row { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; box-sizing: border-box; }
    .lc-message.visitor .lc-msg-row { flex-direction: row-reverse; }
    .lc-msg-bubble { padding: 8px 14px; font-size: 14px; line-height: 1.4; box-shadow: 0 1px 2px rgba(0,0,0,0.1); word-break: break-word; min-width: 0; }
    .lc-message.visitor .lc-msg-bubble { background: #3b82f6; color: white; }
    .lc-message.admin .lc-msg-bubble { background: white; color: #1e293b; }
    .lc-message.has-file .lc-msg-bubble { padding: 4px; width: 260px; max-width: 100%; box-sizing: border-box; flex-shrink: 0; }
    
    .lc-message.single .lc-msg-bubble { border-radius: 20px; }
    .lc-message.visitor.group-first .lc-msg-bubble { border-radius: 20px 20px 4px 20px; }
    .lc-message.visitor.group-middle .lc-msg-bubble { border-radius: 20px 4px 4px 20px; }
    .lc-message.visitor.group-last .lc-msg-bubble { border-radius: 20px 4px 20px 20px; }
    .lc-message.admin.group-first .lc-msg-bubble { border-radius: 20px 20px 20px 4px; }
    .lc-message.admin.group-middle .lc-msg-bubble { border-radius: 4px 20px 20px 4px; }
    .lc-message.admin.group-last .lc-msg-bubble { border-radius: 4px 20px 20px 20px; }

    .lc-message .lc-media-wrapper { border-radius: 8px; }
    .lc-message.single.only-file .lc-media-wrapper { border-radius: 16px; }
    .lc-message.visitor.group-first.only-file .lc-media-wrapper { border-radius: 16px 16px 2px 16px; }
    .lc-message.visitor.group-middle.only-file .lc-media-wrapper { border-radius: 16px 2px 2px 16px; }
    .lc-message.visitor.group-last.only-file .lc-media-wrapper { border-radius: 16px 2px 16px 16px; }
    .lc-message.admin.group-first.only-file .lc-media-wrapper { border-radius: 16px 16px 16px 2px; }
    .lc-message.admin.group-middle.only-file .lc-media-wrapper { border-radius: 2px 16px 16px 2px; }
    .lc-message.admin.group-last.only-file .lc-media-wrapper { border-radius: 2px 16px 16px 16px; }

    .lc-message.single.has-file:not(.only-file) .lc-media-wrapper { border-radius: 16px 16px 6px 6px; }
    .lc-message.visitor.group-first.has-file:not(.only-file) .lc-media-wrapper { border-radius: 16px 16px 6px 6px; }
    .lc-message.visitor.group-middle.has-file:not(.only-file) .lc-media-wrapper { border-radius: 16px 2px 6px 6px; }
    .lc-message.visitor.group-last.has-file:not(.only-file) .lc-media-wrapper { border-radius: 16px 2px 6px 6px; }
    .lc-message.admin.group-first.has-file:not(.only-file) .lc-media-wrapper { border-radius: 16px 16px 6px 6px; }
    .lc-message.admin.group-middle.has-file:not(.only-file) .lc-media-wrapper { border-radius: 2px 16px 6px 6px; }
    .lc-message.admin.group-last.has-file:not(.only-file) .lc-media-wrapper { border-radius: 2px 16px 6px 6px; }

    .lc-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; }
    .lc-message.admin.group-first .lc-avatar, .lc-message.admin.group-middle .lc-avatar { opacity: 0; pointer-events: none; }
    
    .lc-msg-time { font-size: 11px; color: #cbd5e1; white-space: nowrap; margin-bottom: 6px; font-weight: 500; }
    .lc-message.group-first .lc-msg-time, .lc-message.group-middle .lc-msg-time { opacity: 0; pointer-events: none; }
    
    .lc-input-area { padding: 15px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; align-items: flex-end; position: relative; }
    .lc-attach-btn { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0 0 9px 0; color: #64748b; transition: color 0.2s; }
    .lc-attach-btn:hover { color: #3b82f6; }
    .lc-attach-btn svg { width: 22px; height: 22px; fill: currentColor; }
    .lc-input { flex: 1; border: 1px solid #cbd5e1; border-radius: 20px; padding: 10px 15px; outline: none; font-size: 14px; background: white; resize: none; min-height: 40px; max-height: 120px; overflow-y: auto; box-sizing: border-box; font-family: inherit; line-height: 1.4; scrollbar-width: none; }
    .lc-input::-webkit-scrollbar { display: none; }
    .lc-send { background: #3b82f6; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .lc-feedback-icon { width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .lc-feedback-icon svg { width: 32px; height: 32px; fill: #3b82f6; }
    .lc-feedback-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; }
    .lc-feedback-subtitle { font-size: 0.9rem; color: #64748b; margin: 0 0 24px 0; line-height: 1.4; }
    
    .lc-stars { display: flex; gap: 8px; margin-bottom: 24px; }
    .lc-star { cursor: pointer; color: #e2e8f0; transition: transform 0.2s; display: flex; }
    .lc-star:hover { transform: scale(1.15); }
    .lc-star svg { width: 32px; height: 32px; fill: currentColor; }
    .lc-star.active { color: #f59e0b; }
    
    .lc-feedback-textarea { width: 100%; box-sizing: border-box; resize: none; min-height: 100px; margin-bottom: 20px; border-radius: 12px; padding: 12px 15px; }
    .lc-feedback-actions { display: flex; flex-direction: column; width: 100%; gap: 10px; }
    .lc-full-btn { width: 100%; margin: 0; }
    .lc-skip-btn { background: transparent; color: #64748b; border: none; font-weight: 600; font-size: 0.9rem; cursor: pointer; padding: 10px; transition: color 0.2s; }
    .lc-skip-btn:hover { color: #0f172a; text-decoration: underline; }
    `;
    document.head.appendChild(style);

    // Initial HTML
    const root = document.createElement('div');
    root.id = 'lc-root';
    root.innerHTML = `
    <div class="lc-widget-bubble" id="lc-bubble">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
        <div class="lc-badge" id="lc-unread-badge" style="display:none;">0</div>
    </div>
    <div class="lc-widget-window" id="lc-window">
        <div class="lc-header">
            <div class="lc-header-info">
                <div class="lc-header-text">
                    <span class="lc-header-title" id="lc-header-title">Live Support</span>
                </div>
            </div>
            <div class="lc-header-controls">
                <button class="lc-end-btn" id="lc-end-chat" style="display:none;" title="End Chat">End Chat</button>
                <button class="lc-icon-btn" id="lc-minimize" title="Minimize">
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
        <div class="lc-content">
            <div class="lc-form-view" id="lc-view-form">
                <div class="lc-form-title">Contact Support</div>
                <div class="lc-field"><label class="lc-label">Name</label><input class="lc-input-field" id="lc-name" placeholder="John Doe"></div>
                <div class="lc-field"><label class="lc-label">Email</label><input class="lc-input-field" id="lc-email" placeholder="john@example.com"></div>
                <div class="lc-field">
                    <label class="lc-label">Department</label>
                    <div class="lc-custom-select-wrapper">
                        <input type="hidden" id="lc-dept" value="">
                        <div class="lc-custom-select" id="lc-custom-select-trigger">
                            <span id="lc-dept-text" style="color: #cbd5e1;">Select Department</span>
                            <svg viewBox='0 0 24 24'><polyline points='6 9 12 15 18 9'></polyline></svg>
                        </div>
                        <div class="lc-custom-options" id="lc-dept-options"></div>
                    </div>
                </div>
                <div class="lc-field"><label class="lc-label">How can we help?</label><textarea class="lc-input-field" id="lc-desc" rows="3" placeholder="Describe your question or issue..."></textarea></div>
                <button class="lc-submit-btn" id="lc-start-btn">
                    <span>Start Conversation</span>
                    <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
            
            <div class="lc-waiting-view" id="lc-view-waiting">
                <div class="lc-spinner"></div>
                <p>Connecting to agent...</p>
            </div>

            <div class="lc-chat-view" id="lc-view-chat">
                <div class="lc-messages" id="lc-messages"></div>
                <div class="lc-scroll-down" id="lc-scroll-down" title="Scroll to bottom">
                    <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
                </div>
                <div id="lc-file-preview-area" style="display:none; padding: 10px 12px; border-top: 1px solid #e2e8f0; background: #f8fafc; position: relative; width: 100%; box-sizing: border-box;"></div>
                <div class="lc-input-area">
                    <button class="lc-attach-btn" id="lc-attach-btn" title="Attach file">
                        <svg viewBox="0 0 24 24"><path d="M21.58 12.09l-9.37 9.37c-2.83 2.83-7.42 2.83-10.25 0-2.83-2.83-2.83-7.42 0-10.25l9.37-9.37c1.88-1.88 4.93-1.88 6.81 0 1.88 1.88 1.88 4.93 0 6.81l-8.66 8.66c-.94.94-2.46.94-3.4 0-.94-.94-.94-2.46 0-3.4l7.25-7.25 1.41 1.41-7.25 7.25c-.16.16-.16.42 0 .58.16.16.42.16.58 0l8.66-8.66c1.1-1.1 1.1-2.89 0-3.99-1.1-1.1-2.89-1.1-3.99 0l-9.37 9.37c-2.05 2.05-2.05 5.38 0 7.43 2.05 2.05 5.38 2.05 7.43 0l9.37-9.37-1.41-1.41z"/></svg>
                    </button>
                    <input type="file" id="lc-file-input" multiple style="display:none;">
                    <textarea class="lc-input" id="lc-input" placeholder="Type message..." rows="1"></textarea>
                    <button class="lc-send" id="lc-send-btn">➤</button>
                </div>
            </div>

            <div class="lc-feedback-view" id="lc-view-feedback">
                <div class="lc-feedback-icon">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.18 14.14L6.65 11.97l1.41-1.41 2.76 2.76 7.12-7.12 1.41 1.41-8.52 8.53z"/></svg>
                </div>
                <h3 class="lc-feedback-title">Chat Ended</h3>
                <p class="lc-feedback-subtitle">How would you rate your experience?</p>
                <div class="lc-stars">
                    <span class="lc-star" data-v="1"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
                    <span class="lc-star" data-v="2"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
                    <span class="lc-star" data-v="3"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
                    <span class="lc-star" data-v="4"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
                    <span class="lc-star" data-v="5"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
                </div>
                <textarea class="lc-input-field lc-feedback-textarea" id="lc-feedback-comment" placeholder="Tell us more about your experience..."></textarea>
                <div class="lc-feedback-actions">
                    <button class="lc-submit-btn lc-full-btn" id="lc-submit-feedback">Submit Feedback</button>
                    <button class="lc-skip-btn" id="lc-skip-feedback">Skip & Start New Chat</button>
                    <button class="lc-skip-btn" id="lc-email-transcript" style="display:none;">Email Transcript</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.appendChild(root);

    // State
    let ws;
    let chatId = localStorage.getItem('lc_chat_id');
    let sessionData = JSON.parse(localStorage.getItem('lc_data') || '{}');
    let unreadCount = 0;

    // Pagination State
    let chatPage = 1;
    let chatLimit = 20;
    let hasMoreChats = true;
    let isLoadingChats = false;

    function updateBadge() {
        const badge = document.getElementById('lc-unread-badge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    let visitorInfo = {
        ip_address: "",
        country: "",
        browser: "",
        device: "",
        current_page: window.location.href
    };

    function init() {
        logVisitorInfo();
        loadDepts();
        if (sessionData.active && chatId) {
            chatPage = 1;
            hasMoreChats = true;
            isLoadingChats = false;
            connectWebSocket(chatId);
            loadPreviousChats(chatId, chatPage);
            setView('chat');
        } else {
            setView('form');
        }
    }

    function loadDepts() {
        const selValue = document.getElementById('lc-dept');
        const selText = document.getElementById('lc-dept-text');
        const optionsContainer = document.getElementById('lc-dept-options');
        const trigger = document.getElementById('lc-custom-select-trigger');

        let listContainer = document.createElement('div');
        let searchInput = document.createElement('input');

        trigger.addEventListener('click', (e) => {
            optionsContainer.classList.toggle('open');
            trigger.classList.toggle('active');
            if (optionsContainer.classList.contains('open')) {
                searchInput.value = '';
                fetchDepts("");
                setTimeout(() => searchInput.focus(), 50);
            }
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!optionsContainer.contains(e.target) && !trigger.contains(e.target)) {
                optionsContainer.classList.remove('open');
                trigger.classList.remove('active');
            }
        });

        const searchSticky = document.createElement('div');
        searchSticky.className = 'lc-custom-search';
        searchInput.id = 'lc-dept-search';
        searchInput.className = 'lc-custom-search-input';
        searchInput.placeholder = 'Search departments...';
        searchInput.autocomplete = 'off';

        let fetchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(fetchTimeout);
            fetchTimeout = setTimeout(() => {
                fetchDepts(e.target.value);
            }, 300);
        });

        searchSticky.appendChild(searchInput);

        optionsContainer.innerHTML = '';
        optionsContainer.appendChild(searchSticky);
        optionsContainer.appendChild(listContainer);

        function fetchDepts(searchQuery) {
            let url = 'http://localhost:8080/api/v1/client/department';
            if (searchQuery) url += '?search=' + encodeURIComponent(searchQuery);

            fetch(url)
                .then(res => res.json())
                .then(resData => {
                    const data = (resData && resData.response && resData.response.data) ? resData.response.data : [];
                    renderDeptsList(data);
                }).catch(err => {
                    console.error('Error fetching depts:', err);
                    renderDeptsList([]);
                });
        }

        function renderDeptsList(depts) {
            listContainer.innerHTML = '';

            depts.forEach(d => {
                if (!d.status) return; // Only show active status
                const o = document.createElement('div');
                o.className = 'lc-custom-option';
                o.textContent = d.name;
                o.addEventListener('click', () => {
                    selValue.value = d.id;
                    selText.textContent = d.name;
                    selText.style.color = '#0f172a';
                    optionsContainer.classList.remove('open');
                    trigger.classList.remove('active');
                });
                listContainer.appendChild(o);
            });
        }
    }

    function setView(v) {
        ['form', 'waiting', 'chat', 'feedback'].forEach(id => document.getElementById(`lc-view-${id}`).style.display = 'none');
        document.getElementById(`lc-view-${v}`).style.display = 'flex';
        document.getElementById('lc-end-chat').style.display = (v === 'chat' || v === 'waiting') ? 'block' : 'none';
    }

    let reconnectTimeout = null;

    function connectWebSocket(id) {
        if (ws) {
            ws.onclose = null; // Prevent old reconnect triggers
            ws.onerror = null;
            ws.close();
        }

        ws = new WebSocket(`ws://localhost:8080/api/v1/client/ws/chat/${id}?type=client`);

        ws.onopen = () => {
            console.log("WebSocket connected");
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'notification') {
                    console.log("Notification:", data.title);
                } else if (data.type === 'message' || data.type === 'response') {
                    const msg = data.data;
                    if (msg) {
                        const isVisitor = msg.messager === 'client';
                        const existingMsg = document.getElementById(`msg-${msg.id}`);
                        if (!existingMsg) {
                            const profilePic = (msg.employee && msg.employee.profile_pic) || '';
                            addMsg({
                                id: msg.id,
                                sender: isVisitor ? 'visitor' : 'admin',
                                senderName: isVisitor ? 'You' : (msg.message_by || '').split('(')[0].trim(),
                                text: msg.message,
                                profilePic: profilePic,
                                filePath: msg.file_path,
                                createdAt: msg.created_at || msg.CreatedAt || msg.timestamp || new Date().toISOString()
                            });
                            if (!isVisitor) {
                                audio.play().catch(e => { });
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("WebSocket message parsing error", err);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            // ws.close() gets called automatically or we can force it
            if (ws.readyState === WebSocket.OPEN) ws.close();
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            ws = null;
            if (sessionData.active && chatId) {
                if (!reconnectTimeout) {
                    reconnectTimeout = setTimeout(() => {
                        console.log("Attempting to reconnect WebSocket...");
                        reconnectTimeout = null;
                        connectWebSocket(chatId);
                        loadPreviousChats(chatId);
                    }, 3000);
                }
            }
        };
    }

    function loadPreviousChats(id, page = 1) {
        if (page > 1 && (isLoadingChats || !hasMoreChats)) return;
        isLoadingChats = true;

        const msgsContainer = document.getElementById('lc-messages');
        let loader = document.getElementById('lc-chat-loader');

        if (msgsContainer && page > 1) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'lc-chat-loader';
                loader.style.cssText = 'text-align:center; padding: 15px 10px; color: #94a3b8; font-size: 11px; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; flex-shrink: 0; box-sizing: border-box; height: 60px;';
                loader.innerHTML = '<div class="lc-loader" style="width:18px;height:18px;border:2px solid #e2e8f0;border-top:2px solid #3b82f6;border-radius:50%;animation:spin 0.8s linear infinite;"></div><span style="font-weight:500; letter-spacing: 0.3px;">Loading older messages...</span>';
                
                // Keep the loader at the absolute top
                msgsContainer.insertBefore(loader, msgsContainer.firstChild);
            } else {
                loader.style.display = 'flex';
                if (msgsContainer.firstChild !== loader) {
                    msgsContainer.insertBefore(loader, msgsContainer.firstChild);
                }
            }
        }

        const fetchStartTime = Date.now();

        fetch(`http://localhost:8080/api/v1/client/chatbot/chat/${id}?page=${page}&limit=${chatLimit}`)
            .then(res => res.json())
            .then(data => {
                const processResponse = () => {
                    let chatsArray = [];
                    let status = null;

                    if (data) {
                        status = data.status || (data.data && data.data.status);
                    }

                    if (Array.isArray(data)) {
                        chatsArray = data;
                    } else if (data && Array.isArray(data.data)) {
                        chatsArray = data.data;
                    } else if (data && data.data && Array.isArray(data.data.chats)) {
                        chatsArray = data.data.chats;
                    } else if (data && Array.isArray(data.chats)) {
                        chatsArray = data.chats;
                    } else if (data && data.data && Array.isArray(data.data.messages)) {
                        chatsArray = data.data.messages;
                    } else if (data && data.data && Array.isArray(data.data.Messages)) {
                        chatsArray = data.data.Messages;
                    }

                    if (chatsArray.length < chatLimit) {
                        hasMoreChats = false;
                    }

                    if (chatsArray.length > 0) {
                        const tempContainer = document.createElement('div');
                        chatsArray.reverse().forEach(msg => {
                            const isVisitor = msg.messager === 'client';
                            const profilePic = (msg.staff && msg.staff.profile_pic) || (msg.employee && msg.employee.profile_pic) || '';
                            
                            addMsg({
                                id: msg.id,
                                sender: isVisitor ? 'visitor' : 'admin',
                                senderName: isVisitor ? 'You' : (msg.message_by || '').split('(')[0].trim(),
                                text: msg.message,
                                profilePic: profilePic,
                                filePath: msg.file_path,
                                createdAt: msg.created_at || msg.CreatedAt || msg.timestamp || null
                            }, true, page > 1 ? tempContainer : msgsContainer); 
                        });

                        if (page > 1 && msgsContainer) {
                            const previousScrollHeight = msgsContainer.scrollHeight;
                            const previousScrollTop = msgsContainer.scrollTop;

                            if (loader) loader.style.display = 'none';
                            
                            let referenceNode = msgsContainer.firstChild; 
                            if (referenceNode === loader) {
                                referenceNode = loader.nextSibling;
                            }
                            
                            while (tempContainer.firstChild) {
                                msgsContainer.insertBefore(tempContainer.firstChild, referenceNode);
                            }

                            const newScrollHeight = msgsContainer.scrollHeight;
                            msgsContainer.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
                        }
                    } else {
                        if (page === 1) {
                            console.log("No previous chats or unrecognized JSON structure:", data);
                        }
                        hasMoreChats = false;
                        if (loader) loader.style.display = 'none';
                    }

                    if (page === 1) {
                        handleChatStatus(status);
                    }
                    isLoadingChats = false;
                };

                if (page > 1) {
                    const elapsed = Date.now() - fetchStartTime;
                    const delay = Math.max(0, 500 - elapsed);
                    setTimeout(processResponse, delay);
                } else {
                    processResponse();
                }
            }).catch(err => {
                console.error("Error loading chats:", err);
                if (loader) loader.style.display = 'none';
                isLoadingChats = false;
            });
    }

    // Actions
    document.getElementById('lc-start-btn').addEventListener('click', () => {
        const name = document.getElementById('lc-name').value;
        const email = document.getElementById('lc-email').value;
        const dept = document.getElementById('lc-dept').value;
        const desc = document.getElementById('lc-desc').value;

        if (!name || !email) return alert('Name and Email required');

        const websiteId = localStorage.getItem('website_id') || WEBSITE_ID || "d894d558-a671-473a-a1b6-a5b11176b8e5";

        const payload = {
            name: name,
            email: email,
            department_id: parseInt(dept) || 1,
            website_id: websiteId,
            description: desc,
            ip_address: visitorInfo.ip_address || "127.0.0.1",
            country: visitorInfo.country || "Unknown",
            browser: visitorInfo.browser || "Unknown",
            device: visitorInfo.device || "Unknown",
            current_page: visitorInfo.current_page || window.location.href
        };

        setView('waiting');

        fetch(`http://localhost:8080/api/v1/client/chatbot/new_chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("400 Bad Request details:", errorText);
                    throw new Error(`Server returned ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                let id = null;
                let status = null;

                if (data && data.data && data.data.chats && data.data.chats.length > 0) {
                    id = data.data.chats[0].id;
                    status = data.data.chats[0].status;
                } else if (data && data.chats) {
                    id = data.chats.id;
                    status = data.chats.status;
                }

                if (id) {
                    chatId = id;
                    localStorage.setItem('lc_chat_id', chatId);
                    sessionData = { active: true };
                    localStorage.setItem('lc_data', JSON.stringify(sessionData));

                    chatPage = 1;
                    hasMoreChats = true;
                    isLoadingChats = false;

                    connectWebSocket(chatId);
                    loadPreviousChats(chatId, chatPage);
                    setView('chat');
                    handleChatStatus(status);
                } else {
                    alert("Failed to start chat.");
                    setView('form');
                }
            }).catch(err => {
                console.error("Start chat error:", err);
                alert("Error starting chat. Please check the console for details.");
                setView('form');
            });
    });

    document.getElementById('lc-send-btn').addEventListener('click', sendMsg);
    
    const inputEl = document.getElementById('lc-input');
    inputEl.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    });
    inputEl.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        if (this.value === '') this.style.height = '40px';
    });
    
    document.getElementById('lc-attach-btn').addEventListener('click', () => {
        document.getElementById('lc-file-input').click();
    });
    let selectedFilesInfo = []; // array of { id, file, status, msg }

    function renderFilePreview() {
        const pArea = document.getElementById('lc-file-preview-area');
        if (!pArea) return;
        if (selectedFilesInfo.length === 0) {
            pArea.style.display = 'none';
            document.getElementById('lc-input').placeholder = 'Type message...';
            return;
        }
        pArea.style.display = 'flex';
        pArea.innerHTML = '';
        const pendingCount = selectedFilesInfo.filter(f => f.status === 'pending' || f.status === 'failed').length;
        if (pendingCount > 0) {
            document.getElementById('lc-input').placeholder = `${pendingCount} file(s) attached...`;
        } else {
            document.getElementById('lc-input').placeholder = 'Type message...';
        }
        
        const track = document.createElement('div');
        track.id = 'lc-file-track';
        track.style.cssText = 'display:flex; gap:8px; flex-wrap:nowrap; width:max-content; padding: 0 4px;';
        
        selectedFilesInfo.forEach((fObj) => {
            const chip = document.createElement('div');
            // Modern styling
            chip.style.cssText = 'position:relative; display:flex; align-items:center; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:18px; padding:6px 10px; font-size:12.5px; max-width:115px; flex-shrink:0; box-shadow:0 1px 2px rgba(0,0,0,0.02); transition:all 0.2s;';
            
            const iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#64748b" style="margin-right:6px; flex-shrink:0;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
            const icon = fObj.status === 'failed' ? '<span style="margin-right:6px;font-size:14px;">⚠️</span>' : (fObj.status === 'uploading' ? '<div class="lc-loader" style="width:14px;height:14px;border:2px solid #3b82f6;border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;margin-right:6px;flex-shrink:0;"></div>' : iconSvg);
            
            let nameCss = 'white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500; color:#334155; font-family:sans-serif; width:100%; display:block;';
            if (fObj.status === 'failed') nameCss += ' color:#ef4444;';
            if (fObj.status === 'uploading') nameCss += ' opacity:0.6;';
            
            let actionBtn = '';
            if (fObj.status === 'failed') {
                actionBtn = `<span title="Retry" style="cursor:pointer; color:#ef4444; margin-left:4px; font-weight:bold; font-size:14px; padding:0 4px;">↻</span>`;
            }
            
            let crossBtn = '';
            if (fObj.status !== 'uploading') {
                crossBtn = `<span class="lc-chip-cross" style="cursor:pointer; font-weight:bold; margin-left:6px; color:#94a3b8; padding:0 2px; font-size:16px; line-height:1; transition:color 0.2s;" title="Remove">×</span>`;
            }
            
            let nameEl = `
                <div style="flex:1; min-width:0; position:relative; display:flex; align-items:center;" onmouseenter="this.querySelector('.lc-file-tooltip').style.opacity=1;this.querySelector('.lc-file-tooltip').style.visibility='visible';this.querySelector('.lc-file-tooltip').style.transform='translateX(-50%) translateY(0)';" onmouseleave="this.querySelector('.lc-file-tooltip').style.opacity=0;this.querySelector('.lc-file-tooltip').style.visibility='hidden';this.querySelector('.lc-file-tooltip').style.transform='translateX(-50%) translateY(8px)';">
                    <span style="${nameCss}">${fObj.file.name}</span>
                    <div class="lc-file-tooltip" style="position: absolute; bottom: 100%; left: 50%; background: #1e293b; color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 500; word-break: break-all; max-width: 200px; width: max-content; opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform: translateX(-50%) translateY(8px); z-index: 50; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05); pointer-events: none; margin-bottom: 8px; text-align: center; line-height: 1.3;">${fObj.file.name}</div>
                </div>
            `;
            
            chip.innerHTML = `<span style="display:flex;align-items:center;flex-shrink:0;">${icon}</span>${nameEl}${actionBtn}${crossBtn}`;
            
            if (fObj.status === 'failed') {
                chip.querySelector('span[title="Retry"]').onclick = () => doUpload(fObj.id);
            }
            if (fObj.status !== 'uploading') {
                const crossEl = chip.querySelector('.lc-chip-cross');
                crossEl.onclick = () => {
                    selectedFilesInfo = selectedFilesInfo.filter(x => x.id !== fObj.id);
                    renderFilePreview();
                };
                crossEl.onmouseover = () => crossEl.style.color = '#ef4444';
                crossEl.onmouseout = () => crossEl.style.color = '#94a3b8';
            }
            track.appendChild(chip);
        });
        
        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'overflow-x:auto; overflow-y:hidden; scroll-behavior:smooth; scrollbar-width:none; width:100%; padding-top: 40px; margin-top: -40px;';
        scrollContainer.appendChild(track);
        pArea.appendChild(scrollContainer);
        
        scrollContainer.addEventListener("wheel", function (e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
            }
        });

        const leftZone = document.createElement('div');
        leftZone.style.cssText = 'position:absolute; left:0; top:0; bottom:0; width:45px; display:flex; align-items:center; justify-content:flex-start; padding-left:6px; z-index:5; background:linear-gradient(to right, #f8fafc 40%, transparent); opacity:0; transition:opacity 0.2s; pointer-events:none;';
        
        const leftBtn = document.createElement('div');
        leftBtn.style.cssText = 'width:24px; height:24px; background:white; border:1px solid #e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); pointer-events:auto;';
        leftBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#334155"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>';
        leftZone.appendChild(leftBtn);
        
        const rightZone = document.createElement('div');
        rightZone.style.cssText = 'position:absolute; right:0; top:0; bottom:0; width:45px; display:flex; align-items:center; justify-content:flex-end; padding-right:6px; z-index:5; background:linear-gradient(to left, #f8fafc 40%, transparent); opacity:0; transition:opacity 0.2s; pointer-events:none;';
        
        const rightBtn = document.createElement('div');
        rightBtn.style.cssText = 'width:24px; height:24px; background:white; border:1px solid #e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); pointer-events:auto;';
        rightBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#334155"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
        rightZone.appendChild(rightBtn);

        pArea.appendChild(leftZone);
        pArea.appendChild(rightZone);

        let canScrollLeft = false;
        let canScrollRight = false;

        const checkScroll = () => {
            if (!scrollContainer.clientWidth) return;
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            canScrollLeft = scrollContainer.scrollLeft > 0;
            canScrollRight = scrollContainer.scrollLeft < maxScroll - 1; // 1px threshold for rounding errors
        };

        scrollContainer.addEventListener('scroll', checkScroll);
        
        leftBtn.onclick = () => scrollContainer.scrollBy({ left: -140, behavior: 'smooth' });
        rightBtn.onclick = () => scrollContainer.scrollBy({ left: 140, behavior: 'smooth' });

        pArea.addEventListener('mousemove', (e) => {
            checkScroll();
            const rect = pArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x < 60 && canScrollLeft) {
                leftZone.style.opacity = '1';
                rightZone.style.opacity = '0';
            } else if (x > rect.width - 60 && canScrollRight) {
                rightZone.style.opacity = '1';
                leftZone.style.opacity = '0';
            } else {
                leftZone.style.opacity = '0';
                rightZone.style.opacity = '0';
            }
        });
        
        pArea.addEventListener('mouseleave', () => {
            leftZone.style.opacity = '0';
            rightZone.style.opacity = '0';
        });

        // Initialize tracking
        setTimeout(checkScroll, 50);
        
        if (!document.getElementById('lc-spin-style')) {
            const style = document.createElement('style');
            style.id = 'lc-spin-style';
            style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    }

    document.getElementById('lc-file-input').addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        if (selectedFilesInfo.length + files.length > 5) {
            alert("Maximum 5 files allowed limit.");
        }
        
        const allowed = files.slice(0, 5 - selectedFilesInfo.length);
        allowed.forEach(f => {
            selectedFilesInfo.push({
                id: Math.random().toString(36).substr(2, 9),
                file: f,
                status: 'pending',
                msg: ''
            });
        });
        
        e.target.value = ''; // Reset input to allow adding the same file again
        renderFilePreview();
    });

    async function doUploadFile(fObj, tempId, fileUrl) {
        if (!chatId) return;
        
        const formData = new FormData();
        formData.append('data', JSON.stringify({ message: fObj.msg || '', current_page: window.location.href }));
        if (fObj.file) {
            formData.append('file', fObj.file);
        }
        
        try {
            const res = await fetch(`http://localhost:8080/api/v1/client/chatbot/chat/${chatId}/file`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            
            const tempEl = document.getElementById('msg-' + tempId);
            if (tempEl) tempEl.remove();
            
            setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
        } catch (err) {
            console.error("File upload error:", err);
            const tempEl = document.getElementById('msg-' + tempId);
            if (tempEl) {
                const timeEl = tempEl.querySelector('.lc-msg-time');
                if (timeEl) {
                    timeEl.innerHTML = '<span style="color:#ef4444;font-weight:bold;cursor:pointer;display:flex;align-items:center;gap:4px;" title="Retry"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg> Retry Failed Upload</span>';
                    timeEl.onclick = () => {
                        timeEl.innerHTML = `<span style="display:flex;align-items:center;gap:4px;color:#94a3b8;font-size:11px;">
                            <div class="lc-loader" style="width:10px;height:10px;border:2px solid #cbd5e1;border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
                            ${formatTime(new Date().toISOString())}
                        </span>`;
                        doUploadFile(fObj, tempId, fileUrl);
                    };
                }
            }
        }
    }

    async function sendMsg() {
        const inputEl = document.getElementById('lc-input');
        if (inputEl && inputEl.disabled) return;

        const txt = inputEl.value.trim();
        const pendingFiles = selectedFilesInfo.filter(x => x.status === 'pending' || x.status === 'failed');

        if (!txt && pendingFiles.length === 0) return;
        if (!ws) return;

        const currentPage = window.location.href;

        inputEl.value = '';
        inputEl.style.height = '40px';
        
        selectedFilesInfo = [];
        renderFilePreview();

        if (pendingFiles.length === 0) {
            ws.send(JSON.stringify({ message: txt, current_page: currentPage }));
        } else if (pendingFiles.length === 1) {
            pendingFiles[0].msg = txt;
            
            const fObj = pendingFiles[0];
            const fileUrl = URL.createObjectURL(fObj.file);
            const tempId = 'temp-' + fObj.id;
            
            addMsg({
                id: tempId,
                sender: 'visitor',
                senderName: 'You',
                text: fObj.msg || '',
                filePath: fileUrl,
                fileNameRaw: fObj.file.name,
                createdAt: new Date().toISOString(),
                isUploading: true
            });
            
            await doUploadFile(fObj, tempId, fileUrl);
        } else {
            // First display ALL buffering structures in DOM sequentially instantly
            const tasks = pendingFiles.map(fObj => {
                fObj.msg = '';
                const fileUrl = URL.createObjectURL(fObj.file);
                const tempId = 'temp-' + fObj.id;
                
                addMsg({
                    id: tempId,
                    sender: 'visitor',
                    senderName: 'You',
                    text: '',
                    filePath: fileUrl,
                    fileNameRaw: fObj.file.name,
                    createdAt: new Date().toISOString(),
                    isUploading: true
                });
                
                return { fObj, tempId, fileUrl };
            });
            
            let textTempId = null;
            if (txt) {
                textTempId = 'temp-txt-' + Date.now();
                addMsg({
                    id: textTempId,
                    sender: 'visitor',
                    senderName: 'You',
                    text: txt,
                    createdAt: new Date().toISOString(),
                    isUploading: true
                });
            }

            // Then execute the payloads over the network strictly consecutively
            for (const task of tasks) {
                await doUploadFile(task.fObj, task.tempId, task.fileUrl);
            }
            if (txt) {
                const tempEl = document.getElementById('msg-' + textTempId);
                if (tempEl) tempEl.remove(); // Safely remove dummy to be replaced natively by ws echo
                ws.send(JSON.stringify({ message: txt, current_page: currentPage }));
            }
        }
    }

    function formatTime(dateString) {
        const d = dateString ? new Date(dateString) : new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    function addMsg(m, isHistory = false, targetContainer = null) {
        const msgsContainer = targetContainer || document.getElementById('lc-messages');
        if (!msgsContainer) return;
        const existing = m.id ? document.getElementById(`msg-${m.id}`) : null;
        if (existing) return; // Prevent duplicates

        const msgTime = formatTime(m.createdAt);
        const currentName = m.sender === 'admin' ? (m.senderName || 'Agent') : 'You';

        let isGrouped = false;
        const msgNodes = msgsContainer ? msgsContainer.querySelectorAll('.lc-message:not(#sys-chat-status)') : [];
        const lastMsg = msgNodes.length > 0 ? msgNodes[msgNodes.length - 1] : null;

        if (lastMsg && lastMsg.classList.contains(m.sender)) {
            const lastName = lastMsg.getAttribute('data-sender-name');
            const lastT = lastMsg.getAttribute('data-msg-time');
            if (lastName === currentName && lastT === msgTime) {
                isGrouped = true;
                if (lastMsg.classList.contains('single')) {
                    lastMsg.classList.replace('single', 'group-first');
                } else if (lastMsg.classList.contains('group-last')) {
                    lastMsg.classList.replace('group-last', 'group-middle');
                }
            }
        }

        const d = document.createElement('div');
        const stateClass = isGrouped ? 'group-last' : 'single';
        const onlyFileClass = (!m.text && m.filePath) ? 'only-file' : '';
        const hasFileClass = m.filePath ? 'has-file' : '';
        d.className = `lc-message ${m.sender} ${stateClass} ${onlyFileClass} ${hasFileClass}`.trim();
        if (m.id) d.id = `msg-${m.id}`;
        d.setAttribute('data-sender-name', currentName);
        d.setAttribute('data-msg-time', msgTime);

        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

        let avatarSrc = defaultAvatar;
        if (m.profilePic && typeof m.profilePic === 'string') {
            avatarSrc = m.profilePic.replace(/['"]/g, '').trim();
            if (avatarSrc.includes('http')) {
                avatarSrc = avatarSrc.substring(avatarSrc.indexOf('http'));
            }
        }

        let fileHtml = '';
        if (m.filePath) {
            const isImg = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(m.filePath);
            const isAudio = /\.(mp3|wav|ogg|aac|m4a)(\?.*)?$/i.test(m.filePath);
            const isVideo = /\.(mp4|webm|avi|mov)(\?.*)?$/i.test(m.filePath);

            const fileName = m.fileNameRaw || (m.filePath ? m.filePath.split('/').pop().split('?')[0] : 'Document');
            if (isImg) {
                const imgWrapAttrs = m.isUploading ? '' : `onmouseenter="this.querySelector('.lc-img-overlay').style.opacity=1" onmouseleave="this.querySelector('.lc-img-overlay').style.opacity=0"`;
                const loaderOverlay = m.isUploading ? `<div style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.5); z-index: 5;"><div class="lc-loader" style="width:32px;height:32px;border:3px solid #3b82f6;border-top:3px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div>` : '';
                fileHtml = `
                    <div class="lc-media-wrapper" style="position: relative; overflow: hidden; max-width: 100%; display: flex;" ${imgWrapAttrs}>
                        ${loaderOverlay}
                        <img src="${m.filePath}" style="width: 100%; display: block; cursor: pointer;" onclick="if(this.requestFullscreen) this.requestFullscreen(); else if(this.webkitRequestFullscreen) this.webkitRequestFullscreen();" />
                        ${m.isUploading ? '' : `
                        <div class="lc-img-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.2s; pointer-events: none;">
                            <div style="position: absolute; bottom: 6px; right: 6px; pointer-events: auto;">
                                <div tabindex="0" style="color: white; background: rgba(0,0,0,0.5); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative;" onclick="var m=this.nextElementSibling; m.style.display = m.style.display==='block'?'none':'block';" onblur="setTimeout(()=>this.nextElementSibling.style.display='none', 200)">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                                </div>
                                <div style="display: none; position: absolute; bottom: 100%; right: 0; background: white; color: #0f172a; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 4px; margin-bottom: 4px; white-space: nowrap; z-index: 10;">
                                    <a href="${m.filePath}" download target="_blank" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Download
                                    </a>
                                </div>
                            </div>
                        </div>`}
                    </div>`;
            } else if (isAudio) {
                const isVisitor = m.sender === 'visitor';
                const iconBg = isVisitor ? 'rgba(255,255,255,0.2)' : '#eff6ff';
                const iconColor = isVisitor ? '#ffffff' : '#3b82f6';
                const trackBg = isVisitor ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)';
                const playPath = "M8 5v14l11-7z";
                const pausePath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
                const heights = [30, 50, 40, 70, 90, 60, 40, 30, 50, 80, 40, 60, 30, 80, 50, 60, 80, 90, 60, 40, 30, 50, 80, 40, 60, 30, 70, 40, 50, 30];
                const baseBars = heights.map(h => `<div style="flex: 1; background: ${trackBg}; height: ${h}%; border-radius: 2px;"></div>`).join('');
                const activeBars = heights.map(h => `<div style="flex: 1; background: ${iconColor}; height: ${h}%; border-radius: 2px;"></div>`).join('');

                fileHtml = `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 4px;">
                        <div onclick="var a=this.nextElementSibling; var p=this.querySelector('path'); if(a.paused){a.play(); p.setAttribute('d', '${pausePath}');}else{a.pause(); p.setAttribute('d', '${playPath}');}" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: ${iconBg}; color: ${iconColor}; flex-shrink: 0; transition: transform 0.1s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="${playPath}"/></svg>
                        </div>
                        <audio src="${m.filePath}" style="display: none;" ontimeupdate="var p=(this.currentTime/this.duration)*100||0; this.nextElementSibling.lastElementChild.style.width=Math.min(p,100)+'%';" onended="this.previousElementSibling.querySelector('path').setAttribute('d', '${playPath}'); this.nextElementSibling.lastElementChild.style.width='0%';"></audio>
                        <div style="width: 160px; height: 32px; position: relative; cursor: pointer;" onclick="var a=this.previousElementSibling; var r=this.getBoundingClientRect(); if(a.duration) a.currentTime=((event.clientX-r.left)/r.width)*a.duration;">
                            <div style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; gap: 2px; pointer-events: none;">
                                ${baseBars}
                            </div>
                            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 0%; overflow: hidden; pointer-events: none;">
                                <div style="width: 160px; height: 100%; display: flex; align-items: center; gap: 2px;">
                                    ${activeBars}
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (isVideo) {
                const vidWrapAttrs = m.isUploading ? '' : `onmouseenter="this.querySelector('.lc-vid-overlay').style.opacity=1" onmouseleave="this.querySelector('.lc-vid-overlay').style.opacity=0"`;
                const loaderOverlay = m.isUploading ? `<div style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.5); z-index: 5;"><div class="lc-loader" style="width:32px;height:32px;border:3px solid #3b82f6;border-top:3px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div>` : '';
                fileHtml = `
                    <div class="lc-media-wrapper" style="position: relative; overflow: hidden; max-width: 100%; display: flex;" ${vidWrapAttrs}>
                        ${loaderOverlay}
                        <video src="${m.filePath}" style="width: 100%; max-height: 250px; object-fit: cover; display: block; background: #000; cursor: pointer;" preload="metadata" onclick="this.paused ? this.play() : this.pause()" onplay="if(!${m.isUploading}) this.nextElementSibling.style.display='none'" onpause="if(!${m.isUploading}) this.nextElementSibling.style.display='flex'" onended="if(!${m.isUploading}) this.nextElementSibling.style.display='flex'" onloadedmetadata="let s=Math.floor(this.duration%60);let m=Math.floor(this.duration/60); this.parentElement.querySelector('.lc-vid-duration').innerText=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;"></video>
                        ${m.isUploading ? '' : `
                        <div onclick="this.previousElementSibling.play()" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style="margin-left: 3px;"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <div class="lc-vid-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.2s; pointer-events: none;">
                            <div title="Full Screen" onclick="var v=this.parentElement.parentElement.querySelector('video'); if(v.requestFullscreen) v.requestFullscreen(); else if(v.webkitRequestFullscreen) v.webkitRequestFullscreen();" style="position: absolute; top: 6px; right: 6px; color: white; background: rgba(0,0,0,0.5); border-radius: 6px; padding: 4px; pointer-events: auto; cursor: pointer; display: flex;">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                            </div>
                            <div class="lc-vid-duration" style="position: absolute; bottom: 8px; left: 8px; color: white; background: rgba(0,0,0,0.5); border-radius: 12px; padding: 2px 8px; font-size: 11px; font-weight: 500; pointer-events: none; letter-spacing: 0.5px;">--:--</div>
                            <div style="position: absolute; bottom: 6px; right: 6px; pointer-events: auto;">
                                <div tabindex="0" style="color: white; background: rgba(0,0,0,0.5); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative;" onclick="var m=this.nextElementSibling; m.style.display = m.style.display==='block'?'none':'block';" onblur="setTimeout(()=>this.nextElementSibling.style.display='none', 200)">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                                </div>
                                <div style="display: none; position: absolute; bottom: 100%; right: 0; background: white; color: #0f172a; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 4px; margin-bottom: 4px; white-space: nowrap; z-index: 10;">
                                    <a href="${m.filePath}" download target="_blank" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-size: 13px; border-radius: 4px; cursor: pointer;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Download
                                    </a>
                                </div>
                            </div>
                        </div>`}
                    </div>`;
            } else {
                const fileExt = fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : 'FILE';
                const isVisitor = m.sender === 'visitor';
                const iconBg = isVisitor ? 'rgba(255,255,255,0.2)' : '#eff6ff';
                const iconColor = isVisitor ? '#ffffff' : '#3b82f6';
                const borderColor = isVisitor ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';

                if (!window.lcDownloadFile) {
                    window.lcDownloadFile = async function(e, url, filename) {
                        e.stopPropagation();
                        e.preventDefault();
                        const btn = e.currentTarget;
                        if (btn.dataset.downloading === "true") return;
                        btn.dataset.downloading = "true";
                        
                        const originalContent = btn.innerHTML;
                        btn.innerHTML = `
                            <svg viewBox="0 0 36 36" width="24" height="24" style="transform: rotate(-90deg);">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="100, 100" stroke-opacity="0.2" />
                                <path class="lc-progress-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="0, 100" stroke-linecap="round" style="transition: stroke-dasharray 0.1s;" />
                            </svg>
                        `;

                        try {
                            const response = await fetch(url);
                            if (!response.ok) throw new Error('Network response was not ok');
                            
                            const contentLength = response.headers.get('content-length');
                            const total = contentLength ? parseInt(contentLength, 10) : 0;
                            let loaded = 0;
                            
                            const chunks = [];
                            if (total > 0 && response.body) {
                                const reader = response.body.getReader();
                                while (true) {
                                    const { done, value } = await reader.read();
                                    if (done) break;
                                    chunks.push(value);
                                    loaded += value.length;
                                    const progress = Math.min((loaded / total) * 100, 100);
                                    const circle = btn.querySelector('.lc-progress-circle');
                                    if (circle) circle.setAttribute('stroke-dasharray', progress + ', 100');
                                }
                            } else {
                                const blob = await response.blob();
                                chunks.push(blob);
                            }
                            
                            const blob = new Blob(chunks);
                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                        } catch (error) {
                            console.error('Download failed:', error);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            a.target = '_blank';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        } finally {
                            btn.innerHTML = originalContent;
                            btn.dataset.downloading = "false";
                        }
                    };
                }

                if (!window.lcViewFile) {
                    window.lcViewFile = async function(e, url, ext) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (ext === 'pdf') {
                            const newTab = window.open('', '_blank');
                            if (newTab) {
                                newTab.document.write('<div style="font-family: sans-serif; padding: 20px; color: #333;">Loading PDF preview...</div>');
                                try {
                                    const res = await fetch(url);
                                    if (!res.ok) throw new Error('Network response was not ok');
                                    const blob = await res.blob();
                                    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                                    const blobUrl = URL.createObjectURL(pdfBlob);
                                    newTab.location.href = blobUrl;
                                } catch (error) {
                                    console.error('PDF Preview failed:', error);
                                    newTab.location.href = url;
                                }
                            } else {
                                window.open(url, '_blank');
                            }
                        } else {
                            window.open(url, '_blank');
                        }
                    };
                }

                let viewUrl = m.filePath;
                const ext = fileExt.toLowerCase();
                if (['xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) {
                    viewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(m.filePath)}&wdOrigin=BROWSELINK`;
                }
                
                const actionHtml = m.isUploading 
                    ? `<div style="display:flex;align-items:center;justify-content:center;padding:6px;margin-right:2px;"><div class="lc-loader" style="width:16px;height:16px;border:2px solid ${iconColor};border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div>`
                    : `<div onclick="window.lcDownloadFile(event, '${m.filePath}', '${fileName}')" title="Download" style="color: ${iconColor}; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; opacity: 0.9; cursor: pointer; transition: transform 0.1s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                       </div>`;
                
                const hoverAttr = m.isUploading ? '' : `onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="window.lcViewFile(event, '${viewUrl}', '${ext}')"`;

                fileHtml = `
                    <div class="lc-media-wrapper" style="display: flex; align-items: center; background: transparent; padding: 8px; border: 1px solid ${borderColor}; gap: 12px; cursor: ${m.isUploading ? 'default' : 'pointer'}; transition: opacity 0.2s; text-decoration: none; color: inherit;" ${hoverAttr}>
                        <div style="background: ${iconBg}; width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${iconColor};">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        </div>
                        <div style="flex: 1; min-width: 0; text-align: left; position: relative;" onmouseenter="this.querySelector('.lc-file-tooltip').style.opacity=1;this.querySelector('.lc-file-tooltip').style.visibility='visible';this.querySelector('.lc-file-tooltip').style.transform='translateY(0)';" onmouseleave="this.querySelector('.lc-file-tooltip').style.opacity=0;this.querySelector('.lc-file-tooltip').style.visibility='hidden';this.querySelector('.lc-file-tooltip').style.transform='translateY(8px)';">
                            <div style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">${fileName}</div>
                            <div class="lc-file-tooltip" style="position: absolute; bottom: 100%; ${isVisitor ? 'right: -20px;' : 'left: -10px;'} background: #1e293b; color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 500; word-break: break-all; max-width: 220px; width: max-content; opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(8px); z-index: 50; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05); pointer-events: none; margin-bottom: 8px; text-align: left; line-height: 1.3;">${fileName}</div>
                            <div style="font-size: 11px; opacity: 0.8; margin-top: 4px; text-transform: uppercase;">${fileExt} Document</div>
                        </div>
                        ${actionHtml}
                    </div>`;
            }
        }
        
        const textPadding = m.filePath ? 'padding: 2px 6px 4px 6px; margin-top: 4px;' : '';
        const textHtml = m.text ? `<div style="${textPadding} white-space: pre-wrap;">${m.text}</div>` : '';

        let timeDisplay = msgTime;
        if (m.isUploading) {
            timeDisplay = `<span style="display:flex;align-items:center;gap:4px;color:#94a3b8;font-size:11px;">
                <div class="lc-loader" style="width:10px;height:10px;border:2px solid #cbd5e1;border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
                ${msgTime}
            </span>`;
        }

        d.innerHTML = `
            ${!isGrouped ? `<div class="lc-msg-meta">${currentName}</div>` : ''}
            <div class="lc-msg-row">
                ${m.sender === 'admin' ? `<img class="lc-avatar" src="${avatarSrc}" alt="Avatar" />` : ''}
                <div class="lc-msg-bubble">${fileHtml}${textHtml}</div>
                <div class="lc-msg-time">${timeDisplay}</div>
            </div>
        `;
        msgsContainer.appendChild(d);

        // Keep status log at the very bottom
        if (msgsContainer.id === 'lc-messages') {
            const statusLog = document.getElementById('sys-chat-status');
            if (statusLog) {
                if (m.sender === 'admin' && statusLog.innerText.includes("Waiting")) {
                    statusLog.remove();
                } else {
                    msgsContainer.appendChild(statusLog);
                }
            }
            if (!isHistory || (isHistory && chatPage === 1 && !targetContainer)) {
                msgsContainer.scrollTop = msgsContainer.scrollHeight;
            }
        }

        // Badge update
        const win = document.getElementById('lc-window');
        if (!isHistory && m.sender === 'admin' && win && !win.classList.contains('open')) {
            unreadCount++;
            d.classList.add('lc-unread-item');
            updateBadge();
        }
    }

    function addSysMsg(txt, id = null) {
        const msgsContainer = document.getElementById('lc-messages');
        if (id) {
            const existing = document.getElementById(id);
            if (existing) {
                existing.innerText = txt;
                msgsContainer.appendChild(existing); // Bring to front/bottom
                msgsContainer.scrollTop = msgsContainer.scrollHeight;
                return;
            }
        }
        const d = document.createElement('div');
        if (id) d.id = id;
        d.style.textAlign = 'center'; d.style.fontSize = '12px'; d.style.color = '#94a3b8'; d.innerText = txt;
        msgsContainer.appendChild(d);

        msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }

    function handleChatStatus(status) {
        if (!status) return;
        status = String(status).toLowerCase();

        const inputEl = document.getElementById('lc-input');
        const sendBtn = document.getElementById('lc-send-btn');
        const hasAdminMsg = document.querySelector('.lc-message.admin');

        let msg = "";
        if (status === 'created') {
            if (!hasAdminMsg) {
                msg = "Waiting for an agent to accept the chat...";
            }
            if (inputEl) inputEl.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
        } else if (status === 'open') {
            if (inputEl) inputEl.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
        } else if (status === 'closed' || status === 'close') {
            msg = "This chat has been closed.";
            if (inputEl) inputEl.disabled = true;
            if (sendBtn) sendBtn.disabled = true;
        }

        if (msg) {
            addSysMsg(msg, 'sys-chat-status');
        } else {
            const existingLog = document.getElementById('sys-chat-status');
            if (existingLog && existingLog.innerText.includes("Waiting")) {
                existingLog.remove();
            }
        }
    }

    // UI Toggles
    const win = document.getElementById('lc-window');
    const bub = document.getElementById('lc-bubble');
    const msgsContainer = document.getElementById('lc-messages');
    const scrollDownBtn = document.getElementById('lc-scroll-down');

    if (msgsContainer && scrollDownBtn) {
        msgsContainer.addEventListener('scroll', () => {
            const isNearBottom = msgsContainer.scrollHeight - msgsContainer.scrollTop - msgsContainer.clientHeight < 50;
            scrollDownBtn.style.display = isNearBottom ? 'none' : 'flex';

            if (msgsContainer.scrollTop === 0 && hasMoreChats && !isLoadingChats) {
                chatPage++;
                loadPreviousChats(chatId, chatPage);
            }
        });
        scrollDownBtn.addEventListener('click', () => {
            msgsContainer.scrollTo({ top: msgsContainer.scrollHeight, behavior: 'smooth' });
        });
    }

    bub.addEventListener('click', () => {
        win.classList.add('open');
        bub.style.display = 'none';

        const existingDivider = document.getElementById('lc-unread-divider');
        if (existingDivider) existingDivider.remove();

        if (unreadCount > 0) {
            const firstUnread = document.querySelector('.lc-unread-item');
            if (firstUnread) {
                const divider = document.createElement('div');
                divider.id = 'lc-unread-divider';
                divider.innerHTML = `<span>${unreadCount} UNREAD MESSAGE${unreadCount > 1 ? 'S' : ''}</span>`;
                divider.style.textAlign = 'center';
                divider.style.margin = '15px 0 5px 0';
                divider.style.fontSize = '11px';
                divider.style.color = '#3b82f6';
                divider.style.background = '#eff6ff';
                divider.style.padding = '4px 10px';
                divider.style.borderRadius = '10px';
                divider.style.fontWeight = '600';
                divider.style.alignSelf = 'center';
                divider.style.textTransform = 'uppercase';
                divider.style.letterSpacing = '0.5px';

                firstUnread.parentNode.insertBefore(divider, firstUnread);
            }
        }

        document.querySelectorAll('.lc-unread-item').forEach(el => el.classList.remove('lc-unread-item'));
        unreadCount = 0;
        updateBadge();

        if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
    });

    document.getElementById('lc-minimize').addEventListener('click', () => {
        win.classList.remove('open');
        bub.style.display = 'flex';
        const existingDivider = document.getElementById('lc-unread-divider');
        if (existingDivider) existingDivider.remove();
    });

    // End Chat
    document.getElementById('lc-end-chat').addEventListener('click', () => {
        if (confirm('End this chat?')) {
            if (chatId) {
                fetch(`http://localhost:8080/api/v1/client/chatbot/chat/${chatId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'closed' })
                }).catch(err => console.error('Error closing chat:', err));
            }
            sessionData.active = false;
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
            if (ws) {
                ws.onclose = null; // Prevent reconnect
                ws.close();
                ws = null;
            }
            localStorage.setItem('lc_data', JSON.stringify(sessionData));
            localStorage.removeItem('lc_chat_id');
            chatId = null;
            document.getElementById('lc-messages').innerHTML = '';
            setView('feedback');
        }
    });

    // Feedback
    let rating = 0;
    document.querySelectorAll('.lc-star').forEach(s => {
        s.addEventListener('click', () => {
            rating = s.dataset.v;
            document.querySelectorAll('.lc-star').forEach(st => st.classList.toggle('active', st.dataset.v <= rating));
        });
    });
    document.getElementById('lc-submit-feedback').addEventListener('click', () => {
        alert('Feedback Sent');
        localStorage.removeItem('lc_data');
        localStorage.removeItem('lc_chat_id');
        window.location.reload();
    });
    document.getElementById('lc-skip-feedback').addEventListener('click', () => {
        localStorage.removeItem('lc_data');
        localStorage.removeItem('lc_chat_id');
        window.location.reload();
    });
    document.getElementById('lc-email-transcript').addEventListener('click', () => {
        alert('Transcript request behavior to be implemented.');
    });

    function logVisitorInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        const browser = (() => {
            const ua = navigator.userAgent;
            if (ua.includes("Edg/")) return "Microsoft Edge";
            if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
            if (ua.includes("Brave")) return "Brave";
            if (ua.includes("Chrome") && !ua.includes("Edg/")) return "Chrome";
            if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
            if (ua.includes("Firefox")) return "Firefox";
            return "Unknown";
        })();

        const os = (() => {
            if (platform.includes("Win")) return "Windows";
            if (platform.includes("Mac")) return "MacOS";
            if (platform.includes("Linux")) return "Linux";
            if (/Android/.test(userAgent)) return "Android";
            if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
            return "Unknown";
        })();

        visitorInfo.browser = browser;
        visitorInfo.device = os;
        visitorInfo.current_page = window.location.href;

        fetch("https://get.geojs.io/v1/ip/geo.json")
            .then(res => res.json())
            .then(data => {
                if (data && data.ip) {
                    visitorInfo.ip_address = data.ip;
                    visitorInfo.country = data.country;
                }
            })
            .catch(err => console.log("IP lookup failed", err));
    }

    init();

})();