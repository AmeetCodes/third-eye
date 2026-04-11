const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const config = require('./config/config');
const syncManager = require('./services/syncManager');
const tenderRoutes = require('./routes/tenderRoutes');

// Windows Srv Fix for MongoDB Atlas
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors());
app.use(express.json());

// Static files serving (e.g. uploaded evidence images)
app.use(express.static('public'));

// Routes
app.use('/api/tenders', tenderRoutes);
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/nearby', require('./routes/nearbyRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health/Debug Route
app.get('/debug-db', async (req, res) => {
    try {
        const count = await mongoose.connection.db.collection('tenders').countDocuments();
        res.json({ 
            status: 'connected', 
            itemCount: count, 
            database: mongoose.connection.name,
            lastChecked: new Date()
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Database Connection & Server Start
const startServer = () => {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port}`);
        console.log(`🔗 API Endpoint: http://localhost:${config.port}/api/tenders`);
        if (global.USE_MOCK_DATA) {
            console.warn('⚠️  WARINING: Running in MOCK DATA MODE (Database disconnected)');
        }
    });
};

mongoose.connect(config.mongodb_uri)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        global.USE_MOCK_DATA = false;
        syncManager.runAll();
        syncManager.startSchedules();
        startServer();
    })
    .catch(err => {
        console.error('❌ Connection error:', err.message);
        console.warn('🔄 Switching to SURVIVAL MODE: Starting server with Mock Data fallback.');
        global.USE_MOCK_DATA = true;
        startServer();
    });
