import React from 'react';
import '../styles/Contact.css';

function Contact() {
  // Map embed URL from your database
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1368.0114569229636!2d36.581984498043816!3d7.859837660916323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2snl!4v1749997355625!5m2!1sen!2snl";

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact AKHMAM</h1>
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

      {/* Google Map Embed */}
      <div className="map-container" style={{ width: '100%', height: '300px', marginTop: '20px' }}>
        <iframe
          title="AKHMAM Location"
          src={mapEmbedUrl}
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
