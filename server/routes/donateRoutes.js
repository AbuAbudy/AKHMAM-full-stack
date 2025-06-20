const express = require('express');
const router = express.Router();
const { getDonateContent, updateDonateContent } = require('../controllers/donateController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/donate', getDonateContent); // public route
router.put('/donate', adminMiddleware, updateDonateContent); // admin protected

module.exports = router;
