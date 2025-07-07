import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminHome.css";
import { FaSun, FaMoon, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminVolunteer() {
  const [volunteerContent, setVolunteerContent] = useState({});
  const [applications, setApplications] = useState([]);
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);
  const [deletingKey, setDeletingKey] = useState(null);

  useEffect(() => {
    fetchContent();
    fetchApplications();
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

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await axios.get("http://localhost:5000/api/volunteers/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
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
      toast.success(res.data.message || "Section updated!");
      await fetchContent();
    } catch (error) {
      console.error(error);
      toast.error("Update failed: " + (error.response?.data?.error || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleDeleteApplication = async (key) => {
    toast.info("Deleting application...", { autoClose: 1000 });
    setDeletingKey(key);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/volunteers/applications/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Application deleted successfully.");
      await fetchApplications();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete application.");
    } finally {
      setDeletingKey(null);
    }
  };

  if (loading) return <p>Loading volunteer content...</p>;

  return (
    <div className="admin-home-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Volunteer Page Content</h1>

      {Object.entries(volunteerContent).map(([section, data]) => {
        if (section === "application") return null; // ✅ REMOVE 'application' section
        return (
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
        );
      })}

      {/* Volunteer Applications Section */}
      <div className="home-section" style={{ marginTop: "2rem" }}>
        <h2>Volunteer Applications</h2>
        {loadingApps ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications submitted yet.</p>
        ) : (
          applications.map((app) => {
            const submittedDate = new Date(app.timestamp);
            const formattedDate = submittedDate.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return (
              <div
                key={app.key}
                style={{
                  border: darkMode ? "1px solid #ddd" : "1px solid #333",
                  padding: "12px",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#222" : "#fafafa",
                  color: darkMode ? "#eee" : "#111",
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <p><strong>Name:</strong> {app.name}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Phone:</strong> {app.phone}</p>
                <p><strong>Interest:</strong> {app.interest}</p>
                <p><strong>Message:</strong> {app.message || "(No message)"}</p>
                <p><strong>Submitted:</strong> {formattedDate}</p>
                <button
                  onClick={() => handleDeleteApplication(app.key)}
                  disabled={deletingKey === app.key}
                  style={{
                    backgroundColor: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {deletingKey === app.key ? "Deleting..." : <><FaTrash /> Delete</>}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminVolunteer;