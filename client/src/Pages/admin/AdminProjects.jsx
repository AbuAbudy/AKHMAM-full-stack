import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";
import "../../Styles/AdminHome.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}/`;

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
        const description = rawProjects[`project_${i}_description`];
        const status = rawProjects[`project_${i}_status`];
        const total = rawProjects[`project_${i}_total`];
        const current = rawProjects[`project_${i}_current`];
        const image = rawProjects[`project_${i}_image`];

        const isEmpty =
          !title && !description && !status && !total && !current && !image;
        if (isEmpty) continue;

        list.push({
          index: i,
          title: title || "",
          description: description || "",
          status: status || "Ongoing",
          total: total || "",
          current: current || "",
          image: image || "",
          imageFile: null,
        });
      }

      setProjects(list);
    } catch (err) {
      toast.error("❌ Failed to load project data.");
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(" Hero section saved", { autoClose: 2000 });
    } catch (err) {
      toast.error("❌ Failed to save hero section");
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
      toast.success(`✅ Project ${p.index} saved successfully`, {
        position: "bottom-center",
        autoClose: 2000,
      });
      fetchData();
    } catch (err) {
      toast.error(`❌ Failed to save project ${p.index}`);
    }
  };

  const confirmDelete = (i) => {
    toast.dismiss();

    const ConfirmToast = () => (
      <div style={{ textAlign: "center" }}>
        <p><strong>🗑️ Delete Project {i}?</strong></p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => handleDelete(i)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: "6px 12px",
              backgroundColor: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );

    toast.info(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      toastId: "confirm-delete",
      draggable: false,
    });
  };

  const handleDelete = async (i) => {
    toast.dismiss("confirm-delete");
    const token = localStorage.getItem("token");
    const keys = ["title", "description", "status", "total", "current", "image"];

    try {
      await Promise.all(
        keys.map((key) =>
          axios.put(
            "/api/projects",
            { section: "projects", [`project_${i}_${key}`]: "" },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      toast.success(`✅ Project ${i} deleted`, { autoClose: 2000 });
      fetchData();
    } catch (err) {
      toast.error(`❌ Failed to delete project ${i}`);
    }
  };

  const addNewProject = () => {
    const usedIndices = projects.map((p) => p.index);
    const nextIndex =
      [...Array(30).keys()].map((n) => n + 1).find((n) => !usedIndices.includes(n)) ||
      projects.length + 1;

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
      <ToastContainer />
      <button className="night-toggle" onClick={toggleMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Projects Page</h1>

      {/* Hero */}
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
        <button onClick={saveHero} className="update-button">Save Hero</button>
      </div>

      {/* Projects */}
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
                src={`${BACKEND_URL}${p.image}?t=${Date.now()}`}
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
            onClick={() => confirmDelete(p.index)}
            className="update-button"
            style={{ backgroundColor: "#c62828", marginLeft: "10px" }}
          >
            Delete Project
          </button>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={addNewProject} className="update-button">
          + Add New Project
        </button>
      </div>
    </div>
  );
}

export default AdminProjects;