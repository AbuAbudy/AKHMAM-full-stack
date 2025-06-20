// server/routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/about', getAboutContent);
router.put('/about', adminMiddleware, updateAboutContent);

module.exports = router;
