const express = require("express");
const router = express.Router();
const contactController = require("../controllers/mongoContactController");
const adminMiddleware = require("../middleware/adminMiddleware"); // if you have this

router.get("/", contactController.getContactContent);
router.put("/:section", adminMiddleware, contactController.updateContactSection); // protect updates
router.post("/message", contactController.submitContactMessage);
router.delete('/message/:key', adminMiddleware, contactController.deleteContactMessage); // protect deletes

module.exports = router;
