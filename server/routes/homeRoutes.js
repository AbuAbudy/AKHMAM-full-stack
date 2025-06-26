const express = require('express');
const router = express.Router();
const { getHomeContent, updateHomeContent } = require('../controllers/homeController');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/home', getHomeContent);

router.put('/home', adminMiddleware, upload.any(), updateHomeContent);

module.exports = router;
