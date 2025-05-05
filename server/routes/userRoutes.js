const express = require('express');
const User = require('../models/User');  // Import the User model
const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation (for example: email should be unique)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user', details: error.message });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users', details: error.message });
  }
});

module.exports = router;
