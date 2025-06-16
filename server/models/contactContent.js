const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // your sequelize instance

const ContactContent = sequelize.define('ContactContent', {
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'contact_contents', // make sure your table name matches
  timestamps: false,
});

module.exports = ContactContent;
