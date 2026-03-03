const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // 'visitor', 'admin', 'system'
    senderName: String,
    senderAvatar: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
    visitorId: { type: String, required: true },
    websiteId: { type: String, required: true },
    userData: {
        name: String,
        email: String,
        department: String,
        description: String
    },
    status: { type: String, default: 'pending' }, // 'pending', 'active', 'ended'
    history: [MessageSchema],
    feedback: {
        rating: Number,
        comment: String
    },
    currentPage: String,
    startTime: { type: Date, default: Date.now },
    endTime: Date
});

module.exports = mongoose.model('Session', SessionSchema);
