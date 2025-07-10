import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Blog.css';
import {
  FaHeart, FaRegHeart, FaComment, FaShareAlt,
  FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaCopy
} from 'react-icons/fa';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [pagination, setPagination] = useState({ totalPosts: 0, totalPages: 0, currentPage: 1, pageSize: 8 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAllComments, setShowAllComments] = useState({});
  const currentUser = 'user_123';

  const API = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [search, category, tag]);

  const handleLikeToggle = (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const liked = (post.likes || []).includes(currentUser);
          const updatedLikes = liked
            ? (post.likes || []).filter(u => u !== currentUser)
            : [...(post.likes || []), currentUser];

          axios.put(`${API}/api/blog/${id}`, { ...post, likes: updatedLikes });
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );
  };

  const handleCommentChange = (e, id, field) => {
    setCommentInputs({
      ...commentInputs,
      [id]: {
        ...commentInputs[id],
        [field]: e.target.value
      }
    });
  };

  const handleCommentSubmit = (e, id) => {
    e.preventDefault();
    const { name = '', text = '' } = commentInputs[id] || {};
    if (!text.trim()) return;

    const newComment = {
      name: name.trim() || 'Anonymous',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const updatedComments = [...(post.comments || []), newComment];
        axios.put(`${API}/api/blog/${id}`, { ...post, comments: updatedComments });
        return { ...post, comments: updatedComments };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [id]: {} });
  };

  const timeAgo = (isoString) => {
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
    const blogUrl = `${window.location.origin}/blog#post-${post.id}`;
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

  const handlePageClick = (pageNum) => {
    if (pageNum !== pagination.currentPage) {
      fetchPosts(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">AKHMAM Blog</h1>

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
          <div key={post.id} className="blog-post" id={`post-${post.id}`}>
            {post.image && (
              <img src={`${API}/${post.image}`} alt={post.title} className="post-image" />
            )}
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>{post.description}</p>

              <div className="post-actions">
                <button
                  className={`like-button ${(post.likes || []).includes(currentUser) ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(post.id)}
                >
                  {(post.likes || []).includes(currentUser) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span>{(post.likes || []).length} Likes</span>
                <span className="comment-count">
                  <FaComment /> {(post.comments || []).length} Comments
                </span>
              </div>

              <div className="share-section">
                <FaShareAlt style={{ marginRight: '8px' }} />
                <span>Share:</span>
                <button onClick={() => handleShare('facebook', post)} title="Facebook"><FaFacebook /></button>
                <button onClick={() => handleShare('twitter', post)} title="Twitter"><FaTwitter /></button>
                <button onClick={() => handleShare('whatsapp', post)} title="WhatsApp"><FaWhatsapp /></button>
                <button onClick={() => handleShare('telegram', post)} title="Telegram"><FaTelegram /></button>
                <button onClick={() => handleShare('copy', post)} title="Copy"><FaCopy /></button>
              </div>

              <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={commentInputs[post.id]?.name || ''}
                  onChange={(e) => handleCommentChange(e, post.id, 'name')}
                />
                <textarea
                  rows="2"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id]?.text || ''}
                  onChange={(e) => handleCommentChange(e, post.id, 'text')}
                  required
                ></textarea>
                <button type="submit">Post</button>
              </form>

              <div className="comment-list">
                {(showAllComments[post.id] ? post.comments : (post.comments || []).slice(-1)).map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.name}</strong> <span style={{ fontSize: '0.85rem', color: '#666' }}> - {timeAgo(comment.timestamp)}</span>
                    <p>{comment.text}</p>
                  </div>
                ))}

                {post.comments && post.comments.length > 1 && (
                  <button
                    className="show-more-comments"
                    onClick={() => setShowAllComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  >
                    {showAllComments[post.id] ? 'Show Less Comments' : `Show ${post.comments.length - 1} More Comment${post.comments.length - 1 > 1 ? 's' : ''}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {pagination.totalPages > 1 && (
        <nav className="pagination">
          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button key={pageNum} className={pageNum === pagination.currentPage ? 'active' : ''} onClick={() => handlePageClick(pageNum)}>
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
