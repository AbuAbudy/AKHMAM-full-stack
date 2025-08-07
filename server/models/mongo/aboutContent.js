const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  key_name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, {
  collection: 'about_contents',
  timestamps: false, // disables createdAt/updatedAt
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

module.exports = AboutContent;