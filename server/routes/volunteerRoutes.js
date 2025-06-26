const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const volunteerController = require("../controllers/volunteerController");

// GET all volunteer content
router.get("/", volunteerController.getVolunteerPageContent);

// PUT update volunteer content (with file upload)
router.put("/", upload.any(), volunteerController.updateVolunteerContent);

module.exports = router;
