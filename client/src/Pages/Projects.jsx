import React, { useEffect, useState } from "react";
import "../styles/Projects.css";
import axios from "axios";

function Projects() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get("/api/projects")
      .then(res => setContent(res.data))
      .catch(err => console.error("Failed to fetch projects content", err));
  }, []);

  if (!content) return <div>Loading...</div>;

  const hero = content.hero || {};
  const projectsData = content.projects || {};

  const dynamicProjects = [];
  for (let i = 1; i <= 10; i++) {
    const title = projectsData[`project_${i}_title`];
    if (!title) break;

    dynamicProjects.push({
      title,
      description: projectsData[`project_${i}_description`] || "",
      image: projectsData[`project_${i}_image`] || "",
      status: projectsData[`project_${i}_status`] || "",
    });
  }

  return (
    <div className="projects-page">
      <header className="projects-hero">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </header>

      <section className="projects-grid">
        {dynamicProjects.map((project, index) => (
          <div className="project-card" key={index}>
            <img src={`http://localhost:5000/${project.image}`} alt={project.title} />
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className={`status ${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Projects;
