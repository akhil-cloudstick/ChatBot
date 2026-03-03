const mongoose = require('mongoose');
const Session = require('./models/Session');

mongoose.connect('mongodb://localhost:27017/livechat_app')
    .then(async () => {
        console.log('Connected. Dropping index...');
        try {
            await Session.collection.dropIndex('visitorId_1');
            console.log('Index visitorId_1 dropped.');
        } catch (e) {
            console.log('Index might not exist or name differs:', e.message);
        }
        process.exit();
    })
    .catch(console.error);
