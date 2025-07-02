import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminHome.css";
import { FaSun, FaMoon } from "react-icons/fa";

function AdminProjects() {
  const [hero, setHero] = useState({ title: "", subtitle: "" });
  const [projects, setProjects] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const mode = localStorage.getItem("mode") || "light";
    setDarkMode(mode === "dark");
    document.body.classList.add(`${mode}-mode`);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/projects");
      const data = res.data;

      setHero({
        title: data.hero?.title || "",
        subtitle: data.hero?.subtitle || "",
      });

      const rawProjects = data.projects || {};
      const list = [];

      for (let i = 1; i <= 30; i++) {
        const title = rawProjects[`project_${i}_title`];
        if (!title) break;
        list.push({
          index: i,
          title,
          description: rawProjects[`project_${i}_description`] || "",
          image: rawProjects[`project_${i}_image`] || "",
          status: rawProjects[`project_${i}_status`] || "Ongoing",
          total: rawProjects[`project_${i}_total`] || "",
          current: rawProjects[`project_${i}_current`] || "",
          imageFile: null,
        });
      }

      setProjects(list);
    } catch (err) {
      alert("Failed to load project data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const isDark = document.body.classList.contains("dark-mode");
    document.body.classList.remove(isDark ? "dark-mode" : "light-mode");
    document.body.classList.add(isDark ? "light-mode" : "dark-mode");
    localStorage.setItem("mode", isDark ? "light" : "dark");
    setDarkMode(!isDark);
  };

  const handleHeroChange = (key, value) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const saveHero = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "/api/projects",
        {
          section: "hero",
          title: hero.title,
          subtitle: hero.subtitle,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Hero section saved.");
    } catch (err) {
      alert("Failed to save hero section.");
      console.error(err);
    }
  };

  const handleProjectChange = (i, key, value) => {
    setProjects((prev) =>
      prev.map((p) => (p.index === i ? { ...p, [key]: value } : p))
    );
  };

  const handleImageChange = (i, file) => {
    setProjects((prev) =>
      prev.map((p) => (p.index === i ? { ...p, imageFile: file } : p))
    );
  };

  const saveProject = async (p) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("section", "projects");
    formData.append(`project_${p.index}_title`, p.title);
    formData.append(`project_${p.index}_description`, p.description);
    formData.append(`project_${p.index}_status`, p.status);
    formData.append(`project_${p.index}_total`, p.total);
    formData.append(`project_${p.index}_current`, p.current);
    if (p.imageFile) {
      formData.append(`project_${p.index}_image`, p.imageFile);
    }

    try {
      await axios.put("/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Project saved.");
      fetchData();
    } catch (err) {
      alert("Failed to save project.");
      console.error(err);
    }
  };

  const deleteProject = async (i) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("token");
    const keysToClear = [
      "title",
      "description",
      "status",
      "total",
      "current",
      "image",
    ];

    try {
      for (const key of keysToClear) {
        await axios.put(
          "/api/projects",
          { section: "projects", [`project_${i}_${key}`]: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert("Project deleted.");
      fetchData();
    } catch (err) {
      alert("Failed to delete project.");
      console.error(err);
    }
  };

  const addNewProject = () => {
    const nextIndex = projects.length ? projects[projects.length - 1].index + 1 : 1;
    setProjects((prev) => [
      ...prev,
      {
        index: nextIndex,
        title: "",
        description: "",
        image: "",
        status: "Ongoing",
        total: "",
        current: "",
        imageFile: null,
      },
    ]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-home-container">
      <button className="night-toggle" onClick={toggleMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Projects Page</h1>

      {/* HERO SECTION */}
      <div className="home-section">
        <h2>Hero Section</h2>

        <div className="field-group">
          <label>Title:</label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => handleHeroChange("title", e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Subtitle:</label>
          <input
            type="text"
            value={hero.subtitle}
            onChange={(e) => handleHeroChange("subtitle", e.target.value)}
          />
        </div>

        <button onClick={saveHero} className="update-button">
          Save Hero
        </button>
      </div>

      {/* PROJECTS */}
      {projects.map((p) => (
        <div key={p.index} className="home-section">
          <h2>Project {p.index}</h2>

          <div className="field-group">
            <label>Title:</label>
            <input
              type="text"
              value={p.title}
              onChange={(e) => handleProjectChange(p.index, "title", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Description:</label>
            <textarea
              rows="3"
              value={p.description}
              onChange={(e) => handleProjectChange(p.index, "description", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Status:</label>
            <select
              value={p.status}
              onChange={(e) => handleProjectChange(p.index, "status", e.target.value)}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="field-group">
            <label>Total Amount Needed:</label>
            <input
              type="number"
              min="0"
              value={p.total}
              onChange={(e) => handleProjectChange(p.index, "total", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Current Amount Raised:</label>
            <input
              type="number"
              min="0"
              value={p.current}
              onChange={(e) => handleProjectChange(p.index, "current", e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(p.index, e.target.files[0])}
            />
            {p.image && !p.imageFile && (
              <img
                src={`http://localhost:5000/${p.image}?t=${Date.now()}`}
                alt={`Project ${p.index}`}
                width="200"
                style={{ marginTop: "8px" }}
              />
            )}
            {p.imageFile && (
              <img
                src={URL.createObjectURL(p.imageFile)}
                alt="Preview"
                width="200"
                style={{ marginTop: "8px" }}
              />
            )}
          </div>

          <button onClick={() => saveProject(p)} className="update-button">
            Save Project
          </button>
          <button
            onClick={() => deleteProject(p.index)}
            className="update-button"
            style={{ backgroundColor: "#c62828", marginLeft: "10px" }}
          >
            Delete Project
          </button>
        </div>
      ))}

      {/* ADD NEW PROJECT BUTTON AT THE END */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={addNewProject} className="update-button">
          + Add New Project
        </button>
      </div>
    </div>
  );
}

export default AdminProjects;