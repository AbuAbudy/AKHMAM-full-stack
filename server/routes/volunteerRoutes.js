const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");

// GET all volunteer content
router.get("/", volunteerController.getVolunteerPageContent);

// PUT update volunteer content
router.put("/", volunteerController.updateVolunteerContent);

module.exports = router;
