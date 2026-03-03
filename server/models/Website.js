const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Custom ID or use _id
    nickname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Website', WebsiteSchema);
