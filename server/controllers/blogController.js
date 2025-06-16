const BlogContent = require('../models/blogContent');

// GET /api/blog - fetch all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogContent.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Server error fetching blog posts' });
  }
};
