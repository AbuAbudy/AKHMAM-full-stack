const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getCategories, // 👈 ADD THIS
} = require('../controllers/blogController');

router.get('/', getAllPosts);
router.get('/categories', getCategories); // ✅ ADD THIS ROUTE
router.post('/', upload.single('image'), createPost);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;
