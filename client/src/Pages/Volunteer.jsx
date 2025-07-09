import React, { useEffect, useState } from "react";
import {
  FaHandsHelping,
  FaUsers,
  FaRegSmile,
  FaMosque,
  FaBookOpen,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Volunteer.css";

function Volunteer() {
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  useEffect(() => {
    axios
      .get("${import.meta.env.VITE_API_URL}/api/volunteers")
      .then((res) => setContent(res.data))
      .catch((err) => console.error("Error fetching volunteer content", err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/volunteers/apply",
        formData
      );
      toast.success(res.data.message || "Submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (err) {
      console.error("Submission error", err);
      toast.error("Submission failed.");
    }
  };

  if (!content) return <p>Loading...</p>;

  return (
    <div className="volunteer-page">
      <ToastContainer position="top-right" autoClose={4000} />

      {content.hero && (
        <section
          className="volunteer-hero"
          style={{
            backgroundImage: content.hero.background_image
              ? `url(${import.meta.env.VITE_API_URL}${content.hero.background_image}?v=${Date.now()})`
              : "none",
          }}
        >
          <div className="overlay">
            <h1>{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
          </div>
        </section>
      )}

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

        <form className="volunteer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Full Name<span>*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Email<span>*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Phone Number<span>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Area of Interest / Skill<span>*</span>
            </label>
            <select
              name="interest"
              required
              value={formData.interest}
              onChange={handleChange}
            >
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
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default Volunteer;