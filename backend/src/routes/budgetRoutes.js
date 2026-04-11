const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Budget Data for Dashboard
router.get('/data', budgetController.getBudgetData);

// AI Chatbot
router.post('/chat', budgetController.handleChat);

module.exports = router;
