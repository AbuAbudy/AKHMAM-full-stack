const express = require('express');
const router = express.Router();
const {
  getAboutContent,
  updateAboutContent,
  getListItems,
  addListItem,
  updateListItem,
  deleteListItem
} = require('../controllers/aboutController');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/about', getAboutContent);

// Update simple sections only (no whatWeDo/coreValues)
router.put('/about', adminMiddleware, upload.any(), updateAboutContent);

// List item routes (only admin)
router.get('/about/list/:section', adminMiddleware, getListItems);
router.post('/about/list/:section', adminMiddleware, addListItem);
router.put('/about/list/item/:id', adminMiddleware, updateListItem);
router.delete('/about/list/item/:id', adminMiddleware, deleteListItem);

module.exports = router;
