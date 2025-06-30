const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getDonateContent,
  updateDonateContent,
  submitDonationProof,
  deleteDonationProof,
} = require('../controllers/donateController');

router.get('/', getDonateContent);
router.put('/', upload.any(), updateDonateContent);
router.post('/submit-proof', upload.single('screenshot'), submitDonationProof);
router.delete('/proof/:key', deleteDonationProof);

module.exports = router;