const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/", contactController.getContactContent);
router.put("/:section", contactController.updateContactSection);
router.post("/message", contactController.submitContactMessage); // new
router.delete('/message/:key', contactController.deleteContactMessage);

module.exports = router;