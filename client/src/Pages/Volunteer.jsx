import React, { useEffect, useState } from "react";
import {
  FaHandsHelping,
  FaUsers,
  FaRegSmile,
  FaMosque,
  FaBookOpen,
} from "react-icons/fa";
import axios from "axios";
import "../styles/Volunteer.css";

function Volunteer() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/volunteer")

      .then((res) => setContent(res.data))
      .catch((err) => console.error("Error fetching volunteer content", err));
  }, []);

  if (!content) return <p>Loading...</p>;

  return (
    <div className="volunteer-page">
      {/* Hero Section */}
      {content.hero && (
        <section className="volunteer-hero">
          <div className="overlay">
            <h1>{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {content.stats && (
        <section className="volunteer-stats">
          <div className="stat">
            <FaMosque className="icon" />
            <h3>{content.stats.mosques_supported}</h3>
            <p>{content.stats.mosques_label}</p>
          </div>
          <div className="stat">
            <FaBookOpen className="icon" />
            <h3>{content.stats.students_taught}</h3>
            <p>{content.stats.students_label}</p>
          </div>
          <div className="stat">
            <FaUsers className="icon" />
            <h3>{content.stats.active_volunteers}</h3>
            <p>{content.stats.volunteers_label}</p>
          </div>
        </section>
      )}

      {/* Highlights Section */}
      {content.highlights && (
        <section className="volunteer-highlights">
          <div className="highlight">
            <FaHandsHelping className="icon" />
            <h3>{content.highlights.highlight_1_title}</h3>
            <p>{content.highlights.highlight_1_text}</p>
          </div>
          <div className="highlight">
            <FaRegSmile className="icon" />
            <h3>{content.highlights.highlight_2_title}</h3>
            <p>{content.highlights.highlight_2_text}</p>
          </div>
          <div className="highlight">
            <FaUsers className="icon" />
            <h3>{content.highlights.highlight_3_title}</h3>
            <p>{content.highlights.highlight_3_text}</p>
          </div>
        </section>
      )}

      {/* Story Section */}
      {content.story && (
        <section className="volunteer-story">
          <h2>{content.story.title}</h2>
          <p>{content.story.paragraph_1}</p>
          <p>{content.story.paragraph_2}</p>
        </section>
      )}

      {/* Volunteer Form */}
      <section className="volunteer-form-section">
        <h2>Apply to Volunteer</h2>

        <form
          className="volunteer-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Submitted! (Connect this to backend later)");
          }}
        >
          <div className="form-group">
            <label>
              Full Name<span>*</span>
            </label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>
              Email<span>*</span>
            </label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>
              Phone Number<span>*</span>
            </label>
            <input type="tel" name="phone" required />
          </div>
          <div className="form-group">
            <label>
              Area of Interest / Skill<span>*</span>
            </label>
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
