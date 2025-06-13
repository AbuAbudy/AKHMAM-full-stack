const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");

router.get("/", volunteerController.getVolunteerPageContent);

module.exports = router;
