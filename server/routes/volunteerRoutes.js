const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const volunteerController = require("../controllers/volunteerController");

router.get("/", volunteerController.getVolunteerPageContent);
router.put("/", upload.any(), volunteerController.updateVolunteerContent);

// Application routes
router.post("/apply", volunteerController.submitVolunteerApplication);
router.get("/applications", volunteerController.getVolunteerApplications);
router.delete("/applications/:key", volunteerController.deleteVolunteerApplication);

module.exports = router;