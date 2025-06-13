// server/routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const { getAboutContent } = require('../controllers/aboutController');

router.get('/about', getAboutContent);

module.exports = router;
