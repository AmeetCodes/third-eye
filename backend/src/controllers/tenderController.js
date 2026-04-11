const Tender = require('../models/Tender');

const MOCK_TENDERS = [
    { bolpatraId: "MOCK-KTM-01", title: "Valley Road Expansion", district: "Kathmandu", public_entity_name: "Road Dept", submission_date: new Date(Date.now() + 86400000 * 25).toISOString(), notice_category: "Construction", remaining_days: 25, transparencyScore: 92, lastSynced: new Date() },
    { bolpatraId: "MOCK-KTM-02", title: "Smart Traffic Lights", district: "Kathmandu", public_entity_name: "KMC", submission_date: new Date(Date.now() + 86400000 * 6).toISOString(), notice_category: "Electronics", remaining_days: 6, transparencyScore: 35, lastSynced: new Date() },
    { bolpatraId: "MOCK-PKR-01", title: "Phewa Lake Wastewater", district: "Pokhara", public_entity_name: "Pokhara Metro", submission_date: new Date(Date.now() + 86400000 * 65).toISOString(), notice_category: "Environment", remaining_days: 65, transparencyScore: 88, lastSynced: new Date() },
    { bolpatraId: "MOCK-BRT-01", title: "NEA Power Grid", district: "Biratnagar", public_entity_name: "NEA", submission_date: new Date(Date.now() + 86400000 * 25).toISOString(), notice_category: "Infrastructure", remaining_days: 25, transparencyScore: 78, lastSynced: new Date() },
    { bolpatraId: "MOCK-JKP-01", title: "Heritage Restoration", district: "Janakpur", public_entity_name: "Heritage Board", submission_date: new Date(Date.now() + 86400000 * 70).toISOString(), notice_category: "Construction", remaining_days: 70, transparencyScore: 96, lastSynced: new Date() },
    { bolpatraId: "MOCK-BP-01", title: "Bridge Embankment", district: "Bharatpur", public_entity_name: "Water Board", submission_date: new Date(Date.now() + 86400000 * 20).toISOString(), notice_category: "Construction", remaining_days: 20, transparencyScore: 65, lastSynced: new Date() },
    { bolpatraId: "MOCK-BRJ-01", title: "Customs Security Upgrade", district: "Birgunj", public_entity_name: "Customs", submission_date: new Date(Date.now() + 86400000 * 35).toISOString(), notice_category: "Security", remaining_days: 35, transparencyScore: 54, lastSynced: new Date() },
    { bolpatraId: "MOCK-LTH-01", title: "Lalitpur Lab Hub", district: "Lalitpur", public_entity_name: "Lalitpur Metro", submission_date: new Date(Date.now() + 86400000 * 17).toISOString(), notice_category: "Heritage", remaining_days: 17, transparencyScore: 91, lastSynced: new Date() },
    { bolpatraId: "MOCK-BNK-01", title: "Zonal Medical Supplies", district: "Banke", public_entity_name: "MOH", submission_date: new Date(Date.now() + 86400000 * 3).toISOString(), notice_category: "Health", remaining_days: 3, transparencyScore: 19, lastSynced: new Date() },
    { bolpatraId: "MOCK-ITH-01", title: "Eastern Highway Support", district: "Itahari", public_entity_name: "MOPIT", submission_date: new Date(Date.now() + 86400000 * 31).toISOString(), notice_category: "Infrastructure", remaining_days: 31, transparencyScore: 82, lastSynced: new Date() },
    { bolpatraId: "MOCK-BKT-01", title: "Durbar Square Paving", district: "Bhaktapur", public_entity_name: "Bkt Municipality", submission_date: new Date(Date.now() + 86400000 * 10).toISOString(), notice_category: "Construction", remaining_days: 10, transparencyScore: 98, lastSynced: new Date() },
    { bolpatraId: "MOCK-NPJ-01", title: "Banke Drainage Main", district: "Banke", public_entity_name: "Nepalgunj Metro", submission_date: new Date(Date.now() + 86400000 * 14).toISOString(), notice_category: "Water", remaining_days: 14, transparencyScore: 42, lastSynced: new Date() },
];

/**
 * Get Paginated Tenders with Data Pruning
 */
const getTenders = async (req, res) => {
    try {
        if (global.USE_MOCK_DATA) {
            return res.status(200).json({
                success: true,
                page: 1,
                limit: 100,
                total: MOCK_TENDERS.length,
                data: MOCK_TENDERS,
                isMock: true
            });
        }
        const { page = 1, limit = 20, search, district, category, minScore, maxScore } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build Query Object
        const query = {};
        if (search) query.title = { $regex: search, $options: 'i' };
        if (district) query.district = district;
        if (category) query.notice_category = category;
        
        if (minScore || maxScore) {
            query.transparencyScore = {};
            if (minScore) query.transparencyScore.$gte = parseInt(minScore);
            if (maxScore) query.transparencyScore.$lte = parseInt(maxScore);
        }

        // DATA PRUNING: Only send necessary fields to frontend.
        const tenders = await Tender.find(query)
            .select('bolpatraId title district public_entity_name submission_date notice_category image remaining_days transparencyScore lastSynced')
            .sort({ submission_date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalItems = await Tender.countDocuments(query);

        res.status(200).json({
            success: true,
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalItems,
            data: tenders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Real-Time Stats for the Homepage
 */
const getStats = async (req, res) => {
    try {
        if (global.USE_MOCK_DATA) {
            return res.status(200).json({
                success: true,
                stats: {
                    totalTenders: 154,
                    activeDistricts: 12,
                    lastSyncTime: new Date(),
                    topDistricts: [
                        { name: "Kathmandu", count: 31 },
                        { name: "Bharatpur", count: 12 },
                        { name: "Pokhara", count: 8 },
                        { name: "Lalitpur", count: 6 },
                        { name: "Banke", count: 5 }
                    ],
                    topEntities: [
                        { name: "Department of Roads", count: 12 },
                        { name: "Nepal Telecom", count: 8 }
                    ]
                }
            });
        }
        const totalTenders = await Tender.countDocuments();
        
        // Count unique districts
        const districts = await Tender.distinct('district');
        const activeDistricts = districts.filter(d => d).length;

        // Get the most recent sync time
        const latestTender = await Tender.findOne().sort({ createdAt: -1 });
        const lastSyncTime = latestTender ? latestTender.createdAt : new Date();

        // Get top 5 districts by volume
        const topDistricts = await Tender.aggregate([
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get top 5 entities (Public Entities) by volume
        const topEntities = await Tender.aggregate([
            { $group: { _id: "$public_entity_name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalTenders,
                activeDistricts,
                lastSyncTime,
                topDistricts: topDistricts.map(d => ({ name: d._id || 'National', count: d.count })),
                topEntities: topEntities.map(e => ({ name: e._id || 'Unspecified', count: e.count }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getTenders,
    getStats
};
