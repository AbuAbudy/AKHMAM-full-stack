import React, { useState } from 'react';
import '../styles/Blog.css';
import postImg1 from '../assets/donate.jpg';
import postImg2 from '../assets/donate.jpg';
import postImg3 from '../assets/donate.jpg';

const initialPosts = [
  {
    id: 1,
    title: 'Empowering Women Through Education',
    image: postImg1,
    description: 
      'AKHMAM has been working in rural communities to create educational opportunities for women, providing them with the skills and confidence to shape their futures. By offering scholarships, vocational training, and support programs, AKHMAM is empowering women to break the cycle of poverty and gain a sense of independence and self-worth.',
    comments: [],
    likes: 0,
  },
  {
    id: 2,
    title: 'Volunteer Spotlight: Stories of Service',
    image: postImg2,
    description:
      'Our volunteers play a crucial role in supporting AKHMAM’s mission. In this post, we spotlight some of our amazing volunteers who have made a significant impact in the communities they serve. From teaching children to delivering food in remote areas, these stories will inspire you to join the cause and make a difference.',
    comments: [],
    likes: 0,
  },
  {
    id: 3,
    title: 'Monthly Impact Report: April 2025',
    image: postImg3,
    description:
      'In April 2025, AKHMAM made significant strides in our ongoing mission. We built five new schools, funded scholarships for 50 young women, and distributed thousands of essential supplies. Our mission to bring hope and opportunity continues to grow thanks to the support of donors and volunteers like you. Read more about how your donations are changing lives.',
    comments: [],
    likes: 0,
  },
];

function Blog() {
  const [posts, setPosts] = useState(initialPosts);
  const [commentInputs, setCommentInputs] = useState({});

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleCommentChange = (e, id) => {
    setCommentInputs({ ...commentInputs, [id]: e.target.value });
  };

  const handleCommentSubmit = (e, id) => {
    e.preventDefault();
    if (!commentInputs[id]) return;
    const newComment = { name: 'User', text: commentInputs[id] };
    setPosts((prev) =>
      prev.map((post) =>
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
              <button onClick={() => handleLike(post.id)}>
                Like ({post.likes})
              </button>
              <div className="share-buttons">
                <a href="#" title="Share on Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" title="Share on Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" title="Share on WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="#" title="Share on Telegram">
                  <i className="fab fa-telegram"></i>
                </a>
                <a href="#" title="Share on Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <form
              onSubmit={(e) => handleCommentSubmit(e, post.id)}className="comment-form"
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