import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import '../Styles/Blog.css';
import {
  FaHeart, FaRegHeart, FaComment, FaShareAlt,
  FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaCopy,
  FaEdit, FaTrash
} from 'react-icons/fa';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [pagination, setPagination] = useState({ totalPosts: 0, totalPages: 0, currentPage: 1, pageSize: 8 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAllComments, setShowAllComments] = useState({});
  const currentUser = { _id: 'user_123' }; // Simulated user
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchPosts(pagination.currentPage); }, [search, category, tag]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/blog/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page, search, category, tag }).toString();
      const res = await axios.get(`${API}/api/blog?${query}`);
      setPosts(res.data.posts);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (_id) => {
    const targetPost = posts.find(p => p._id === _id);
    if (!targetPost) return;
    const liked = (targetPost.likes || []).includes(currentUser._id);
    const updatedLikes = liked
      ? (targetPost.likes || []).filter(u => u !== currentUser._id)
      : [...(targetPost.likes || []), currentUser._id];
    try {
      const res = await axios.put(`${API}/api/blog/${_id}`, { likes: updatedLikes });
      setPosts(prev => prev.map(post => post._id === _id ? { ...post, likes: res.data.post.likes } : post));
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleCommentChange = (e, _id, field) => {
    setCommentInputs({
      ...commentInputs,
      [_id]: {
        ...commentInputs[_id],
        [field]: e.target.value
      }
    });
  };

  const handleCommentSubmit = async (e, _id) => {
    e.preventDefault();
    const { name = '', text = '' } = commentInputs[_id] || {};
    if (!text.trim()) return;

    const newComment = {
      _id: uuidv4(),
      name: name.trim() || 'Anonymous',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      authorId: currentUser._id
    };

    try {
      const res = await axios.put(`${API}/api/blog/${_id}`, {
        comments: [newComment]
      });
      setPosts(prev =>
        prev.map(post =>
          post._id === _id ? { ...post, comments: res.data.post.comments } : post
        )
      );
      setCommentInputs({ ...commentInputs, [_id]: {} });
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleEditComment = (postId, commentId, currentText) => {
    setEditingComments(prev => ({
      ...prev,
      [`${postId}_${commentId}`]: { text: currentText }
    }));
  };

  const handleEditCommentChange = (postId, commentId, value) => {
    setEditingComments(prev => ({
      ...prev,
      [`${postId}_${commentId}`]: { text: value }
    }));
  };

  const handleSaveEditedComment = async (e, postId, commentId) => {
    e.preventDefault();
    const edited = editingComments[`${postId}_${commentId}`];
    if (!edited?.text || edited.text.trim() === '') return;

    try {
      const res = await axios.put(`${API}/api/blog/${postId}/comments/${commentId}`, { text: edited.text.trim() });
      const updatedComment = res.data.comment;

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map(c =>
                  c._id === commentId ? updatedComment : c
                )
              }
            : post
        )
      );
      setEditingComments(prev => {
        const copy = { ...prev };
        delete copy[`${postId}_${commentId}`];
        return copy;
      });
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleCancelEditing = (postId, commentId) => {
    setEditingComments(prev => {
      const copy = { ...prev };
      delete copy[`${postId}_${commentId}`];
      return copy;
    });
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${API}/api/blog/${postId}/comments/${commentId}`);
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, comments: post.comments.filter(c => c._id !== commentId) }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const timeAgo = (isoString) => {
    if (!isoString) return '';
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleShare = (platform, post) => {
    const blogUrl = `${window.location.origin}/blog#post-${post._id}`;
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(post.title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + blogUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(post.title)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(blogUrl);
        alert("Link copied to clipboard!");
        return;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  const handlePageClick = (page) => {
    if (page !== pagination.currentPage) {
      setPagination(prev => ({ ...prev, currentPage: page }));
      fetchPosts(page);
    }
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">AKHMAM Blog</h1>

      {/* Filters */}
      <div className="blog-filters">
        <input type="text" placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select value={tag} onChange={e => setTag(e.target.value)}>
          <option value="">All Tags</option>
          <option value="Ramadan">Ramadan</option>
          <option value="Zakat">Zakat</option>
          <option value="Orphans">Orphans</option>
        </select>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="blog-post" id={`post-${post._id}`}>
            {post.image && <img src={`${API}/${post.image}`} alt={post.title} className="post-image" />}
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>{post.description}</p>

              <div className="post-actions">
                <button
                  className={`like-button ${(post.likes || []).includes(currentUser) ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(post._id)}
                  title={(post.likes || []).includes(currentUser) ? 'Unlike' : 'Like'}
                >
                  {(post.likes || []).includes(currentUser) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span>{(post.likes || []).length} Likes</span>
                <span className="comment-count">
                  <FaComment /> {(post.comments || []).length} Comments
                </span>
              </div>

              {/* Share section */}
              <div className="share-section">
                <FaShareAlt style={{ marginRight: '8px' }} />
                <span>Share:</span>
                <button onClick={() => handleShare('facebook', post)} title="Facebook"><FaFacebook /></button>
                <button onClick={() => handleShare('twitter', post)} title="Twitter"><FaTwitter /></button>
                <button onClick={() => handleShare('whatsapp', post)} title="WhatsApp"><FaWhatsapp /></button>
                <button onClick={() => handleShare('telegram', post)} title="Telegram"><FaTelegram /></button>
                <button onClick={() => handleShare('copy', post)} title="Copy"><FaCopy /></button>
              </div>

              <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="comment-form">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={commentInputs[post._id]?.name || ''}
                  onChange={(e) => handleCommentChange(e, post._id, 'name')}
                />
                <textarea
                  rows="2"
                  placeholder="Write a comment..."
                  value={commentInputs[post._id]?.text || ''}
                  onChange={(e) => handleCommentChange(e, post._id, 'text')}
                  required
                />
                <button type="submit">Post</button>
              </form>

              <div className="comment-list">
                {(showAllComments[post._id] ? (post.comments || []) : (post.comments || []).slice(-1)).map((comment, index) => {
                  const editKey = `${post._id}_${comment._id}`;
                  const isEditing = editingComments.hasOwnProperty(editKey);
                  return (
                    <div key={comment._id || `${post._id}-comment-${index}`} className="comment">
                      <strong>{comment.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        {' '} - {timeAgo(comment.timestamp)}
                      </span>

                      {/* Show textarea if editing */}
                      {isEditing ? (
                        <form onSubmit={(e) => handleSaveEditedComment(e, post._id, comment._id)}>
                          <textarea
                            rows="2"
                            value={editingComments[editKey].text}
                            onChange={(e) => handleEditCommentChange(post._id, comment._id, e.target.value)}
                            required
                          />
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => handleCancelEditing(post._id, comment._id)}>Cancel</button>
                        </form>
                      ) : (
                        <p>{comment.text}</p>
                      )}

                      {/* Edit & Delete buttons only if NOT editing */}
                      <div className="comment-controls">
  <button
    className="edit-btn"
    onClick={() => handleEditComment(post._id, comment._id, comment.text)}
  >
    <FaEdit style={{ marginRight: '6px' }} />
    Edit
  </button>
  <button
    className="delete-btn"
    onClick={() => handleDeleteComment(post._id, comment._id)}
  >
    <FaTrash style={{ marginRight: '6px' }} />
    Delete
  </button>
</div>
                    </div>
                  );
                })}
              </div>

              {post.comments && post.comments.length > 1 && (
                <button
                  className="show-more-comments"
                  onClick={() => setShowAllComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                >
                  {showAllComments[post._id]
                    ? 'Show Less Comments'
                    : `Show ${post.comments.length - 1} More Comment${post.comments.length - 1 > 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination buttons */}
      {pagination.totalPages > 1 && (
        <nav className="pagination">
          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={pageNum === pagination.currentPage ? 'active' : ''}
                onClick={() => {
                  if (pageNum !== pagination.currentPage) {
                    fetchPosts(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default Blog;