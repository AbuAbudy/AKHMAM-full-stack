import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const isDarkMode = document.body.classList.contains('dark');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetTokenSent, setResetTokenSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // ✅ COPY TOKEN TO CLIPBOARD
  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard');
  };

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      if (user.isAdmin) {
        localStorage.setItem('token', token);
        navigate('/admin/dashboard');
      } else {
        const msg = 'You are not authorized as admin.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      setError(msg);
      toast.error(msg);
    }
  };

  // ✅ SEND RESET TOKEN
  const handleSendToken = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      const token = res.data.token;

      toast.info(
        <div>
          Reset token: <strong>{token}</strong>{' '}
          <FaCopy
            onClick={() => copyToClipboard(token)}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            title="Copy token"
          />
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: true,
          position: 'top-right',
        }
      );

      setResetTokenSent(true);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send token.';
      setError(msg);
      toast.error(msg);
    }
  };

  // ✅ RESET PASSWORD
  const handleResetPassword = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        token: resetToken,
        newPassword,
      });
      toast.success('Password reset successfully!');
      setEmail('');
      setResetToken('');
      setNewPassword('');
      setResetTokenSent(false);
      setIsForgotMode(false);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className={`admin-login-container ${isDarkMode ? 'dark' : ''}`}>
        <h2>{isForgotMode ? 'Reset Password' : 'Admin Login'}</h2>

        {!isForgotMode ? (
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit">Login</button>
            <p className="forgot-password-link" onClick={() => setIsForgotMode(true)}>
              Forgot password?
            </p>
            {error && <p className="login-error">{error}</p>}
          </form>
        ) : (
          <form className="admin-login-form" onSubmit={(e) => e.preventDefault()}>
            {!resetTokenSent ? (
              <>
                <input
                  type="email"
                  placeholder="Your admin email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="button" onClick={handleSendToken}>
                  Send Reset Token
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Reset Token"
                  value={resetToken}
                  required
                  onChange={(e) => setResetToken(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}
            <p
              className="forgot-password-link"
              onClick={() => {
                setIsForgotMode(false);
                setResetTokenSent(false);
                setError('');
              }}
            >
              Back to Login
            </p>
            {error && <p className="login-error">{error}</p>}
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminLogin;
