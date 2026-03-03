const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const mongoose = require('mongoose');
const Session = require('./models/Session');
const Website = require('./models/Website');
const Department = require('./models/Department');

const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/livechat_app')
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.error('MongoDB Connection Error:', err));
async function connectDB() {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected built-in memory server at ${mongoUri}`);
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
}
connectDB();

// In-memory Store (Socket Mappings only now)
// Active sessions can be queried from DB, but we keep a cache for socket performance if needed.
// For now, let's try to rely on DB for state to ensure persistence.
let socketToVisitor = {}; // Map socketId -> visitorId
let adminProfile = { name: "Support Agent", avatar: "" };

// Seed Defaults if empty
async function seedDefaults() {
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
        await Department.insertMany([{ name: 'Sales' }, { name: 'Support' }, { name: 'Billing' }]);
        console.log('Seeded Departments');
    }
    const siteCount = await Website.countDocuments();
    if (siteCount === 0) {
        await Website.create({ id: 'default', nickname: 'Main Site' });
        console.log('Seeded Default Website');
    }
}
seedDefaults();

// --- HELPERS ---
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// --- REST API ---

// Auth
app.post('/api/login', (req, res) => {
    // Mock login - any password works for demo, or "admin"
    const { password } = req.body;
    if (password) return res.json({ token: 'mock-token-123', success: true });
    res.status(401).json({ success: false });
});

// Departments
app.get('/api/departments', async (req, res) => {
    const depts = await Department.find();
    res.json(depts.map(d => d.name));
});

app.post('/api/departments', async (req, res) => {
    const { name } = req.body;
    if (name) {
        try {
            await Department.create({ name });
            const depts = await Department.find();
            io.emit('departments_updated', depts.map(d => d.name));
        } catch (e) { console.error(e); }
    }
    const all = await Department.find();
    res.json(all.map(d => d.name));
});

app.delete('/api/departments/:name', async (req, res) => {
    await Department.deleteMany({ name: req.params.name });
    const depts = await Department.find();
    io.emit('departments_updated', depts.map(d => d.name));
    res.json(depts);
});

// Websites
app.get('/api/websites', async (req, res) => {
    const sites = await Website.find();
    res.json(sites);
});

app.post('/api/websites', async (req, res) => {
    const { nickname } = req.body;
    const newSite = await Website.create({ id: generateId(), nickname });
    const sites = await Website.find();
    io.emit('websites_updated', sites);
    res.json(newSite);
});

app.delete('/api/websites/:id', async (req, res) => {
    await Website.deleteOne({ id: req.params.id });
    const sites = await Website.find();
    io.emit('websites_updated', sites);
    res.json({ success: true });
});

// Customers / History
app.get('/api/customers', async (req, res) => {
    try {
        const endedSessions = await Session.find({ status: 'ended' }).sort({ startTime: -1 });
        const grouped = {};
        endedSessions.forEach(s => {
            const email = s.userData.email;
            if (!grouped[email]) grouped[email] = { email, name: s.userData.name, history: [] };
            grouped[email].history.push(s);
        });
        res.json(Object.values(grouped));
    } catch (e) { res.status(500).json([]); }
});

// Ticket (Mock)
app.post('/api/tickets', (req, res) => {
    const { visitorId, transcript } = req.body;
    console.log(`TICKET CREATED [Visitor: ${visitorId}]`);
    res.json({ success: true, ticketId: 'TKT-' + Math.floor(Math.random() * 10000) });
});

// Feedback & End
app.post('/api/feedback', async (req, res) => {
    const { visitorId, rating, comment } = req.body;
    console.log(`FEEDBACK [Visitor: ${visitorId}]: ${rating} stars - ${comment}`);

    try {
        const session = await Session.findOne({ visitorId });
        if (session) {
            session.feedback = { rating, comment };
            session.history.push({
                sender: 'system',
                text: `User rated chat ${rating}/5: "${comment || ''}"`,
                timestamp: new Date()
            });
            session.status = 'ended';
            await session.save();

            io.emit('visitor_left', visitorId);
        }
    } catch (e) { console.error(e); }
    res.json({ success: true });
});

// Transcript Email
app.post('/api/transcript', (req, res) => {
    const { email, transcript } = req.body;
    console.log(`EMAILING TRANSCRIPT TO ${email}`);
    // Mock send
    res.json({ success: true });
});


// --- SOCKET.IO ---
io.on('connection', (socket) => {
    const socketId = socket.id;

    // --- VISITOR EVENTS ---
    socket.on('join_chat', async (data) => {
        const { userData, visitorId, websiteId, currentPage } = data;

        socketToVisitor[socket.id] = visitorId;
        socket.join(visitorId);

        try {
            // Find ACTIVE session only
            let session = await Session.findOne({ visitorId, status: { $ne: 'ended' } });

            if (session) {
                // Recover Active
                if (currentPage) {
                    session.currentPage = currentPage;
                    io.emit('visitor_page_update', { id: visitorId, url: currentPage });
                }
                // session.status is already not 'ended'
                await session.save();

                io.emit('chat_status_updated', { id: visitorId, status: session.status });
                socket.emit('session_recovered', session);
            } else {
                // New Session (Since no active one exists)
                session = new Session({
                    visitorId,
                    websiteId,
                    userData,
                    status: 'pending',
                    history: [],
                    currentPage: currentPage || '',
                    startTime: new Date()
                });

                // Add Description
                if (userData && userData.description) {
                    session.history.push({
                        sender: 'visitor',
                        text: userData.description,
                        timestamp: new Date()
                    });
                }

                await session.save();

                io.emit('chat_request', session);
                socket.emit('session_recovered', session);
            }
        } catch (e) { console.error('Join Error', e); }
    });

    socket.on('send_message', async (data) => {
        const visitorId = socketToVisitor[socket.id] || socketToVisitor[socketId];
        if (!visitorId) return;

        const messageData = {
            sender: 'visitor',
            text: data.message,
            timestamp: new Date()
        };

        try {
            // Target ACTIVE session
            const session = await Session.findOne({ visitorId, status: { $ne: 'ended' } });
            if (session) {
                session.history.push(messageData);
                await session.save();
                io.emit('receive_message', { from: visitorId, message: messageData });
            }
        } catch (e) { console.error(e); }
    });

    socket.on('page_view', async (url) => {
        const visitorId = socketToVisitor[socket.id] || socketToVisitor[socketId];
        console.log(`Page View [${visitorId}]: ${url}`);
        if (visitorId) {
            // Update only ACTIVE session
            await Session.updateOne({ visitorId, status: { $ne: 'ended' } }, { currentPage: url });
            io.emit('visitor_page_update', { id: visitorId, url });
        }
    });

    // --- ADMIN EVENTS ---
    socket.on('admin_login', async () => {
        try {
            const activeSessions = await Session.find({ status: { $ne: 'ended' } });
            socket.emit('active_sessions', activeSessions);
        } catch (e) { console.error(e); }
        socket.emit('admin_profile_init', adminProfile);
    });

    socket.on('admin_update_profile', (profile) => {
        adminProfile = profile;
    });

    socket.on('admin_accept_chat', async (visitorId) => {
        try {
            const session = await Session.findOne({ visitorId, status: 'pending' }); // Admin accepts Pending
            if (session) {
                session.status = 'active';
                await session.save();
                io.emit('chat_status_updated', { id: visitorId, status: 'active' });
                io.to(visitorId).emit('chat_accepted', { agentName: adminProfile.name, agentAvatar: adminProfile.avatar });
            }
        } catch (e) { console.error(e); }
    });

    socket.on('admin_send_message', async (data) => {
        const visitorId = data.recipientId;
        const msg = {
            sender: 'admin',
            senderName: adminProfile.name,
            senderAvatar: adminProfile.avatar,
            text: data.message,
            timestamp: new Date()
        };
        try {
            const session = await Session.findOne({ visitorId, status: { $ne: 'ended' } });
            if (session) {
                session.history.push(msg);
                await session.save();
                io.to(visitorId).emit('receive_message', msg);
            }
        } catch (e) { console.error(e); }
    });

    socket.on('admin_end_chat', async (visitorId) => {
        try {
            // Mark ended in DB - ONLY active one
            await Session.updateOne({ visitorId, status: { $ne: 'ended' } }, { status: 'ended' });
            io.emit('chat_status_updated', { id: visitorId, status: 'ended' });
            io.to(visitorId).emit('chat_ended');
        } catch (e) { console.error(e); }
    });

    socket.on('visitor_end_chat', async (visitorId) => {
        try {
            await Session.updateOne({ visitorId, status: { $ne: 'ended' } }, { status: 'ended' });
            io.emit('chat_status_updated', { id: visitorId, status: 'ended' });
        } catch (e) { console.error(e); }
    });

    socket.on('disconnect', () => {
        delete socketToVisitor[socketId];
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

