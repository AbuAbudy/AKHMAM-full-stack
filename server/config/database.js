const { Sequelize } = require('sequelize');
require('dotenv').config(); // To load environment variables from .env

// Create a new instance of Sequelize (this is your database connection)
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name
  process.env.DB_USER,  // Database user
  process.env.DB_PASSWORD,  // Database password
  {
    host: process.env.DB_HOST,  // Database host (localhost)
    dialect: process.env.DB_DIALECT,  // Database dialect (mysql)
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
