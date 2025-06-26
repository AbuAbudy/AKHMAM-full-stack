import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminHome.css"; // reuse AdminHome.css for styling
import { FaSun, FaMoon } from "react-icons/fa";

function AdminContact() {
  const [contactContent, setContactContent] = useState({});
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load content on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contact")
      .then((res) => {
        setContactContent(res.data);
        setUpdatedContent(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching contact content:", err));

    // Load mode from localStorage
    const mode = localStorage.getItem("mode") || "light";
    setDarkMode(mode === "dark");
    document.body.classList.add(`${mode}-mode`);
  }, []);

  // Toggle dark/light mode
  const toggleNightMode = () => {
    const isDark = document.body.classList.contains("dark-mode");
    document.body.classList.remove(isDark ? "dark-mode" : "light-mode");
    document.body.classList.add(isDark ? "light-mode" : "dark-mode");
    localStorage.setItem("mode", isDark ? "light" : "dark");
    setDarkMode(!isDark);
  };

  // Handle input changes
  const handleChange = (section, key, value) => {
    setUpdatedContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Update a whole section
  const handleUpdateSection = async (section) => {
    setUpdating((prev) => ({ ...prev, [section]: true }));
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/contact/${section}`,
        updatedContent[section],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message || "Section updated!");
      setContactContent((prev) => ({
        ...prev,
        [section]: { ...updatedContent[section] },
      }));
    } catch (error) {
      console.error(error);
      alert("Update failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, [section]: false }));
    }
  };

  if (loading) return <p>Loading contact content...</p>;

  return (
    <div className="admin-home-container">
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Contact Page Content</h1>

      {/* Loop through sections */}
      {Object.entries(contactContent).map(([section, data]) => (
        <div key={section} className="home-section">
          <h2>{section.toUpperCase()}</h2>

          {/* Loop through keys inside section */}
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="field-group">
              <label>{key.replace(/_/g, " ")}:</label>

              {/* For Google Maps iframe show textarea for better editing */}
              {key === "map_iframe" ? (
                <textarea
                  rows="4"
                  value={updatedContent[section]?.[key] || ""}
                  onChange={(e) => handleChange(section, key, e.target.value)}
                />
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

export default AdminContact;
