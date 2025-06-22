const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AboutContent = sequelize.define('AboutContent', {
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  key_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'about_contents',
  timestamps: false,
});

module.exports = AboutContent;
