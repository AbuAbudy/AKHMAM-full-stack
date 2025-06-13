// server/routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const { getHomeContent } = require('../controllers/homeController');

router.get('/home', getHomeContent);

module.exports = router;
