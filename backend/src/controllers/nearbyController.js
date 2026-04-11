const Tender = require('../models/Tender');

exports.getNearbyTenders = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 5, query } = req.query;

    let filter = {};

    // 1. Add Text Search Filter
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { public_entity_name: { $regex: query, $options: 'i' } }
      ];
    }

    // 2. Add Geo Search Filter
    if (lat && lng) {
      const radiusInMeters = parseFloat(radiusKm) * 1000;
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      };
    }

    const tenders = await Tender.find(filter);

    res.json({ count: tenders.length, data: tenders });
  } catch (error) {
    console.error('Nearby error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};
