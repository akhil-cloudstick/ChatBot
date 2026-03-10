(function () {
    const SERVER_URL = 'http://localhost:3001';
    const WEBSITE_ID = window.LC_WEBSITE_ID || 'default';
    let audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .lc-widget-bubble { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5); cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; transition: all 0.3s; }
    .lc-widget-bubble:hover { transform: scale(1.1) translateY(-5px); }
    .lc-widget-bubble svg { width: 28px; height: 28px; fill: white; }
    
    .lc-widget-window { position: fixed; bottom: 100px; right: 20px; width: 380px; height: 600px; background: #fff; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); z-index: 9999; display: none; flex-direction: column; overflow: hidden; font-family: 'Inter', sans-serif; border: 1px solid rgba(0,0,0,0.05); }
    .lc-widget-window.open { display: flex; }
    
    .lc-header { background: linear-gradient(90deg, #3b82f6, #8b5cf6); padding: 15px 20px; color: white; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
    .lc-header-controls { display: flex; gap: 15px; align-items: center; }
    .lc-icon-btn { cursor: pointer; opacity: 0.8; font-size: 18px; line-height: 1; background: none; border: none; color: white; padding: 0; }
    .lc-icon-btn:hover { opacity: 1; }
    
    .lc-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f8fafc; position: relative; }
    
    .lc-form-view { padding: 30px; display: flex; flex-direction: column; gap: 15px; height: 100%; box-sizing: border-box; justify-content: center; }
    .lc-form-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 10px; }
    .lc-field { display: flex; flex-direction: column; gap: 6px; }
    .lc-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
    .lc-input-field { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-family: inherit; font-size: 0.9rem; }
    .lc-input-field:focus { border-color: #3b82f6; }
    .lc-submit-btn { margin-top: 10px; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
    .lc-submit-btn:hover { background: #2563eb; }

    .lc-waiting-view, .lc-feedback-view { display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; text-align: center; color: #64748b; }
    .lc-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .lc-chat-view { display: none; flex-direction: column; height: 100%; }
    .lc-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .lc-message { max-width: 80%; display: flex; flex-direction: column; gap: 2px; }
    .lc-message.visitor { align-self: flex-end; align-items: flex-end; }
    .lc-message.admin { align-self: flex-start; align-items: flex-start; }
    .lc-msg-bubble { padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .lc-message.visitor .lc-msg-bubble { background: #3b82f6; color: white; border-bottom-right-radius: 2px; }
    .lc-message.admin .lc-msg-bubble { background: white; color: #1e293b; border-bottom-left-radius: 2px; }
    .lc-msg-meta { font-size: 11px; color: #94a3b8; display: flex; gap: 5px; margin-bottom: 2px; }
    
    .lc-input-area { padding: 15px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; }
    .lc-input { flex: 1; border: 1px solid #cbd5e1; border-radius: 20px; padding: 10px 15px; outline: none; font-size: 14px; }
    .lc-send { background: #3b82f6; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .lc-stars { display: flex; gap: 10px; font-size: 30px; color: #cbd5e1; cursor: pointer; margin: 20px 0; }
    .lc-star.active { color: #f59e0b; }
    `;
    document.head.appendChild(style);

    // Initial HTML
    const root = document.createElement('div');
    root.id = 'lc-root';
    root.innerHTML = `
    <div class="lc-widget-bubble" id="lc-bubble">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
    </div>
    <div class="lc-widget-window" id="lc-window">
        <div class="lc-header">
            <span id="lc-header-title">Support</span>
            <div class="lc-header-controls">
                <button class="lc-icon-btn" id="lc-end-chat" style="display:none;" title="End Chat">⛔</button>
                <button class="lc-icon-btn" id="lc-minimize">_</button>
            </div>
        </div>
        <div class="lc-content">
            <div class="lc-form-view" id="lc-view-form">
                <div class="lc-form-title">Start Chat</div>
                <div class="lc-field"><label class="lc-label">Name</label><input class="lc-input-field" id="lc-name" placeholder="Name"></div>
                <div class="lc-field"><label class="lc-label">Email</label><input class="lc-input-field" id="lc-email" placeholder="Email"></div>
                <div class="lc-field"><label class="lc-label">Department</label><select class="lc-input-field" id="lc-dept"><option value="">Select Department</option></select></div>
                <div class="lc-field"><label class="lc-label">Description</label><textarea class="lc-input-field" id="lc-desc" rows="3" placeholder="How can we help?"></textarea></div>
                <button class="lc-submit-btn" id="lc-start-btn">Start Chat</button>
            </div>
            
            <div class="lc-waiting-view" id="lc-view-waiting">
                <div class="lc-spinner"></div>
                <p>Connecting to agent...</p>
            </div>

            <div class="lc-chat-view" id="lc-view-chat">
                <div class="lc-messages" id="lc-messages"></div>
                <div class="lc-input-area">
                    <input class="lc-input" id="lc-input" placeholder="Type message...">
                    <button class="lc-send" id="lc-send-btn">➤</button>
                </div>
            </div>

            <div class="lc-feedback-view" id="lc-view-feedback">
                <h3>Chat Ended</h3>
                <div class="lc-stars">
                    <span class="lc-star" data-v="1">★</span><span class="lc-star" data-v="2">★</span><span class="lc-star" data-v="3">★</span><span class="lc-star" data-v="4">★</span><span class="lc-star" data-v="5">★</span>
                </div>
                <textarea class="lc-input-field" id="lc-feedback-comment" placeholder="Comments..." style="width:100%; box-sizing:border-box;"></textarea>
                <button class="lc-submit-btn" id="lc-submit-feedback">Submit Feedback</button>
                <button class="lc-submit-btn" id="lc-email-transcript" style="background:#64748b; margin-top:10px;">Email Transcript</button>
            </div>
        </div>
    </div>`;
    document.body.appendChild(root);

    // State
    let socket;
    let visitorId = localStorage.getItem('lc_vid') || generateId();
    localStorage.setItem('lc_vid', visitorId);
    let sessionData = JSON.parse(localStorage.getItem('lc_data') || '{}');

    function generateId() { return Math.random().toString(36).substr(2, 9); }

    function init() {
        const script = document.createElement('script');
        script.src = `${SERVER_URL}/socket.io/socket.io.js`;
        script.onload = () => {
            socket = io(SERVER_URL);
            setupSocket();
            loadDepts();
        };
        document.head.appendChild(script);
    }

    function loadDepts() {
        fetch(`${SERVER_URL}/api/departments`).then(r => r.json()).then(ds => {
            const sel = document.getElementById('lc-dept');
            ds.forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; sel.appendChild(o); });
        });
    }

    function setView(v) {
        ['form', 'waiting', 'chat', 'feedback'].forEach(id => document.getElementById(`lc-view-${id}`).style.display = 'none');
        document.getElementById(`lc-view-${v}`).style.display = 'flex';
        // Show/Hide End Chat button
        document.getElementById('lc-end-chat').style.display = (v === 'chat' || v === 'waiting') ? 'block' : 'none';
    }

    function setupSocket() {
        socket.on('connect', () => {
            // Try recover
            if (sessionData.active) {
                socket.emit('join_chat', {
                    visitorId,
                    websiteId: WEBSITE_ID,
                    userData: sessionData.userData,
                    currentPage: location.href
                });
            }
            // Initial Page View
            socket.emit('page_view', location.href);
        });

        socket.on('session_recovered', (data) => {
            // Render History
            const msgs = document.getElementById('lc-messages');
            msgs.innerHTML = '';
            data.history.forEach(m => addMsg(m));

            if (data.status === 'ended') {
                sessionData.active = false;
                saveSession();
                setView('feedback');
            } else {
                sessionData.active = true;
                saveSession();
                setView(data.status === 'active' ? 'chat' : 'waiting');
                if (data.status === 'active') document.getElementById('lc-header-title').textContent = 'Chat with Agent';
            }
        });

        socket.on('chat_accepted', (data) => {
            setView('chat');
            document.getElementById('lc-header-title').textContent = data.agentName;
            addSysMsg(`${data.agentName} joined.`);
        });

        socket.on('receive_message', (msg) => {
            addMsg(msg);
            audio.play().catch(e => { });
        });

        socket.on('chat_ended', () => {
            sessionData.active = false;
            saveSession();
            setView('feedback');
        });
    }

    // Actions
    document.getElementById('lc-start-btn').addEventListener('click', () => {
        const name = document.getElementById('lc-name').value;
        const email = document.getElementById('lc-email').value;
        const dept = document.getElementById('lc-dept').value;
        const desc = document.getElementById('lc-desc').value;

        if (!name || !email) return alert('Name and Email required');

        const userData = { name, email, department: dept, description: desc };
        sessionData = { userData, active: true };
        saveSession();

        socket.emit('join_chat', {
            visitorId,
            websiteId: WEBSITE_ID,
            userData,
            currentPage: location.href
        });
        setView('waiting');
    });

    document.getElementById('lc-send-btn').addEventListener('click', sendMsg);
    document.getElementById('lc-input').addEventListener('keypress', e => e.key === 'Enter' && sendMsg());

    function sendMsg() {
        const txt = document.getElementById('lc-input').value.trim();
        if (!txt) return;
        socket.emit('send_message', { message: txt });
        // addMsg({ text: txt, sender: 'visitor' }); // Optimistic? Server echoes back usually? Check server code.
        // Server code: io.emit('receive_message', ...) -> This goes to EVERYONE including sender? 
        // Logic: socket.join(visitorId). io.emit('receive_message') sends to all clients? NO.
        // Server: io.emit relays to Admins. Does it relay to the room?
        // Wait, socket.on('send_message') -> io.emit('receive_message'). 'io.emit' broadcasts to ALL connected clients.
        // So the user WILL receive their own message back.
        document.getElementById('lc-input').value = '';
    }

    function addMsg(m) {
        // m: { sender: 'visitor'|'admin', text: '', senderName, ... }
        const d = document.createElement('div');
        d.className = `lc-message ${m.sender}`;
        d.innerHTML = `<div class="lc-msg-meta">${m.sender === 'admin' ? m.senderName || 'Agent' : 'You'}</div><div class="lc-msg-bubble">${m.text}</div>`;
        document.getElementById('lc-messages').appendChild(d);
        document.getElementById('lc-messages').scrollTop = 10000;
    }

    function addSysMsg(txt) {
        const d = document.createElement('div');
        d.style.textAlign = 'center'; d.style.fontSize = '12px'; d.style.color = '#94a3b8'; d.innerText = txt;
        document.getElementById('lc-messages').appendChild(d);
    }

    function saveSession() {
        localStorage.setItem('lc_data', JSON.stringify(sessionData));
    }

    // UI Toggles
    const win = document.getElementById('lc-window');
    const bub = document.getElementById('lc-bubble');
    bub.addEventListener('click', () => { win.classList.add('open'); bub.style.display = 'none'; });
    document.getElementById('lc-minimize').addEventListener('click', () => { win.classList.remove('open'); bub.style.display = 'flex'; });

    // End Chat
    document.getElementById('lc-end-chat').addEventListener('click', () => {
        if (confirm('End this chat?')) {
            socket.emit('visitor_end_chat', visitorId); // Need to implement on server
            // For now locally end it
            sessionData.active = false;
            saveSession();
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
        const comment = document.getElementById('lc-feedback-comment').value;
        fetch(`${SERVER_URL}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId, rating, comment }) })
            .then(() => { alert('Feedback Sent'); setView('form'); });
    });
    document.getElementById('lc-email-transcript').addEventListener('click', () => {
        const em = prompt('Email:', sessionData.userData?.email);
        if (em) fetch(`${SERVER_URL}/api/transcript`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em }) }).then(() => alert('Sent'));
    });

    logVisitorInfo();

    init();

})();


function logVisitorInfo() {
    // Browser & OS detection
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

const browser = (() => {
    const ua = navigator.userAgent;

    if (ua.includes("Edg/")) return "Microsoft Edge";   // MUST be first
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

    const currentPage = window.location.href;

    // Fetch IP + Country
    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            console.log("Visitor Info:", {
                ip: data.ip,
                country: data.country_name,
                browser,
                os,
                currentPage
            });
        })
        .catch(err => {
            console.log("Visitor Info (partial):", {
                browser,
                os,
                currentPage,
                error: "IP lookup failed"
            });
        });
}