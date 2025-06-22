const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonateContent = sequelize.define('DonateContent', {
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
  tableName: 'donate_contents',
  timestamps: false,
});

module.exports = DonateContent;
