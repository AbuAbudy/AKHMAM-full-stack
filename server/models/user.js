// models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});


// Sync the model with the database (create table if not exists)
sequelize.sync()
  .then(() => {
    console.log('User table created if it does not exist.');
  })
  .catch((error) => {
    console.error('Error creating table:', error);
  });

module.exports = User;
