import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Styles/AdminHome.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminHome() {
  const [homeContent, setHomeContent] = useState({});
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/home`)
      .then((res) => {
        setHomeContent(res.data);
        setUpdatedContent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching home content:', err);
        toast.error('Failed to load home content.');
      });

    const mode = localStorage.getItem('mode') || 'light';
    setDarkMode(mode === 'dark');
    document.body.classList.add(`${mode}-mode`);
  }, []);

  const toggleNightMode = () => {
    const isDark = document.body.classList.contains('dark-mode');
    document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
    document.body.classList.add(isDark ? 'light-mode' : 'dark-mode');
    localStorage.setItem('mode', isDark ? 'light' : 'dark');
    setDarkMode(!isDark);
  };

  const handleChange = (section, key, value) => {
    setUpdatedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleFileChange = (section, key, file) => {
    setUpdatedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: file
      }
    }));
  };

  const handleUpdateSection = async (section) => {
    setUpdating(prev => ({ ...prev, [section]: true }));
    const token = localStorage.getItem('token');
    const updates = updatedContent[section];
    const formData = new FormData();
    formData.append('section', section);

    for (const key in updates) {
      formData.append(key, updates[key]);
    }

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/home`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(res.data.message || 'Section updated!');
    } catch (error) {
      console.error(error);
      toast.error('Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdating(prev => ({ ...prev, [section]: false }));
    }
  };

  if (loading) return <p>Loading home content...</p>;

  return (
    <div className="admin-home-container">
      <ToastContainer />
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Home Page Content</h1>

      {Object.entries(homeContent).map(([section, data]) => (
        <div key={section} className="home-section">
          <h2>{section.toUpperCase()}</h2>

          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="field-group">
              <label>{key}:</label>
              {key.toLowerCase().includes('image') ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(section, key, e.target.files[0])}
                  />
                  {value && typeof value === 'string' && (
                    <div style={{ marginTop: '8px' }}>
                      <small>Current:</small><br />
                      <img src={`${import.meta.env.VITE_API_URL}/${value}`} alt={key} width="200" />
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={updatedContent[section]?.[key] || ''}
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
            {updating[section] ? 'Updating...' : `Update ${section}`}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminHome;