const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');  // Import the User model
const router = express.Router();

// Route to create a new user (with hashing and admin support)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with hashed password and isAdmin flag
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin === true || isAdmin === 'true' // support boolean or string from client
    });

    // Return safe user info only
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user', details: error.message });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'isAdmin', 'createdAt', 'updatedAt'] // exclude password
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users', details: error.message });
  }
});

module.exports = router;