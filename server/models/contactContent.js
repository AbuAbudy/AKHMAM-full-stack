const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactContent = sequelize.define('ContactContent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
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
  tableName: 'contact_contents',
  timestamps: false,
});

module.exports = ContactContent;
