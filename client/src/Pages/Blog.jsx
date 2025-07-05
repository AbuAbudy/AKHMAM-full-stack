import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Blog.css';
import { FaHeart, FaRegHeart, FaComment, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaCopy } from 'react-icons/fa';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const currentUser = 'user_123'; // Simulated user

  useEffect(() => {
    axios.get('/api/blog')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching blog posts:', err));
  }, []);

  const handleLikeToggle = (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const liked = post.likes?.includes(currentUser);
          const updatedLikes = liked
            ? post.likes.filter(u => u !== currentUser)
            : [...(post.likes || []), currentUser];

          axios.put(`/api/blog/${id}`, { ...post, likes: updatedLikes });
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );
  };

  const handleCommentChange = (e, id) => {
    setCommentInputs({ ...commentInputs, [id]: e.target.value });
  };

  const handleCommentSubmit = (e, id) => {
    e.preventDefault();
    if (!commentInputs[id]) return;

    const newComment = { name: 'User', text: commentInputs[id] };
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const updatedComments = [...(post.comments || []), newComment];
          axios.put(`/api/blog/${id}`, { ...post, comments: updatedComments });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );

    setCommentInputs({ ...commentInputs, [id]: '' });
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

  return (
    <div className="blog-container">
      <h1 className="blog-title">AKHMAM Blog</h1>
      {posts.map(post => (
        <div key={post.id} className="blog-post" id={`post-${post.id}`}>
          <img src={`http://localhost:5000/${post.image}`} alt={post.title} className="post-image" />
          <div className="post-content">
            <h2>{post.title}</h2>
            <p>{post.description}</p>

            <div className="post-actions">
              <button
                className={`like-button ${post.likes?.includes(currentUser) ? 'liked' : ''}`}
                onClick={() => handleLikeToggle(post.id)}
              >
                {post.likes?.includes(currentUser) ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span>{post.likes?.length || 0} Likes</span>
              <span className="comment-count">
                <FaComment /> {post.comments?.length || 0} Comments
              </span>
            </div>

            {/* ✅ Share Section */}
            <div className="share-section">
              <FaShareAlt style={{ marginRight: '8px' }} />
              <span>Share:</span>
              <button onClick={() => handleShare('facebook', post)} title="Share on Facebook"><FaFacebook /></button>
              <button onClick={() => handleShare('twitter', post)} title="Share on Twitter"><FaTwitter /></button>
              <button onClick={() => handleShare('whatsapp', post)} title="Share on WhatsApp"><FaWhatsapp /></button>
              <button onClick={() => handleShare('telegram', post)} title="Share on Telegram"><FaTelegram /></button>
              <button onClick={() => handleShare('copy', post)} title="Copy Link"><FaCopy /></button>
            </div>

            <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
              <textarea
                rows="2"
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(e, post.id)}
                required
              ></textarea>
              <button type="submit">Post</button>
            </form>

            <div className="comment-list">
              {post.comments?.map((comment, index) => (
                <div key={index} className="comment">
                  <strong>{comment.name}</strong>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Blog;