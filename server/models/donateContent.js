const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonateContent = sequelize.define('DonateContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  section: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  key_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'donate_contents',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['section', 'key_name'], // To prevent duplicates on section+key_name pairs
    },
  ],
});

module.exports = DonateContent;