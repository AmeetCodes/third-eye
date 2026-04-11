const mongoose = require('mongoose');
const Tender = require('../models/Tender');
const config = require('../config/config');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']); // Windows Srv Fix for MongoDB Atlas

// Base coordinates for Kathmandu to generate realistic nearby points
const BASE_LAT = 27.7172;
const BASE_LNG = 85.3240;

const seedGeo = async () => {
  try {
    await mongoose.connect(config.mongodb_uri);
    console.log('Connected to DB');

    const tenders = await Tender.find();
    let updatedCount = 0;

    const CONTRACTORS = [
      "Kalika Construction Pvt. Ltd.",
      "Sharma & Company",
      "Pappu Construction (Under Review)",
      "Lama Construction",
      "Tundi Construction",
      "Zhejiang Oversea Engineering",
      "BMS-Rock JV",
      "Raman Construction"
    ];

    for (let tender of tenders) {
      let changed = false;

      // 1. Coordinates Seeding
      if (!tender.location || !tender.location.coordinates || tender.location.coordinates.length === 0) {
        const latOffset = (Math.random() - 0.5) * 0.1; 
        const lngOffset = (Math.random() - 0.5) * 0.1; 
        tender.location = {
          type: 'Point',
          coordinates: [BASE_LNG + lngOffset, BASE_LAT + latOffset]
        };
        changed = true;
      }

      // 2. Extra Details Seeding (Contractor, Budget, Timeline)
      if (!tender.contractor_name) {
        tender.contractor_name = CONTRACTORS[Math.floor(Math.random() * CONTRACTORS.length)];
        tender.budget_amount_cr = parseFloat((Math.random() * 145 + 5).toFixed(2)); // Rs. 5Cr to 150Cr
        
        // Timeline: Sometime in the last year to next year
        const start = new Date();
        start.setMonth(start.getMonth() - Math.floor(Math.random() * 12));
        const end = new Date(start);
        end.setMonth(end.getMonth() + Math.floor(Math.random() * 24) + 6); // 6-30 months duration
        
        tender.contract_start_date = start;
        tender.contract_end_date = end;
        changed = true;
      }

      if (changed) {
        await tender.save();
        updatedCount++;
      }
    }

    console.log(`✅ Finished seeding Lat/Lng for ${updatedCount} tenders`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedGeo();
