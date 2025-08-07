const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
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
  collection: 'home_contents',
  timestamps: false, // no createdAt/updatedAt fields
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

module.exports = HomeContent;