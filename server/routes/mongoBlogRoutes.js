const express = require('express');
const router = express.Router();
const blogController = require('../controllers/mongoBlogController');

router.get('/blog', blogController.getAllPosts);
router.get('/blog/categories', blogController.getCategories);
router.get('/blog/:id', blogController.getBlogById);
router.post('/blog', blogController.createPost);
router.put('/blog/:id', blogController.updatePost);
router.put('/blog/:postId/comments/:commentId', blogController.editComment);  // ✅ fixed
router.delete('/blog/:postId/comments/:commentId', blogController.deleteComment);  // ✅ fixed
router.delete('/blog/:id', blogController.deletePost);

module.exports = router;
