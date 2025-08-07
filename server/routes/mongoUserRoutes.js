const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/mongo/user'); // Mongoose User model
const router = express.Router();

// Create a new user with password hashing and admin flag
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin === true || isAdmin === 'true',
    });

    await newUser.save();

    // Return safe public info
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user', details: error.message });
  }
});

// Get all users (excluding passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'id name email isAdmin createdAt updatedAt'); // projection to exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users', details: error.message });
  }
});

module.exports = router;
