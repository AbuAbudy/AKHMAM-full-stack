


import { Link } from 'react-router-dom';
import '../Styles/Footer.css'
import logo from '../assets/Akmamlogo.png'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt="AKHMAM Logo" />
          <p>AKHMAM is dedicated to serving humanity through compassion, unity, and Islamic principles.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/volunteer">Volunteer</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/blog">Blogs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: info@akhmam.org</p>
          <p>Phone: +251-900-000000</p>
          <p>Address: Agaro, Ethiopia</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/Akmaam" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://t.me/akmamofficial2008" aria-label="Telegram"><i className="fab fa-telegram-plane"></i></a>
            <a href="akmamofficial" aria-label="YouTube"><i className="fab fa-youtube"></i></a>

            <a href="https://www.tiktok.com/@akmamofficial" target="_blank" rel="noopener noreferrer">
  <i className="fab fa-tiktok"></i>
</a>


          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AKMAM Charity Organization. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;