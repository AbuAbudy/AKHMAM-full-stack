import React, { useEffect, useState } from "react";
import "../styles/Projects.css";
import axios from "axios";

function Projects() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios
      .get("/api/projects")
      .then((res) => setContent(res.data))
      .catch((err) => console.error("Failed to fetch projects", err));
  }, []);

  if (!content) return <div>Loading...</div>;

  const hero = content.hero || {};
  const projectsData = content.projects || {};

  const projects = [];
  for (let i = 1; i <= 30; i++) {
    const title = projectsData[`project_${i}_title`];
    if (!title) break;

    const total = parseFloat(projectsData[`project_${i}_total`] || 0);
    const current = parseFloat(projectsData[`project_${i}_current`] || 0);
    const remaining = Math.max(total - current, 0);

    projects.push({
      title,
      description: projectsData[`project_${i}_description`] || "",
      image: projectsData[`project_${i}_image`] || "",
      status: projectsData[`project_${i}_status`] || "",
      total,
      current,
      remaining,
    });
  }

  return (
    <div className="projects-page">
      <header className="projects-hero">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </header>

      <section className="projects-grid">
        {projects.map((p, idx) => (
          <div className="project-card" key={idx}>
            <img src={`http://localhost:5000/${p.image}`} alt={p.title} />
            <div className="project-content">
              <h3>{p.title}</h3>
              <ReadMore text={p.description} maxLength={200} />
              <div className="funding">
                <p><strong>Needed:</strong> ${p.total.toLocaleString()}</p>
                <p><strong>Raised:</strong> ${p.current.toLocaleString()}</p>
                <p><strong>Remaining:</strong> ${p.remaining.toLocaleString()}</p>
              </div>
              <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ReadMore component for toggling long descriptions
function ReadMore({ text, maxLength = 200 }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) return <p>{text}</p>;

  return (
    <p>
      {expanded ? text : `${text.slice(0, maxLength)}... `}
      <button
        onClick={() => setExpanded(!expanded)}
        className="read-more-btn"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </p>
  );
}

export default Projects;