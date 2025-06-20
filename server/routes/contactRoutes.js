const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET all contact contents (grouped by section)
router.get('/', contactController.getContactContent);

// PUT update by ID (admin only, protect this route in the future)
router.put('/:id', contactController.updateContactContent);

module.exports = router;
