import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/AdminHome.css";
import { FaSun, FaMoon } from "react-icons/fa";

function AdminContact() {
  const [contactContent, setContactContent] = useState({});
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

  const fetchContent = () => {
    axios
      .get("`${import.meta.env.VITE_API_URL}/api/contact")
      .then((res) => {
        setContactContent(res.data);
        setUpdatedContent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contact content:", err);
        toast.error("Failed to load content.");
      });
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

  const handleUpdateSection = async (section) => {
    setUpdating((prev) => ({ ...prev, [section]: true }));
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contact/${section}`,
        updatedContent[section],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Section updated!");
      setContactContent((prev) => ({
        ...prev,
        [section]: { ...updatedContent[section] },
      }));
    } catch (error) {
      console.error(error);
      toast.error("Update failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleDelete = async (key) => {
    toast.info("Deleting message...");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/contact/message/${key}`);
      toast.success("Message deleted");
      fetchContent();
    } catch (error) {
      toast.error("Failed to delete message");
      console.error(error);
    }
  };

  if (loading) return <p>Loading contact content...</p>;

  return (
    <div className="admin-home-container">
      <ToastContainer />
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Contact Page Content</h1>

      {Object.entries(contactContent).map(([section, data]) => {
        if (section === "messages") {
          return (
            <div key={section} className="home-section">
              <h2>{section.toUpperCase()}</h2>
              <MessagesList messages={data.list || []} onDelete={handleDelete} />
            </div>
          );
        }

        return (
          <div key={section} className="home-section">
            <h2>{section.toUpperCase()}</h2>

            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="field-group">
                <label>{key.replace(/_/g, " ")}:</label>
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
        );
      })}
    </div>
  );
}

function MessagesList({ messages, onDelete }) {
  return (
    <div className="admin-messages-container">
      {messages.map((msg) => (
        <MessageCard key={msg.key} msg={msg} onDelete={onDelete} />
      ))}
    </div>
  );
}

function MessageCard({ msg, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;

  const isLong = msg.message.length > maxLength;
  const displayedMsg = expanded
    ? msg.message
    : msg.message.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div className="message-card">
      <h3>{msg.fullName}</h3>
      <p><strong>Email:</strong> {msg.email}</p>
      <p><strong>Subject:</strong> {msg.subject}</p>
      <p>
        <strong>Message:</strong> {displayedMsg}
        {isLong && (
          <button
            className="readmore-button"
            onClick={() => setExpanded(!expanded)}
            style={{
              marginLeft: "8px",
              cursor: "pointer",
              border: "none",
              background: "none",
              color: "#007bff",
            }}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
      <p><strong>Date:</strong> {new Date(Number(msg.key)).toLocaleString()}</p>
      <button className="delete-button" onClick={() => onDelete(msg.key)}>
        Delete
      </button>
    </div>
  );
}

export default AdminContact;
