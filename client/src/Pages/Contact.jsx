import React from 'react';
import '../styles/Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <h1 className='contact-title'>Contact AKHMAM</h1>
      <p className="intro-text">
        We’d love to hear from you. Whether you have a question, feedback, or a collaboration idea — our team is always ready to listen.
      </p>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
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
          <p><strong>Email:</strong> contact@akhmam.org</p>
          <p><strong>Phone:</strong> +251-912-345-678</p>
          <p><strong>Address:</strong> AKHMAM HQ, Bole Sub-City, Addis Ababa, Ethiopia</p>

          <div className="social-links">
            <h3>Connect with us</h3>
            <div className="icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-whatsapp"></i></a>
              <a href="#"><i className="fab fa-telegram"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Map */}
      <div className="map-container">
        <iframe
          title="AKHMAM Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.674896248862!2d38.77262801533579!3d8.980604093546677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85773142dfbb%3A0xd5b64dd6ab9b2c1e!2sBole%20Sub-City%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1636969020143!5m2!1sen!2set"
          width="100%"
          height="300"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;