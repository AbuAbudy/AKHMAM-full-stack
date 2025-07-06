const path = require('path');
const { Op, Sequelize } = require('sequelize');
const BlogContent = require('../models/BlogContent');

// GET all blog posts with pagination, search, filter
const getAllPosts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 8;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    const { search = '', category = '', tag = '' } = req.query;
    const where = {};

    // 🔍 Search by title or description
    if (search.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    // 📁 Filter by category
    if (category.trim()) {
      where.category = category.trim();
    }

    // 🏷️ Filter by tag inside JSON array
    if (tag.trim()) {
      where.tags = {
        [Op.contains]: [tag.trim()],
      };
    }

    const totalPosts = await BlogContent.count({ where });

    const posts = await BlogContent.findAll({
      where,
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

// ✅ GET distinct categories for AdminBlog dropdown
const getCategories = async (req, res) => {
  try {
    const categoriesRaw = await BlogContent.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
      ],
      raw: true,
    });

    const categories = categoriesRaw
      .map((c, i) => ({
        id: i + 1,
        name: c.category?.trim() || 'Uncategorized'
      }))
      .filter(c => c.name && c.name !== '');

    res.json({ categories });
  } catch (error) {
    console.error('Failed to get categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// CREATE a new blog post
const createPost = async (req, res) => {
  try {
    const { title, description, category = 'General', tags = [] } = req.body;
    let imagePath = '';

    if (req.file) {
      imagePath = path.posix.join('uploads', req.file.filename);
    }

    const newPost = await BlogContent.create({
      title,
      description,
      category,
      tags,
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

// UPDATE a blog post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogContent.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { title, description, likes, comments, category, tags } = req.body;

    if (req.file) {
      post.image = path.posix.join('uploads', req.file.filename);
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (likes !== undefined) post.likes = likes;

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

// DELETE a blog post
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
  getCategories,
  createPost,
  updatePost,
  deletePost,
};