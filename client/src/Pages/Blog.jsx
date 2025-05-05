import React, { useState } from 'react';
import '../styles/Blog.css';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import postImg1 from '../assets/donate.jpg';
import postImg2 from '../assets/donate.jpg';
import postImg3 from '../assets/donate.jpg';

const initialPosts = [
  {
    id: 1,
    title: 'Empowering Women Through Education',
    image: postImg1,
    description: 'How AKHMAM is helping women in rural areas access opportunities through learning.',
    comments: [],
    likes: [],
  },
  {
    id: 2,
    title: 'Volunteer Spotlight: Stories of Service',
    image: postImg2,
    description: 'Meet our inspiring volunteers and learn about their incredible journeys with AKHMAM.',
    comments: [],
    likes: [],
  },
  {
    id: 3,
    title: 'Monthly Impact Report: April 2025',
    image: postImg3,
    description: 'A summary of the lives impacted, funds raised, and milestones achieved last month.',
    comments: [],
    likes: [],
  },
];

function Blog() {
  const [posts, setPosts] = useState(initialPosts);
  const [commentInputs, setCommentInputs] = useState({});
  const currentUser = 'user_123'; // Simulated logged-in user

  const handleLikeToggle = (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === id) {
          const alreadyLiked = post.likes.includes(currentUser);
          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter(user => user !== currentUser)
              : [...post.likes, currentUser],
          };
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
      prev.map(post =>
        post.id === id
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    setCommentInputs({ ...commentInputs, [id]: '' });
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">AKHMAM Blog</h1>
      {posts.map((post) => (
        <div key={post.id} className="blog-post">
          <img src={post.image} alt={post.title} className="post-image" />
          <div className="post-content">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className="post-actions">
              <button
                className={`like-button ${post.likes.includes(currentUser) ? 'liked' : ''}`}
                onClick={() => handleLikeToggle(post.id)}
              >
                {post.likes.includes(currentUser) ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span>{post.likes.length} Likes</span>
              <span className="comment-count">
                <FaComment /> {post.comments.length} Comments
              </span>
            </div>

            <form
              onSubmit={(e) => handleCommentSubmit(e, post.id)}
              className="comment-form"
            >
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
              {post.comments.map((comment, index) => (
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