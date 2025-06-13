const express = require('express');
const router = express.Router();
const { getDonatePageContent } = require('../controllers/donateController');

router.get('/', getDonatePageContent);

module.exports = router;
