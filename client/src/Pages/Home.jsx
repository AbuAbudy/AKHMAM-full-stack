import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  const getImageUrl = (path) => path ? `http://localhost:5000/${path}` : '';

  return (
    <div className="home">
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${getImageUrl(hero.background_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h1>{hero.heading}</h1>
        <p>{hero.subheading}</p>
        <Link to="/volunteer">
          <button>{hero.buttonText}</button>
        </Link>
      </section>

      <section className="about-preview">
        <h2>{aboutPreview.title}</h2>
        <div className="preview-cards">
          <div className="preview-card">
            <img src={getImageUrl(aboutPreview.missionImage)} alt="Mission" />
            <h3>{aboutPreview.missionTitle}</h3>
            <p>{aboutPreview.missionText}</p>
          </div>
          <div className="preview-card">
            <img src={getImageUrl(aboutPreview.visionImage)} alt="Vision" />
            <h3>{aboutPreview.visionTitle}</h3>
            <p>{aboutPreview.visionText}</p>
          </div>
        </div>
      </section>

      <section className="projects-preview">
        <h2>{projectsPreview.title}</h2>
        <div className="preview-cards">
          <div className="preview-card">
            <img src={getImageUrl(projectsPreview.project1Image)} alt="Water Project" />
            <h3>{projectsPreview.project1Title}</h3>
            <p>{projectsPreview.project1Text}</p>
          </div>
          <div className="preview-card">
            <img src={getImageUrl(projectsPreview.project2Image)} alt="Orphan Support" />
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
          <div
            className="help-card donate"
            style={{
              backgroundImage: `url(${getImageUrl(helpOptions.donateImage)})`
            }}
          >
            <div className="card-content">
              <h3>{helpOptions.donateTitle}</h3>
              <p><b>{helpOptions.donateText}</b></p>
              <Link to="/donate">
                <button>{helpOptions.donateButton}</button>
              </Link>
            </div>
          </div>
          <div
            className="help-card volunteer"
            style={{
              backgroundImage: `url(${getImageUrl(helpOptions.volunteerImage)})`
            }}
          >
            <div className="card-content">
              <h3>{helpOptions.volunteerTitle}</h3>
              <p><b>{helpOptions.volunteerText}</b></p>
              <Link to="/volunteer">
                <button>{helpOptions.volunteerButton}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
