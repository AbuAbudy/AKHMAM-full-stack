// controllers/userController.js
const User = require('../models/user'); // Import the Mongoose User model

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Mongoose: fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({ name, email, password }); // Mongoose: create user
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

module.exports = { getAllUsers, createUser };