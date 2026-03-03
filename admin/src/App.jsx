import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SOCKET_URL = 'http://localhost:3001';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');

  // Data
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ name: 'Agent', avatar: '' });
  const [customers, setCustomers] = useState([]); // Fetched history

  // Inputs
  const [inputValue, setInputValue] = useState('');
  const [newSite, setNewSite] = useState('');
  const [newDept, setNewDept] = useState('');

  const messagesEndRef = useRef(null);
  const notificationAudio = useRef(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'));

  useEffect(() => {
    if (!isLoggedIn) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Initial Data
    fetch(`${SOCKET_URL}/api/departments`).then(r => r.json()).then(setDepartments);
    fetch(`${SOCKET_URL}/api/websites`).then(r => r.json()).then(setWebsites);

    newSocket.on('connect', () => {
      newSocket.emit('admin_login');
    });

    newSocket.on('admin_profile_init', setAdminProfile);
    newSocket.on('departments_updated', setDepartments);
    newSocket.on('websites_updated', setWebsites);

    newSocket.on('active_sessions', (list) => {
      const map = {};
      list.forEach(s => map[s.visitorId] = s);
      setSessions(map);
    });

    newSocket.on('chat_request', (data) => {
      setSessions(prev => ({ ...prev, [data.visitorId]: data }));
      notificationAudio.current.play().catch(e => { });
    });

    newSocket.on('chat_status_updated', (data) => {
      setSessions(prev => {
        if (!prev[data.id]) return prev;
        return { ...prev, [data.id]: { ...prev[data.id], status: data.status } };
      });
    });

    newSocket.on('receive_message', (data) => {
      setSessions(prev => {
        const s = prev[data.from];
        if (!s) return prev;
        return { ...prev, [data.from]: { ...s, history: [...s.history, data.message] } };
      });
      if (document.hidden || activeSessionId !== data.from) notificationAudio.current.play().catch(e => { });
    });

    // Remove ended/archived sessions from Inbox
    newSocket.on('visitor_left', (visitorId) => {
      setSessions(prev => {
        const next = { ...prev };
        delete next[visitorId];
        return next;
      });
      if (activeSessionId === visitorId) setActiveSessionId(null);
    });

    newSocket.on('visitor_page_update', (data) => {
      setSessions(prev => {
        if (!prev[data.id]) return prev;
        return { ...prev, [data.id]: { ...prev[data.id], currentPage: data.url } };
      });
    });

    return () => newSocket.close();
  }, [isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, activeTab]);

  useEffect(() => {
    if (activeTab === 'customers') {
      fetch(`${SOCKET_URL}/api/customers`).then(r => r.json()).then(setCustomers);
    }
  }, [activeTab]);


  // --- AUTH ---
  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${SOCKET_URL}/api/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password })
    }).then(r => r.json()).then(d => {
      if (d.success) setIsLoggedIn(true);
      else alert('Invalid');
    });
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSocket(null);
    setSessions({});
  };


  // --- ACTIONS ---
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId) return;
    socket.emit('admin_send_message', { recipientId: activeSessionId, message: inputValue });
    setSessions(prev => {
      const s = prev[activeSessionId];
      const newMsg = {
        sender: 'admin', text: inputValue, timestamp: new Date(),
        senderName: adminProfile.name, senderAvatar: adminProfile.avatar
      };
      return { ...prev, [activeSessionId]: { ...s, history: [...s.history, newMsg] } };
    });
    setInputValue('');
  };

  const acceptChat = (id) => socket.emit('admin_accept_chat', id);
  const endChat = () => { if (confirm('End Chat?')) socket.emit('admin_end_chat', activeSessionId); };
  const toTicket = () => {
    const s = activeSessionId && sessions[activeSessionId];
    if (s) fetch(`${SOCKET_URL}/api/tickets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId: activeSessionId, transcript: s.history }) }).then(r => r.json()).then(d => alert('Ticket: ' + d.ticketId));
  };

  // Settings
  const updateProfile = () => { socket.emit('admin_update_profile', adminProfile); alert('Saved'); };
  const uploadAvatar = (e) => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onloadend = () => setAdminProfile(p => ({ ...p, avatar: r.result })); r.readAsDataURL(f); }
  };

  const addDept = () => {
    if (newDept) fetch(`${SOCKET_URL}/api/departments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newDept }) }).then(r => r.json()).then(setDepartments);
    setNewDept('');
  };
  const deleteDept = (n) => fetch(`${SOCKET_URL}/api/departments/${n}`, { method: 'DELETE' }).then(r => r.json()).then(setDepartments);

  const addSite = () => {
    if (newSite) fetch(`${SOCKET_URL}/api/websites`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname: newSite }) }).then(r => r.json()).then(() => { setNewSite(''); alert('Added'); });
  };
  const deleteSite = (id) => {
    if (confirm('Delete website?')) fetch(`${SOCKET_URL}/api/websites/${id}`, { method: 'DELETE' }).then(r => r.json()).then(d => { if (d.success) alert('Deleted'); });
  };


  if (!isLoggedIn) {
    return (
      <div className="login-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <form onSubmit={handleLogin} style={{ padding: '40px', background: '#1e293b', borderRadius: '10px', width: '300px' }}>
          <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
          <input className="form-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '20px' }} />
          <button className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">Antigravity Chat</div>
        <div className="nav-tabs">
          <div className={`nav-tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>Inbox</div>
          <div className={`nav-tab ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>History</div>
          <div className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</div>
        </div>

        {activeTab === 'inbox' && (
          <div className="sidebar-content">
            <div className="visitor-list">
              {Object.values(sessions).sort((a, b) => (a.status === 'pending' ? -1 : 1)).map(s => (
                <div key={s.visitorId} className={`visitor-item ${activeSessionId === s.visitorId ? 'active' : ''}`} onClick={() => setActiveSessionId(s.visitorId)}>
                  <div className="visitor-name">
                    {s.userData.name}
                    {s.status === 'pending' && <span className="badge badge-new">NEW</span>}
                  </div>
                  <div className="visitor-meta">{s.userData.email} <br /> {s.userData.department}</div>
                  <div className="visitor-badges"><span className="badge badge-site">{s.websiteName || 'Unknown'}</span></div>
                </div>
              ))}
              {Object.keys(sessions).length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>No active chats</div>}
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #334155' }}>
          <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-area">
        {activeTab === 'inbox' && (
          activeSession ? (
            <>
              <div className="chat-header">
                <div className="chat-visitor-info">
                  <h2>{activeSession.userData.name}</h2>
                  <div className="chat-visitor-status">
                    <span className={`status-dot ${activeSession.status}`}></span>
                    {activeSession.status.toUpperCase()} • Viewing: {activeSession.currentPage}
                  </div>
                </div>
                <div className="chat-actions">
                  {activeSession.status === 'pending' && <button className="action-btn bg-success" onClick={() => acceptChat(activeSessionId)}>Accept</button>}
                  {activeSession.status === 'active' && <><button className="action-btn bg-warning" onClick={toTicket}>Ticket</button><button className="action-btn bg-danger" onClick={endChat}>End</button></>}
                </div>
              </div>
              <div className="messages-container">
                {activeSession.history.map((msg, i) => (
                  <div key={i} className={`message ${msg.sender}`}>
                    <div className="message-meta">{msg.senderName}</div>
                    <div className="message-bubble">{msg.text}</div>
                    <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {activeSession.status === 'active' ? (
                <div className="chat-input-area">
                  <form className="chat-form" onSubmit={sendMessage}>
                    <input className="chat-input" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Type a message..." />
                    <button className="send-btn">➤</button>
                  </form>
                </div>
              ) : <div style={{ padding: '20px', textAlign: 'center', color: '#475569' }}>Chat Ended</div>}
            </>
          ) : <div className="empty-state"><div className="empty-icon">💬</div><div>No active chat selected</div></div>
        )}

        {activeTab === 'customers' && (
          <div className="settings-container">
            <div className="section-title" style={{ marginBottom: '20px' }}>Customer History</div>
            {customers.map((c, i) => (
              <div key={i} className="session-card" style={{ border: '1px solid #334155', padding: '15px', marginBottom: '15px', background: '#1e293b', borderRadius: '8px' }}>
                <div className="website-header" style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{c.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{c.email}</div>
                    </div>
                  </div>
                  <span className="tag" style={{ background: '#334155' }}>{c.history.length} Chats</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {c.history.map((sess, idx) => (
                    <div key={idx} style={{ background: '#0f172a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                      {/* Session Header */}
                      <div style={{ padding: '12px 15px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                          <span style={{ color: '#64748b' }}>{new Date(sess.startTime).toLocaleDateString()}</span>
                          <span style={{ margin: '0 8px', color: '#334155' }}>|</span>
                          <span>{sess.websiteName}</span>
                          <span style={{ margin: '0 8px', color: '#334155' }}>|</span>
                          <span className={`status-dot ${sess.status === 'ended' ? 'offline' : 'online'}`}></span> {sess.status}
                        </div>
                        {sess.feedback && (
                          <div style={{ color: '#fbbf24', fontSize: '1rem' }}>
                            {'★'.repeat(sess.feedback.rating)}{'☆'.repeat(5 - sess.feedback.rating)}
                          </div>
                        )}
                      </div>

                      {/* Feedback Comment */}
                      {sess.feedback && sess.feedback.comment && (
                        <div style={{ padding: '10px 15px', borderBottom: '1px dashed #334155', color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.9rem' }}>
                          "{sess.feedback.comment}"
                        </div>
                      )}

                      {/* Transcript Preview & Expand */}
                      <details style={{ fontSize: '0.9rem' }}>
                        <summary style={{ padding: '10px 15px', cursor: 'pointer', color: '#3b82f6', userSelect: 'none' }}>
                          Show Transcript ({sess.history.length} messages)
                        </summary>
                        <div style={{ padding: '0 15px 15px 15px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                          {sess.history.map((m, mi) => (
                            <div key={mi} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <div style={{ minWidth: '60px', fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
                                {m.sender === 'visitor' ? 'Visitor' : 'Agent'}
                              </div>
                              <div style={{ background: m.sender === 'visitor' ? '#1e293b' : '#334155', padding: '6px 10px', borderRadius: '6px', color: '#e2e8f0', flex: 1 }}>
                                {m.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {customers.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No history found.</div>}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-container">
            {/* Settings Content Same as Before + Delete Button */}
            <div className="settings-section">
              <div className="section-title">My Profile</div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: adminProfile.avatar ? `url(${adminProfile.avatar}) center/cover` : '#3b82f6' }}></div>
                <div>
                  <input className="form-input" value={adminProfile.name} onChange={e => setAdminProfile(p => ({ ...p, name: e.target.value }))} />
                  <div style={{ marginTop: '10px' }}><label className="btn btn-primary">Upload <input type="file" onChange={uploadAvatar} style={{ display: 'none' }} /></label> <button className="btn btn-success" onClick={updateProfile}>Save</button></div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-title">Departments</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><input className="form-input" value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="Dept Name" /> <button className="btn btn-primary" onClick={addDept}>Add</button></div>
              {departments.map(d => <span key={d} className="tag">{d} <span className="tag-close" onClick={() => deleteDept(d)}>×</span></span>)}
            </div>

            <div className="settings-section">
              <div className="section-title">Websites</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><input className="form-input" value={newSite} onChange={e => setNewSite(e.target.value)} placeholder="Nickname" /> <button className="btn btn-primary" onClick={addSite}>Add</button></div>
              {websites.map(w => (
                <div key={w.id} className="website-card">
                  <div className="website-header">
                    <strong>{w.nickname}</strong>
                    <button onClick={() => deleteSite(w.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
                  </div>
                  <div className="code-block">{`<script>window.LC_WEBSITE_ID="${w.id}";</script><script src="http://localhost:3001/widget.js"></script>`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
