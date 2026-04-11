const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const Tender = require('../models/Tender');
const notificationService = require('../services/notificationService');

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notifId } = req.params;
    await Notification.findByIdAndUpdate(notifId, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Handle user subscription for bidding alerts
 */
exports.subscribe = async (req, res) => {
  try {
    const { tenderId, email } = req.body;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!tenderId) {
      return res.status(400).json({ error: 'Which project are we monitoring?' });
    }

    // Check if subscription already exists
    const existing = await Subscription.findOne({ tenderId, email });
    if (existing) {
      return res.status(200).json({ 
        message: 'You are already monitoring this project! We will tip you off as soon as data changes.', 
        status: 'ALREADY_EXISTS' 
      });
    }

    const sub = new Subscription({ tenderId, email });
    await sub.save();

    // Send instant confirmation email!
    // We don't await this so the user gets a fast response in the UI, 
    // but the email sends in the background.
    notificationService.notifyWelcome(tenderId, email).catch(err => {
        console.error("❌ Failed to send welcome email:", err.message);
    });

    res.json({ 
      message: 'Watchdog Alert Activated! Check your inbox for confirmation.', 
      status: 'SUCCESS' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
};

/**
 * SIMULATOR: Mark a tender as awarded and trigger notifications to subscribers.
 */
exports.simulateAward = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { contractor, budget, district, publicEntity, score } = req.body;

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ error: 'Tender not found' });

    // Update tender to "AWARDED" status
    tender.status = 'AWARDED';
    tender.contractor_name = contractor || 'Sharma & Co. JV';
    tender.budget_amount_cr = budget || (Math.random() * 100).toFixed(2);
    tender.district = district || tender.district || 'Kathmandu';
    tender.public_entity_name = publicEntity || tender.public_entity_name || 'Ministry of Transport';
    tender.transparencyScore = score || tender.transparencyScore || 75;
    tender.lastSynced = new Date();
    await tender.save();

    // Trigger dispatch
    const success = await notificationService.notifyUpdate(tenderId, 'AWARDED');
    if (!success) {
        return res.status(500).json({ error: 'Notification dispatch failed', details: 'Check backend console for SMTP/Ethereal errors.' });
    }

    res.json({ 
      message: `Simulator successfully triggered! Notifications dispatched for project: ${tender.title}`, 
      status: 'AWARDED',
      details: {
        contractor: tender.contractor_name,
        budget: tender.budget_amount_cr,
        district: tender.district,
        publicEntity: tender.public_entity_name,
        transparencyScore: tender.transparencyScore
      }
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed', details: error.message });
  }
};

/**
 * SIMULATOR: Send a "New Tender Found" alert to subscribers (useful for showing "proactive" monitoring)
 */
exports.simulateNewTender = async (req, res) => {
    try {
        const { tenderId } = req.params;
        const tender = await Tender.findById(tenderId);
        if (!tender) return res.status(404).json({ error: 'Tender not found' });

        const success = await notificationService.notifyUpdate(tenderId, 'NEW');
        if (!success) {
            return res.status(500).json({ error: 'Notification dispatch failed', details: 'Check backend console.' });
        }

        res.json({ 
            message: `New Tender Alert simulated for: ${tender.title}`,
            status: 'NEW_TENDER_ALERT'
        });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: 'Simulation failed', details: error.message });
    }
};


