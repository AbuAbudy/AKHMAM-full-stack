import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminHome.css";
import { FaSun, FaMoon } from "react-icons/fa";

function AdminVolunteer() {
  const [volunteerContent, setVolunteerContent] = useState({});
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchContent();

    const mode = localStorage.getItem("mode") || "light";
    setDarkMode(mode === "dark");
    document.body.classList.add(`${mode}-mode`);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/volunteers");
      setVolunteerContent(res.data);
      setUpdatedContent(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching volunteer content:", err);
    }
  };

  const toggleNightMode = () => {
    const isDark = document.body.classList.contains("dark-mode");
    document.body.classList.remove(isDark ? "dark-mode" : "light-mode");
    document.body.classList.add(isDark ? "light-mode" : "dark-mode");
    localStorage.setItem("mode", isDark ? "light" : "dark");
    setDarkMode(!isDark);
  };

  const handleChange = (section, key, value) => {
    setUpdatedContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleFileChange = (section, key, file) => {
    setUpdatedContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: file,
      },
    }));
  };

  const handleUpdateSection = async (section) => {
    setUpdating((prev) => ({ ...prev, [section]: true }));

    const token = localStorage.getItem("token");
    const updates = updatedContent[section];
    const formData = new FormData();
    formData.append("section", section);

    for (const key in updates) {
      formData.append(key, updates[key]);
    }

    try {
      const res = await axios.put("http://localhost:5000/api/volunteers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message || "Section updated!");

      // Refetch fresh content
      const refreshed = await axios.get("http://localhost:5000/api/volunteers");
      setVolunteerContent(refreshed.data);
      setUpdatedContent(refreshed.data);
    } catch (error) {
      console.error(error);
      alert("Update failed: " + (error.response?.data?.error || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, [section]: false }));
    }
  };

  if (loading) return <p>Loading volunteer content...</p>;

  return (
    <div className="admin-home-container">
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Volunteer Page Content</h1>

      {Object.entries(volunteerContent).map(([section, data]) => (
        <div key={section} className="home-section">
          <h2>{section.toUpperCase()}</h2>

          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="field-group">
              <label>{key}:</label>
              {key.toLowerCase().includes("image") ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(section, key, e.target.files[0])}
                  />
                  {typeof value === "string" && (
                    <div style={{ marginTop: "8px" }}>
                      <small>Current:</small>
                      <br />
                      <img
                        src={`http://localhost:5000${value}?t=${Date.now()}`}
                        alt={key}
                        width="200"
                      />
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={updatedContent[section]?.[key] || ""}
                  onChange={(e) => handleChange(section, key, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            className="update-button"
            onClick={() => handleUpdateSection(section)}
            disabled={updating[section]}
          >
            {updating[section] ? "Updating..." : `Update ${section}`}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminVolunteer;
