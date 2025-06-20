const express = require('express');
const router = express.Router();
const { getHomeContent, updateHomeContent } = require('../controllers/homeController');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public - anyone can view home content
router.get('/home', getHomeContent);

// Admin-only - update home content including images and text
router.put('/home', adminMiddleware, upload.any(), updateHomeContent);

module.exports = router;
