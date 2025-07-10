import React, { useEffect, useState } from "react";
import "../Styles/Projects.css";
import axios from "axios";

function Projects() {
  const [content, setContent] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/projects`)
      .then((res) => setContent(res.data))
      .catch((err) => console.error("Failed to fetch projects", err));
  }, []);

  if (!content) return <div>Loading...</div>;

  const hero = content.hero || {};
  const projectsData = content.projects || {};

  const projects = [];
  for (let i = 1; i <= 30; i++) {
    const title = projectsData[`project_${i}_title`];
    const description = projectsData[`project_${i}_description`];
    const status = projectsData[`project_${i}_status`];
    const total = projectsData[`project_${i}_total`];
    const current = projectsData[`project_${i}_current`];
    const image = projectsData[`project_${i}_image`];

    if (!title && !description && !status && !total && !current && !image) {
      continue;
    }

    const totalAmount = parseFloat(total || 0);
    const currentAmount = parseFloat(current || 0);
    const remaining = Math.max(totalAmount - currentAmount, 0);

    projects.push({
      title: title || "",
      description: description || "",
      image: image || "",
      status: status || "",
      total: totalAmount,
      current: currentAmount,
      remaining,
    });
  }

  const cleanedProjects = projects.map((p, idx) => ({
    ...p,
    index: idx + 1,
  }));

  return (
    <div className="projects-page">
      <header className="projects-hero">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </header>

      <section className="projects-grid">
        {cleanedProjects.map((p, idx) => (
          <div className="project-card" key={idx}>
            {p.image && (
              <img
                src={`${API}/${p.image}`}
                alt={p.title}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
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

function ReadMore({ text, maxLength = 200 }) {
  const [expanded, setExpanded] = useState(false);

  if (!text || text.length <= maxLength) return <p>{text}</p>;

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