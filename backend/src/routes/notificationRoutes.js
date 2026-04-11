const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:userId', notificationController.getUserNotifications);
router.put('/:notifId/read', notificationController.markAsRead);

// New Watchdog Endpoints
router.post('/subscribe', notificationController.subscribe);
router.post('/simulate-award/:tenderId', notificationController.simulateAward);
router.post('/simulate-new-tender/:tenderId', notificationController.simulateNewTender);

module.exports = router;
