import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/AdminDashboard.css";

function AdminDashboard() {
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`admin-dashboard ${theme}`}>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <p className="dashboard-welcome">Welcome back, Admin! Choose a page to manage:</p>

      <div className="dashboard-list">
        <div className="dashboard-card" onClick={() => navigate('/admin/home')}>
          <div className="dashboard-card-icon">🏠</div>
          <div>
            <h2>Home Page</h2>
            <p>Edit homepage content.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/about')}>
          <div className="dashboard-card-icon">ℹ️</div>
          <div>
            <h2>About Page</h2>
            <p>Update information about the organization.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/donate')}>
          <div className="dashboard-card-icon">💰</div>
          <div>
            <h2>Donate Page</h2>
            <p>Manage donation details and banks.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/volunteer')}>
          <div className="dashboard-card-icon">🙋‍♀️</div>
          <div>
            <h2>Volunteer Page</h2>
            <p>Update volunteer call-to-action.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/projects')}>
          <div className="dashboard-card-icon">📂</div>
          <div>
            <h2>Projects Page</h2>
            <p>Manage project highlights and descriptions.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/blog')}>
          <div className="dashboard-card-icon">📝</div>
          <div>
            <h2>Blog Page</h2>
            <p>Edit blog posts and comments.</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/contact')}>
          <div className="dashboard-card-icon">📞</div>
          <div>
            <h2>Contact Page</h2>
            <p>Update contact details, map, and social links.</p>
          </div>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;
