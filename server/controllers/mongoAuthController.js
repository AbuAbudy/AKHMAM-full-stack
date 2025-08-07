const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/mongo/user'); // Adjust path if needed
require('dotenv').config();

// TEMPORARY in-memory store for reset tokens (replace with DB or Redis in production)
const resetTokens = new Map();

// ✅ LOGIN CONTROLLER
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    resetTokens.set(token, user._id.toString());

    // Expire token after 10 minutes
    setTimeout(() => resetTokens.delete(token), 10 * 60 * 1000);

    // Normally, you'd email this. For now, return it directly.
    res.json({ message: 'Reset token generated', token });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const userId = resetTokens.get(token);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    resetTokens.delete(token);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
