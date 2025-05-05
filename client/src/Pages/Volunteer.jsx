import React from "react";
import { FaHandsHelping, FaUsers, FaRegSmile, FaMosque, FaBookOpen } from "react-icons/fa";
import "../styles/Volunteer.css";

function Volunteer() {
  return (
    <div className="volunteer-page">
      <section className="volunteer-hero">
        <div className="overlay">
          <h1>Become a Volunteer</h1>
          <p>Serve the Ummah. Grow with us. Earn eternal rewards.</p>
        </div>
      </section>

      <section className="volunteer-stats">
        <div className="stat">
          <FaMosque className="icon" />
          <h3>15+</h3>
          <p>Mosques Supported</p>
        </div>
        <div className="stat">
          <FaBookOpen className="icon" />
          <h3>500+</h3>
          <p>Students Taught</p>
        </div>
        <div className="stat">
          <FaUsers className="icon" />
          <h3>200+</h3>
          <p>Active Volunteers</p>
        </div>
      </section>

      <section className="volunteer-highlights">
        <div className="highlight">
          <FaHandsHelping className="icon" />
          <h3>Serve with Passion</h3>
          <p>Engage in real projects that uplift lives and strengthen faith.</p>
        </div>
        <div className="highlight">
          <FaRegSmile className="icon" />
          <h3>Grow Spiritually</h3>
          <p>Learn, serve, and get closer to Allah by helping others.</p>
        </div>
        <div className="highlight">
          <FaUsers className="icon" />
          <h3>Join a Family</h3>
          <p>Be part of a motivated, like-minded group of believers.</p>
        </div>
      </section>

      <section className="volunteer-story">
        <h2>Why Volunteer With Us?</h2>
        <p>
          Volunteering at AKHMAM is not just about giving your time — it’s about 
          fulfilling a greater purpose. Every small act of service contributes to 
          a bigger mission of spreading knowledge, compassion, and hope across communities.
        </p>
        <p>
          Whether you're a student, professional, or retiree, there's a place for 
          you here. Join us and become a force for change, for this world and the next.
        </p>
      </section>

      <section className="volunteer-form-section">
        <h2>Apply to Volunteer</h2>

        <form className="volunteer-form" onSubmit={(e) => e.preventDefault()}>
  <div className="form-group">
    <label>Full Name<span>*</span></label>
    <input type="text" name="name" required />
  </div>
  <div className="form-group">
    <label>Email<span>*</span></label>
    <input type="email" name="email" required />
  </div>
  <div className="form-group">
    <label>Phone Number<span>*</span></label>
    <input type="tel" name="phone" required />
  </div>
  <div className="form-group">
    <label>Area of Interest / Skill<span>*</span></label>
    <select name="interest" required>
      <option value="">-- Select an area --</option>
      <option value="Teaching">Teaching Islamic Studies</option>
      <option value="Medical">Medical Support</option>
      <option value="Fundraising">Fundraising</option>
      <option value="Media">Content Creation / Media</option>
      <option value="Tech">Website / Tech Support</option>
      <option value="General">General Volunteering</option>
    </select>
  </div>
  <div className="form-group">
    <label>Why do you want to volunteer?</label>
    <textarea name="message" rows="4" />
  </div>
  <button type="submit">Submit</button>
</form>
       

      </section>
    </div>
  );
}

export default Volunteer;