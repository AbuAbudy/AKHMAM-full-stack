import React from 'react';
import '../styles/Projects.css';
import project1Img from '../assets/banner.jpg';
import project2Img from '../assets/banner.jpg';
import project3Img from '../assets/banner.jpg';

const projects = [
  {
    title: 'Water for All',
    description: 'We build clean water wells in remote villages, transforming lives through access to safe drinking water.',
    image: project1Img,
    status: 'Ongoing'
  },
  {
    title: 'Empower Youth',
    description: 'Our scholarship program supports underprivileged students with education, mentorship, and resources.',
    image: project2Img,
    status: 'Completed'
  },
  {
    title: 'Food Aid Mission',
    description: 'Feeding families in need across drought-affected regions with sustainable food packages.',
    image: project3Img,
    status: 'Ongoing'
  }
];

function Projects() {
  return (
    <div className="projects-page">
      <header className="projects-hero">
        <h1>Our Projects</h1>
        <p>Together, we create lasting impact through meaningful work.</p>
      </header>

      <section className="projects-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <img src={project.image} alt={project.title} />
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