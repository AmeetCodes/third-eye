const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');

router.get('/', tenderController.getTenders);
router.get('/stats', tenderController.getStats);

module.exports = router;
