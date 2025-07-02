const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const upload = require("../middleware/uploadMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", projectController.getProjectContent);
router.put("/", adminMiddleware, upload.any(), projectController.updateProjectContent);

module.exports = router;