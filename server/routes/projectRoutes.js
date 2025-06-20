// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", projectController.getProjectContent);
router.put("/", adminMiddleware, projectController.updateProjectContent);

module.exports = router;
