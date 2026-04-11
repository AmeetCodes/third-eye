require('dotenv').config();

const config = {
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT || 5000,
    gemini_api_key: process.env.GEMINI_API_KEY,
    
    // Centralized API Registry
    integrations: {
        bolpatra: {
            enabled: true,
            baseUrl: process.env.BOLPATRA_API_BASE_URL || 'https://admin.bolpatranepal.com/api/v1/tender_notice',
            syncInterval: '0 * * * *', // Hourly
            batchSize: 100
        },
        // EXAMPLE: Add more here easily in the future
        // otherSource: {
        //   enabled: false,
        //   baseUrl: 'https://api.example.com',
        //   syncInterval: '*/30 * * * *'
        // }
    }
};

module.exports = config;
