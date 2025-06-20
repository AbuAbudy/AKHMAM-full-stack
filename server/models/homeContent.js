const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeContent = sequelize.define('HomeContent', {
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
  tableName: 'home_contents',
  timestamps: false,
});

module.exports = HomeContent;
