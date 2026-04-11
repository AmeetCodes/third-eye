const axios = require('axios');
const Tender = require('../models/Tender');
const config = require('../config/config');

function calculateTransparencyScore(tender) {
    let score = 100;
    const title = (tender.title || '').toLowerCase();

    if (tender.remaining_days < 7) score -= 20;
    if (tender.remaining_days < 3) score -= 30;

    if (title.includes('emergency') || title.includes('urgent') || title.includes('direct')) {
        score -= 15;
    }

    // 3. Restricted Bidding Penalty
    if (tender.private) score -= 25;

    // 4. Category Check
    if (tender.notice_category === 'Auction') score -= 10;

    return Math.max(0, score);
}

async function sync() {
    console.log('--- [Bolpatra Integration] Starting Multi-Page Sync ---');
    const { baseUrl, batchSize } = config.integrations.bolpatra;
    
    try {
        const pagesToFetch = [1, 2, 3, 4]; 
        let totalProcessed = 0;

        for (const page of pagesToFetch) {
            console.log(`[Bolpatra] Syncing batch ${page}...`);
            const skip = (page - 1) * batchSize;
            const response = await axios.get(`${baseUrl}?limit=${batchSize}&skip=${skip}`);
            const tenders = response.data?.data?.results?.map(g => g.data).flat() || [];

            if (tenders.length === 0) break;

            for (const tender of tenders) {
                const score = calculateTransparencyScore(tender);

                await Tender.findOneAndUpdate(
                    { bolpatraId: tender.id },
                    {
                        bolpatraId: tender.id,
                        title: tender.title,
                        district: tender.district,
                        public_entity_name: tender.public_entity_name,
                        submission_date: tender.submission_date,
                        notice_category: tender.notice_category,
                        image: tender.image,
                        remaining_days: tender.remaining_days,
                        private: tender.private,
                        transparencyScore: score,
                        rawPayload: tender,
                        lastSynced: new Date(),
                    },
                    { upsert: true, returnDocument: 'after' }
                );
            }
            totalProcessed += tenders.length;
        }

        console.log(`--- [Bolpatra Integration] Sync Complete. Items: ${totalProcessed} ---`);
        return { success: true, count: totalProcessed };
    } catch (error) {
        console.error(`[Bolpatra Integration Error]: ${error.message}`);
        return { success: false, error: error.message };
    }
}

module.exports = { sync };
