// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import '../Styles/home.css';

function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/home')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Error fetching home data:', err));
  }, []);

  if (!content) return <p>Loading...</p>;

  const { hero, aboutPreview, projectsPreview, quranQuote, helpOptions } = content;

  return (
    <div className="home">
      <section className="hero">
        <h1>{hero.heading}</h1>
        <p>{hero.subheading}</p>
        <button>{hero.buttonText}</button>
      </section>

      <section className="about-preview">
        <h2>{aboutPreview.title}</h2>
        <div className="preview-cards">
          <div className="preview-card">
            <img src={aboutPreview.missionImage} alt="Mission" />
            <h3>{aboutPreview.missionTitle}</h3>
            <p>{aboutPreview.missionText}</p>
          </div>
          <div className="preview-card">
            <img src={aboutPreview.visionImage} alt="Vision" />
            <h3>{aboutPreview.visionTitle}</h3>
            <p>{aboutPreview.visionText}</p>
          </div>
        </div>
      </section>

      <section className="projects-preview">
        <h2>{projectsPreview.title}</h2>
        <div className="preview-cards">
          <div className="preview-card">
            <img src={projectsPreview.project1Image} alt="Water Project" />
            <h3>{projectsPreview.project1Title}</h3>
            <p>{projectsPreview.project1Text}</p>
          </div>
          <div className="preview-card">
            <img src={projectsPreview.project2Image} alt="Orphan Support" />
            <h3>{projectsPreview.project2Title}</h3>
            <p>{projectsPreview.project2Text}</p>
          </div>
        </div>
      </section>

      <section className="quran-quote">
        <p>
          "{quranQuote.text}" <br />
          <em>{quranQuote.reference}</em>
        </p>
      </section>

      <section className="help-options">
        <h2 className="section-title">{helpOptions.title}</h2>
        <div className="card-wrapper">
          <div className="help-card donate">
            <div className="card-content">
              <h3>{helpOptions.donateTitle}</h3>
              <p><b>{helpOptions.donateText}</b></p>
              <button>{helpOptions.donateButton}</button>
            </div>
          </div>
          <div className="help-card volunteer">
            <div className="card-content">
              <h3>{helpOptions.volunteerTitle}</h3>
              <p><b>{helpOptions.volunteerText}</b></p>
              <button>{helpOptions.volunteerButton}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
