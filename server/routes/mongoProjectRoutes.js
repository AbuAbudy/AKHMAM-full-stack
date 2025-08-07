const express = require("express");
const router = express.Router();
const projectController = require("../controllers/mongoProjectController");
const upload = require("../middleware/uploadMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET project content (public)
router.get("/", projectController.getProjectContent);

// PUT project content (admin only, supports file uploads)
router.put("/", adminMiddleware, upload.any(), projectController.updateProjectContent);

module.exports = router;
