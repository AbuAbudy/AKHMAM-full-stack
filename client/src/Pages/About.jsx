import '../Styles/about.css';
import heroImage from '../assets/charity-banner.jpg';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1>About AKHMAM</h1>
          <p>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <p>Serving Humanity with Compassion, Guided by Islamic Values</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
          Our mission at AKHMAM is to empower individuals and communities through humanitarian aid, education, and support. We strive to improve lives by providing essential services in areas like healthcare, education, poverty alleviation, and emergency relief. Guided by the principles of compassion, integrity, and selflessness taught by Islam, we work to create a more equitable society where every individual can thrive.
            We strives to uplift lives through charity, education, health, and
            spiritual growth. We are inspired by the teachings of the Prophet
            Muhammad (peace be upon him), who taught us the value of kindness,
            unity, and selflessness.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
          Our vision is a world where the spirit of generosity and compassion transcends borders and barriers. We aim to be a beacon of hope for the underserved and marginalized, promoting unity and collaboration to address pressing social issues. We envision a future where everyone has access to basic human rights and resources, and where dignity and support are available to all, regardless of race, religion, or nationality.
            A world where every individual has the opportunity to thrive with
            dignity, faith, and community support — led by the light of Islamic
            mercy and wisdom.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="what-we-do">
        <h2>What We Do</h2>
        <ul>
          <li>Food & Water Distribution to the needy</li>
          <li>Islamic Education & Qur’an Programs</li>
          <li>Emergency Relief for displaced communities</li>
          <li>Support for Orphans & Widows</li>
          <li>Community Development Projects</li>
        </ul>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">Compassion (رحمة)</div>
          <div className="value-card">Integrity (أمانة)</div>
          <div className="value-card">Unity (وَحدة)</div>
          <div className="value-card">Service (خدمة)</div>
          <div className="value-card">Sincerity (إخلاص)</div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <h2>Our Story</h2>
        <p>
          AKHMAM was born from the hearts of young Ethiopian Muslims, eager to
          bring change and mercy to their communities. From humble beginnings in
          Addis Ababa, our organization has grown to reach villages, schools, and
          cities — always holding tight to the Qur’an and Sunnah as our guide.
        </p>
        <p>
          We believe that through sincere intention and unity, even small acts of
          charity can become a mountain of reward — both in this life and the
          Hereafter.
        </p>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Be Part of the Mission</h2>
        <p>
          Join us in making a difference. Your support means food, knowledge,
          hope — and most importantly — reward from Allah (SWT).
        </p>
        <Link to="/donate"><button>Donate Now</button></Link>
      </section>
    </div>
  );
}

export default About;
