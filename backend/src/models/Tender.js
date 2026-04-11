const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  bolpatraId: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  public_entity_name: { type: String },
  district: { type: String },
  notice_category: { type: String },
  publishing_date: { type: Date },
  submission_date: { type: Date },
  remaining_days: { type: Number },
  procurement_type: { type: Array },
  project_category: { type: Array },
  image: { type: String },
  status: { type: String, default: 'OPEN' },
  transparencyScore: { type: Number, default: 100 },
  contractor_name: { type: String },
  budget_amount_cr: { type: Number },
  contract_start_date: { type: Date },
  contract_end_date: { type: Date },
  rawPayload: { type: Object },
  lastSynced: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  }
}, { timestamps: true });

tenderSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Tender', tenderSchema);
