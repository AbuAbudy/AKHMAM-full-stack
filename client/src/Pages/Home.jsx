import '../Styles/home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
  <h1>Give with Faith, Help with Heart</h1>
  <p>Together, we serve humanity through Islamic values of compassion, charity, and unity.</p>
  <button>Join Our Mission</button>
</section>


      <section className="about-preview">
  <h2>About AKHMAM</h2>
  <div className="preview-cards">
    <div className="preview-card">
      <img src="src\assets\icons\mission.gif" alt="Mission" />
      <h3>Our Mission</h3>
      <p>To uplift communities through sustainable charity inspired by Islamic values.</p>
    </div>
    <div className="preview-card">
      <img src="src\assets\icons\vision.gif" alt="Vision" />
      <h3>Our Vision</h3>
      <p>A world where no one is left behind and dignity is restored to all.</p>
    </div>
  </div>
</section>

<section className="projects-preview">
  <h2>Our Projects</h2>
  <div className="preview-cards">
    <div className="preview-card">
      <img src="src\assets\icons\water.gif" alt="Water Project" />
      <h3>Clean Water</h3>
      <p>We build wells and water systems in remote villages across Africa.</p>
    </div>
    <div className="preview-card">
      <img src="src\assets\icons\orphans.png" alt="Orphan Support" />
      <h3>Orphan Care</h3>
      <p>Providing food, shelter, and education for vulnerable children.</p>
    </div>
  </div>
</section>


      <section className="quran-quote">
        <p>
          "And whatever you spend in the way of Allah – it will be fully repaid to you, and you will not be wronged." <br />
          <em>— Qur'an 8:60</em>
        </p>
      </section>

      <section className="help-options">
  <h2 className="section-title">Ways You Can Help</h2>
  <div className="card-wrapper">
    <div className="help-card donate">
      <div className="card-content">
        <h3>Donate</h3>
        <p>
          <b> Your sadaqah and zakat can change lives. Help us reach those in need.
        </b>
          </p>
        <button>Donate Now</button>
      </div>
    </div>
    <div className="help-card volunteer">
      <div className="card-content">
        <h3>Volunteer</h3>
        <p><b>Be a part of something bigger. Offer your time and skills to serve humanity.</b></p>
        <button>Join Us</button>
      </div>
    </div>
  </div>
</section>






    </div>
  )
}

export default Home
