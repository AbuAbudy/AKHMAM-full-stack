const mongoose = require('mongoose');

const donateContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    maxlength: 100,
  },
  key_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  value: {
    type: String,
    required: true,
  },
}, {
  collection: 'donate_contents',
  timestamps: false,
});

// Create unique index on section + key_name
donateContentSchema.index({ section: 1, key_name: 1 }, { unique: true });

const DonateContent = mongoose.model('DonateContent', donateContentSchema);

module.exports = DonateContent;