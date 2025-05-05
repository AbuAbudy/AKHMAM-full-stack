// controllers/userController.js
const User = require('../models/user'); // Import the User model

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();  // Fetch all users from the database
    res.status(200).json(users);  // Send users in response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({ name, email, password });  // Create new user
    res.status(201).json(newUser);  // Send the created user as response
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

module.exports = { getAllUsers, createUser };
