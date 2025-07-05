const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');

router.get('/', getAllPosts);  // supports ?page=1 internally
router.post('/', upload.single('image'), createPost);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;