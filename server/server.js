require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Import the sequelize instance
const userRoutes = require('./routes/userRoutes'); // Import routes (if you have any)

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define your routes
app.use('/api', userRoutes); // Example: routes for users

const PORT = process.env.PORT || 3000;

// Authenticate the Sequelize connection before starting the server
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    
    // Start the server after successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
