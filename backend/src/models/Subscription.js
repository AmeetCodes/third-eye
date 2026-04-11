const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  email: { type: String, required: true },
  name: { type: String },
  status: { type: String, enum: ['PENDING', 'SENT'], default: 'PENDING' },
  notifiedAt: { type: Date }
}, { timestamps: true });

// Prevent duplicate subscriptions for the same email + tender
subscriptionSchema.index({ email: 1, tenderId: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
