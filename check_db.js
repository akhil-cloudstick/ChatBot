const mongoose = require('mongoose');
const Session = require('./server/models/Session');

mongoose.connect('mongodb://localhost:27017/livechat_app')
    .then(async () => {
        console.log('Connected. Querying Sessions...');
        const sessions = await Session.find({});
        console.log(`Found ${sessions.length} sessions.`);
        sessions.forEach(s => {
            console.log(`- [${s.status}] ${s.visitorId} (${s.history.length} msgs)`);
            if (s.feedback) console.log(`  Feedback: ${s.feedback.rating} stars`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
