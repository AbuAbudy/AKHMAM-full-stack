const mongoose = require('mongoose');

const ProjectContentSchema = new mongoose.Schema({
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
  }
}, {
  collection: 'project_contents',
  versionKey: false,
});

module.exports = mongoose.model('ProjectContent', ProjectContentSchema);
