const express = require("express");
const router = express.Router();
const { getProjectContent } = require("../controllers/projectController");

router.get("/projects", getProjectContent);

module.exports = router;
