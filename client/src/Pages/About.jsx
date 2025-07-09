import '../Styles/about.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function About() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/about`)
      .then(res => setContent(res.data))
      .catch(err => console.error('Error fetching about data:', err));
  }, []);

  if (!content) return <div>Loading...</div>;

  const {
    hero = {},
    mission = {},
    vision = {},
    whatWeDo = {},
    coreValues = {},
    ourStory = {},
    callToAction = {}
  } = content;

  // Convert whatWeDo and coreValues to arrays of values
  const whatWeDoItems = Object.values(whatWeDo);
  const coreValuesList = Object.values(coreValues);

  return (
    <div className="about-page">

      {/* Hero Section */}
     {hero && hero.background_image && (
  <div
    className="hero-section"
    style={{
      backgroundImage: `url(${import.meta.env.VITE_API_URL}/${hero.background_image.replace('assets/', '')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '100px 20px',
      color: '#fff',
    }}
  >
    <div>
      {hero.subtitle_ar && (
        <h1 dir="rtl" >
          {hero.subtitle_ar}
        </h1>
      )}


      <h2>{hero.title}</h2>

      {hero.subtitle_en && (
        <p >{hero.subtitle_en}</p>
      )}
    </div>
  </div>
)}



      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission">
          <h2>{mission.title}</h2>
          <p>{mission.description}</p>
        </div>
        <div className="vision">
          <h2>{vision.title}</h2>
          <p>{vision.description}</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="what-we-do">
        <h2>What We Do</h2>
        <ul>
          {whatWeDoItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {coreValuesList.map((value, index) => (
            <div key={index} className="value-card">{value}</div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <h2>Our Story</h2>
        <p>{ourStory.para_1}</p>
        <p>{ourStory.para_2}</p>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>{callToAction.title}</h2>
        <p>{callToAction.description}</p>
        <Link to={callToAction.button_link}>
          <button>{callToAction.button_text}</button>
        </Link>
      </section>
    </div>
  );
}

export default About;
