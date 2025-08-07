const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String, // Mongoose `String` can handle text fields like Sequelize TEXT
  },
}, {
  collection: 'contact_contents', // matches your original Sequelize table name
  timestamps: false,
});

module.exports = mongoose.model('ContactContent', contactContentSchema);
