const mongoose = require('mongoose');

const tenderIssueSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Delay', 'Corruption', 'Quality Issue', 'Other'], default: 'Other' },
  proofImageUrl: { type: String }, // Local file path like /uploads/123.jpg
  status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' }
}, { timestamps: true });

module.exports = mongoose.model('TenderIssue', tenderIssueSchema);
