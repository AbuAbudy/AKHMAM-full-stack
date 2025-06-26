const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Public - get all contact content grouped by section
router.get("/", contactController.getContactContent);

// Admin-only - update a full section by section name
router.put("/:section", contactController.updateContactSection);

module.exports = router;
