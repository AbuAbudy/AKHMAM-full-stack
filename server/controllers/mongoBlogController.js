const path = require('path');
const BlogContent = require('../models/mongo/BlogContent');

// GET all blog posts with pagination, search, and filters
const getAllPosts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 8;
    if (page < 1) page = 1;
    const skip = (page - 1) * limit;

    const { search = '', category = '', tag = '' } = req.query;
    const filter = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    if (tag.trim()) {
      filter.tags = tag.trim();
    }

    const totalPosts = await BlogContent.countDocuments(filter);
    const posts = await BlogContent.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const safePosts = posts.map(post => ({
      ...post,
      likes: Array.isArray(post.likes) ? post.likes : [],
      comments: Array.isArray(post.comments) ? post.comments : [],
    }));

    res.json({
      posts: safePosts,
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

// GET single blog post by ID
const getBlogById = async (req, res) => {
  try {
    const post = await BlogContent.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post by id:', error);
    res.status(500).json({ error: 'Server error fetching blog post' });
  }
};

// GET distinct categories
const getCategories = async (req, res) => {
  try {
    const categoriesRaw = await BlogContent.distinct('category');
    const categories = categoriesRaw
      .map((c, i) => ({
        id: i + 1,
        name: c?.trim() || 'Uncategorized',
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

// UPDATE a blog post or add a comment
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogContent.findById(id);
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

    if (comments !== undefined) {
      if (!Array.isArray(comments) || comments.length === 0) {
        return res.status(400).json({ error: 'Comments must be a non-empty array' });
      }

      const newComment = comments[comments.length - 1];
      if (!newComment || !newComment.text || newComment.text.trim() === '') {
        return res.status(400).json({ error: 'Comment text is required' });
      }

      post.comments = (post.comments || []).filter(
        (c) => c && c.text && c.text.trim() !== ''
      );

      post.comments.push({
        name: newComment.name?.trim() || 'Anonymous',
        text: newComment.text.trim(),
        timestamp: newComment.timestamp ? new Date(newComment.timestamp) : new Date(),
      });
    }

    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Server error updating blog post', details: error.message });
  }
};

// DELETE a blog post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogContent.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// ✅ EDIT a comment inside a post
const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await BlogContent.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.text = text.trim();
    comment.timestamp = new Date();

    await post.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
};

// ✅ DELETE a comment inside a post (fixed to avoid .remove())
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await BlogContent.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const originalLength = post.comments.length;
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);

    if (post.comments.length === originalLength) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  getAllPosts,
  getBlogById,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  editComment,
  deleteComment,
};
