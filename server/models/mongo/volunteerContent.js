const mongoose = require('mongoose');

const volunteerContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, {
  collection: 'volunteer_contents',
  timestamps: false,
});

const VolunteerContent = mongoose.model('VolunteerContent', volunteerContentSchema);

module.exports = VolunteerContent;
