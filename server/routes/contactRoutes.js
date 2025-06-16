const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to get all contact contents
router.get('/', contactController.getContactContent);

// Admin route to update content by id (make sure to protect this route)
router.put('/:id', contactController.updateContactContent);

module.exports = router;
