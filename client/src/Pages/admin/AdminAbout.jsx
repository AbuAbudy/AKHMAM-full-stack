import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminHome.css';
import { FaSun, FaMoon, FaPlus, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminAbout() {
  const [aboutContent, setAboutContent] = useState({});
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [whatWeDoList, setWhatWeDoList] = useState([]);
  const [coreValuesList, setCoreValuesList] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchContent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/about', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAboutContent(res.data);
        setUpdatedContent(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching about content:', err);
        toast.error('Failed to fetch about content');
      }
    };

    const fetchLists = async () => {
      try {
        const [whatRes, coreRes] = await Promise.all([
          axios.get('http://localhost:5000/api/about/list/whatWeDo', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/about/list/coreValues', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setWhatWeDoList(whatRes.data);
        setCoreValuesList(coreRes.data);
        setLoadingLists(false);
      } catch (err) {
        console.error('Error fetching list items:', err);
        toast.error('Failed to fetch list items');
      }
    };

    fetchContent();
    fetchLists();

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
        [key]: value,
      },
    }));
  };

  const handleFileChange = (section, key, file) => {
    setUpdatedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: file,
      },
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
      const res = await axios.put('http://localhost:5000/api/about', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message || 'Section updated!');
    } catch (error) {
      console.error(error);
      toast.error('Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdating(prev => ({ ...prev, [section]: false }));
    }
  };

  const addListItem = async (section) => {
    const token = localStorage.getItem('token');
    const newValue = window.prompt('Enter new item text:');
    if (!newValue) return;

    try {
      await axios.post(`http://localhost:5000/api/about/list/${section}`, { value: newValue }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Item added');
      await refreshList(section);
    } catch (error) {
      toast.error('Failed to add item: ' + (error.response?.data?.error || error.message));
    }
  };

  const updateListItem = async (section, id, newValue) => {
    if (!newValue) {
      toast.error('Value cannot be empty');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/about/list/item/${id}`, { value: newValue }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Item updated');
      await refreshList(section);
    } catch (error) {
      toast.error('Failed to update item: ' + (error.response?.data?.error || error.message));
    }
  };

  const deleteListItem = (section, id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5000/api/about/list/item/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                  });
                  toast.success('Item deleted');
                  await refreshList(section);
                  closeToast();
                } catch (error) {
                  toast.error('Failed to delete item: ' + (error.response?.data?.error || error.message));
                }
              }}
              style={{
                padding: '5px 10px',
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{
                padding: '5px 10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const refreshList = async (section) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/about/list/${section}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (section === 'whatWeDo') setWhatWeDoList(res.data);
      else if (section === 'coreValues') setCoreValuesList(res.data);
    } catch (err) {
      console.error('Error refreshing list:', err);
    }
  };

  if (loading || loadingLists) return <p>Loading about content...</p>;

  return (
    <div className="admin-home-container">
      <ToastContainer />
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage About Page Content</h1>

      {Object.entries(aboutContent).map(([section, data]) => {
        if (section === 'whatWeDo' || section === 'coreValues') return null;
        return (
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
                        <img src={`http://localhost:5000/${value}`} alt={key} width="200" />
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
        );
      })}

      <ListSection
        title="What We Do"
        items={whatWeDoList}
        section="whatWeDo"
        onAdd={addListItem}
        onUpdate={updateListItem}
        onDelete={deleteListItem}
      />

      <ListSection
        title="Core Values"
        items={coreValuesList}
        section="coreValues"
        onAdd={addListItem}
        onUpdate={updateListItem}
        onDelete={deleteListItem}
      />
    </div>
  );
}

function ListSection({ title, items, section, onAdd, onUpdate, onDelete }) {
  return (
    <div className="home-section">
      <h2>{title}</h2>
      <button className="add-item-button" onClick={() => onAdd(section)}>
        <FaPlus /> Add Item
      </button>
      {items.length === 0 && <p>No items yet.</p>}
      {items.map(({ id, value }) => (
        <ListItemEditor
          key={id}
          id={id}
          section={section}
          value={value}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function ListItemEditor({ id, section, value, onUpdate, onDelete }) {
  const [text, setText] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleBlur = async () => {
    if (text.trim() === '') {
      toast.error('Value cannot be empty.');
      setText(value);
      return;
    }
    if (text !== value) {
      setSaving(true);
      await onUpdate(section, id, text);
      setSaving(false);
    }
  };

  return (
    <div className="list-item-editor">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        disabled={saving}
      />
      <button
        className="delete-item-button"
        onClick={() => onDelete(section, id)}
        disabled={saving}
        title="Delete item"
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default AdminAbout;