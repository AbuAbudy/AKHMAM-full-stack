const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/about', getAboutContent);
router.put('/about', adminMiddleware, upload.any(), updateAboutContent);

module.exports = router;
