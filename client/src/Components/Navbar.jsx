import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/Akmamlogo.png';


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load mode from localStorage
  useEffect(() => {
    const mode = localStorage.getItem('mode') || 'light';
    setDarkMode(mode === 'dark');
    document.body.classList.toggle('dark-mode', mode === 'dark');
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('mode', newMode ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div id='logos' className="logo"><img src={logo} alt="Akmam logo"/>𝔸𝕂𝕄𝔸𝕄</div>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/donate" onClick={closeMenu}>Donate</Link></li>
        <li><Link to="/volunteer" onClick={closeMenu}>Volunteer</Link></li>
        <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
      </ul>
      <div className="navbar-actions">
        <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label="Toggle Dark Mode">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          ☰
        </div>
      </div>
    </nav>
  );
}

export default Navbar;