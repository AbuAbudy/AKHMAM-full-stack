const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { getDonateContent, updateDonateContent } = require('../controllers/donateController');

router.get('/', getDonateContent);
router.put('/', upload.any(), updateDonateContent);

module.exports = router;