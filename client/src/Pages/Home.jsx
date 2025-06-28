import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';

function Home() {
  const [content, setContent] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/home')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Error fetching home data:', err));
  }, []);

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const getImageUrl = (path) => path ? `http://localhost:5000/${path}` : '';

  if (!content) return <p>Loading...</p>;

  const { hero, aboutPreview, projectsPreview, quranQuote, helpOptions } = content;

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
          {[{
            image: aboutPreview.missionImage,
            title: aboutPreview.missionTitle,
            text: aboutPreview.missionText
          }, {
            image: aboutPreview.visionImage,
            title: aboutPreview.visionTitle,
            text: aboutPreview.visionText
          }].map((item, index) => (
            <div className="preview-card" key={index}>
              <img src={getImageUrl(item.image)} alt="preview" />
              <h3>{item.title}</h3>
              <p className="preview-text">
                {expandedCard === index ? item.text : item.text.slice(0, 150) + (item.text.length > 150 ? '...' : '')}
              </p>
              {item.text.length > 150 && (
                <button className="read-more" onClick={() => toggleExpand(index)}>
                  {expandedCard === index ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="projects-preview">
        <h2>{projectsPreview.title}</h2>
        <div className="preview-cards">
          {[{
            image: projectsPreview.project1Image,
            title: projectsPreview.project1Title,
            text: projectsPreview.project1Text
          }, {
            image: projectsPreview.project2Image,
            title: projectsPreview.project2Title,
            text: projectsPreview.project2Text
          }].map((item, index) => (
            <div className="preview-card" key={index}>
              <img src={getImageUrl(item.image)} alt="project" />
              <h3>{item.title}</h3>
              <p className="preview-text">
                {expandedCard === index + 2 ? item.text : item.text.slice(0, 150) + (item.text.length > 150 ? '...' : '')}
              </p>
              {item.text.length > 150 && (
                <button className="read-more" onClick={() => toggleExpand(index + 2)}>
                  {expandedCard === index + 2 ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          ))}
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
          {[{
            class: 'donate',
            image: helpOptions.donateImage,
            title: helpOptions.donateTitle,
            text: helpOptions.donateText,
            button: helpOptions.donateButton,
            link: '/donate'
          }, {
            class: 'volunteer',
            image: helpOptions.volunteerImage,
            title: helpOptions.volunteerTitle,
            text: helpOptions.volunteerText,
            button: helpOptions.volunteerButton,
            link: '/volunteer'
          }].map((item, index) => (
            <div
              className={`help-card ${item.class}`}
              key={index}
              style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
            >
              <div className="card-content">
                <h3>{item.title}</h3>
                <p><b>{item.text}</b></p>
                <Link to={item.link}>
                  <button>{item.button}</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
