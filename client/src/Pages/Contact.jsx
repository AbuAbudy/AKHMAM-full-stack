import React, { useEffect, useState } from 'react';
import '../styles/Contact.css';
import axios from 'axios';

function Contact() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/contact')
      .then((res) => setContent(res.data))
      .catch((err) => console.error('Error loading contact content:', err));
  }, []);

  if (!content) return <p>Loading contact info...</p>;

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact AKHMAM</h1>
      <p className="intro-text">{content.form.intro}</p>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>{content.form.title}</h2>
          <form className="contact-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Subject" required />
            <textarea rows="5" placeholder="Your Message..." required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p><strong>Email:</strong> {content.info.email}</p>
          <p><strong>Phone:</strong> {content.info.phone}</p>
          <p><strong>Address:</strong> {content.info.address}</p>

          <div className="social-links">
            <h3>Connect with us</h3>
            <div className="icons">
              <a href={content.social.facebook}><i className="fab fa-facebook"></i></a>
              <a href={content.social.instagram}><i className="fab fa-instagram"></i></a>
              <a href={content.social.twitter}><i className="fab fa-twitter"></i></a>
              <a href={content.social.whatsapp}><i className="fab fa-whatsapp"></i></a>
              <a href={content.social.telegram}><i className="fab fa-telegram"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Embed */}
      <div className="map-container" style={{ width: '100%', height: '300px', marginTop: '20px' }}>
        <iframe
          title="AKHMAM Location"
          src={content.map.embed_url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
