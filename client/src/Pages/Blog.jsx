import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Blog.css';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const currentUser = 'user_123'; // Simulated user
  const baseURL = 'http://localhost:5000'; // your backend

  useEffect(() => {
    axios.get(`${baseURL}/api/blog`)
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

          axios.put(`${baseURL}/api/blog/${id}`, { ...post, likes: updatedLikes });
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
          axios.put(`${baseURL}/api/blog/${id}`, { ...post, comments: updatedComments });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );

    setCommentInputs({ ...commentInputs, [id]: '' });
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">AKHMAM Blog</h1>
      {posts.map(post => (
        <div key={post.id} className="blog-post">
          {post.image && (
            <img
              src={`${baseURL}/${post.image}`}
              alt={post.title}
              className="post-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${baseURL}/assets/uploads/default.jpg`; // fallback
              }}
            />
          )}
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