const path = require('path');
const BlogContent = require('../models/BlogContent');

// GET all blog posts with pagination
const getAllPosts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 8;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    const totalPosts = await BlogContent.count();

    const posts = await BlogContent.findAll({
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    res.json({
      posts,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Server error fetching blog posts' });
  }
};

// CREATE a new blog post
const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imagePath = '';

    if (req.file) {
      imagePath = path.posix.join('uploads', req.file.filename);
    }

    const newPost = await BlogContent.create({
      title,
      description,
      image: imagePath,
      likes: [],
      comments: [],
    });

    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// UPDATE a blog post (or add likes/comments)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogContent.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { title, description, likes, comments } = req.body;

    if (req.file) {
      post.image = path.posix.join('uploads', req.file.filename);
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (likes !== undefined) post.likes = likes;

    // Append new comment (with timestamp) to existing comments
    if (comments) {
      const newComment = comments[comments.length - 1];
      const enhancedComment = {
        name: newComment.name || 'Anonymous',
        text: newComment.text,
        timestamp: new Date().toISOString(),
      };
      post.comments = [...(post.comments || []), enhancedComment];
    }

    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Server error updating blog post' });
  }
};

// DELETE blog post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogContent.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};