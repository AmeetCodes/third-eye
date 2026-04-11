const express = require('express');
const router = express.Router();
const nearbyController = require('../controllers/nearbyController');

router.get('/', nearbyController.getNearbyTenders);

module.exports = router;
