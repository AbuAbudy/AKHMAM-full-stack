const BlogContent = require('../models/blogContent');

// GET /api/blog - fetch all blog posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogContent.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Server error fetching blog posts' });
  }
};

// PUT /api/blog/:id - update a blog post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, image, description, likes, comments } = req.body;

  try {
    const post = await BlogContent.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.update({
      title: title || post.title,
      image: image || post.image,
      description: description || post.description,
      likes: likes || post.likes,
      comments: comments || post.comments,
    });

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Server error updating blog post' });
  }
};

module.exports = {
  getAllPosts,
  updatePost,
};
