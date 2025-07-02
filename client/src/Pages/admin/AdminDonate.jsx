import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminHome.css';
import { FaSun, FaMoon, FaTrash } from 'react-icons/fa';

function AdminDonate() {
  const [donateContent, setDonateContent] = useState({});
  const [updatedContent, setUpdatedContent] = useState({});
  const [updating, setUpdating] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [donationProofs, setDonationProofs] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    fetchContent();
    const mode = localStorage.getItem('mode') || 'light';
    setDarkMode(mode === 'dark');
    document.body.classList.add(`${mode}-mode`);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donate');
      const data = res.data;
      setDonateContent(data);
      setUpdatedContent(data);
      setLoading(false);

      // Parse donation proofs
      if (data.donationProof) {
        const proofs = Object.entries(data.donationProof)
          .filter(([key]) => key.startsWith('proof_'))
          .map(([key, value]) => {
            try {
              const obj = JSON.parse(value);
              return { ...obj, key };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        setDonationProofs(proofs);
      } else {
        setDonationProofs([]);
      }

      // Parse bank accounts
      if (data.bankInfo) {
        const accountsMap = {};
        Object.entries(data.bankInfo).forEach(([key, value]) => {
          const match = key.match(/^bank_(\d+)_(.+)$/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!accountsMap[index]) accountsMap[index] = {};
            accountsMap[index][field] = value;
          }
        });
        const accountsArray = Object.keys(accountsMap)
          .map(Number)
          .sort((a, b) => a - b)
          .map((i) => accountsMap[i]);
        setBankAccounts(accountsArray);
      } else {
        setBankAccounts([]);
      }
    } catch (err) {
      console.error('Error fetching donate content:', err);
      setLoading(false);
    }
  };

  const toggleNightMode = () => {
    const isDark = document.body.classList.contains('dark-mode');
    document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
    document.body.classList.add(isDark ? 'light-mode' : 'dark-mode');
    localStorage.setItem('mode', isDark ? 'light' : 'dark');
    setDarkMode(!isDark);
  };

  // General text change handler for dynamic sections
  const handleChange = (section, key, value) => {
    setUpdatedContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // File change handler for dynamic sections (e.g. images)
  const handleFileChange = (section, key, file) => {
    setUpdatedContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: file,
      },
    }));
  };

  // Bank accounts change handlers
  const handleBankAccountChange = (index, field, value) => {
    setBankAccounts((prev) => {
      const newAccounts = [...prev];
      newAccounts[index] = { ...newAccounts[index], [field]: value };
      return newAccounts;
    });
  };

  const handleBankAccountFileChange = (index, file) => {
    setBankAccounts((prev) => {
      const newAccounts = [...prev];
      newAccounts[index] = { ...newAccounts[index], logoFile: file };
      return newAccounts;
    });
  };

  const addBankAccount = () => {
    setBankAccounts((prev) => [
      ...prev,
      { name: '', account_name: '', account_number: '', logo: '', logoFile: null },
    ]);
  };

  const deleteBankAccount = (index) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      setBankAccounts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Delete donation proof from backend
  const deleteDonationProof = async (key) => {
    if (!key) return alert('Invalid proof key.');
    if (!window.confirm('Are you sure you want to delete this donation proof?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/donate/proof/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Donation proof deleted.');
      await fetchContent();
    } catch (err) {
      console.error(err);
      alert('Failed to delete donation proof.');
    }
  };

  // Update general sections (non-bankInfo)
  const handleUpdateSection = async (section) => {
    setUpdating((prev) => ({ ...prev, [section]: true }));
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('section', section);

    const sectionData = updatedContent[section] || {};
    Object.entries(sectionData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axios.put('http://localhost:5000/api/donate', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message || `${section} updated!`);
      await fetchContent();
    } catch (error) {
      console.error(error);
      alert('Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, [section]: false }));
    }
  };

  // Update bank info section
  const handleUpdateBankInfo = async () => {
    setUpdating((prev) => ({ ...prev, bankInfo: true }));
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('section', 'bankInfo');

    bankAccounts.forEach((account, idx) => {
      const bankIndex = idx + 1;
      formData.append(`bank_${bankIndex}_name`, account.name || '');
      formData.append(`bank_${bankIndex}_account_name`, account.account_name || '');
      formData.append(`bank_${bankIndex}_account_number`, account.account_number || '');

      if (account.logoFile instanceof File) {
        formData.append(`bank_${bankIndex}_logo`, account.logoFile);
      } else if (account.logo) {
        formData.append(`bank_${bankIndex}_logo`, account.logo);
      } else {
        formData.append(`bank_${bankIndex}_logo`, '');
      }
    });

    try {
      const res = await axios.put('http://localhost:5000/api/donate', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(res.data.message || 'Bank info updated!');
      await fetchContent();
    } catch (error) {
      console.error(error);
      alert('Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdating((prev) => ({ ...prev, bankInfo: false }));
    }
  };

  if (loading) return <p>Loading donate content...</p>;

  return (
    <div className="admin-home-container">
      <button className="night-toggle" onClick={toggleNightMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1>Manage Donate Page Content</h1>

      {/* Dynamic sections except bankInfo & donationProof */}
      {Object.entries(donateContent).map(([section, data]) => {
        if (section === 'bankInfo' || section === 'donationProof') return null;
        return (
          <div key={section} className="home-section">
            <h2>{section.toUpperCase()}</h2>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="field-group">
                <label>{key}:</label>
                {(key.toLowerCase().includes('image') || key.toLowerCase().includes('logo')) ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(section, key, e.target.files[0])}
                    />
                    {typeof value === 'string' && value.startsWith('/') && (
                      <div style={{ marginTop: '8px' }}>
                        <small>Current:</small>
                        <br />
                        <img
                          src={`http://localhost:5000${value}?v=${Date.now()}`}
                          alt={key}
                          width="200"
                          style={{ borderRadius: '6px', border: '1px solid #ccc' }}
                        />
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

      {/* Bank Info Section */}
      <div className="home-section">
        <h2>BANK INFO</h2>
        {bankAccounts.length === 0 && <p>No bank accounts configured.</p>}
        {bankAccounts.map((account, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <h3>Bank Account #{idx + 1}</h3>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => deleteBankAccount(idx)}
                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <FaTrash /> Delete Bank #{idx + 1}
              </button>
            </div>
            <div className="field-group">
              <label>Name:</label>
              <input
                type="text"
                value={account.name || ''}
                onChange={(e) => handleBankAccountChange(idx, 'name', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Account Name:</label>
              <input
                type="text"
                value={account.account_name || ''}
                onChange={(e) => handleBankAccountChange(idx, 'account_name', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Account Number:</label>
              <input
                type="text"
                value={account.account_number || ''}
                onChange={(e) => handleBankAccountChange(idx, 'account_number', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Logo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBankAccountFileChange(idx, e.target.files[0])}
              />
              {/* Show current logo if no new file selected */}
              {account.logo && !account.logoFile && (
                <div style={{ marginTop: '8px' }}>
                  <small>Current:</small>
                  <br />
                  <img
                    src={`http://localhost:5000${account.logo}?v=${Date.now()}`}
                    alt={`Bank ${idx + 1} logo`}
                    width="150"
                    style={{ borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
              {/* Preview new logo file */}
              {account.logoFile && (
                <div style={{ marginTop: '8px' }}>
                  <small>New Preview:</small>
                  <br />
                  <img
                    src={URL.createObjectURL(account.logoFile)}
                    alt={`Bank ${idx + 1} new logo preview`}
                    width="150"
                    style={{ borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <button onClick={addBankAccount} style={{ marginBottom: '20px' }}>
          + Add Bank Account
        </button>
        <br />
        <button
          className="update-button"
          onClick={handleUpdateBankInfo}
          disabled={updating.bankInfo}
        >
          {updating.bankInfo ? 'Updating...' : 'Update Bank Info'}
        </button>
      </div>

      {/* Donation Proofs Section */}
      <div className="home-section">
        <h2>Donation Proofs</h2>
        {donationProofs.length === 0 ? (
          <p>No donation proofs submitted yet.</p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Amount (ETB)</th>
                <th>Reason</th>
                <th>Email</th>
                <th>Timestamp</th>
                <th>Screenshot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationProofs.map((proof, index) => (
                <tr key={index}>
                  <td>{proof.name || '-'}</td>
                  <td>{proof.amount || '-'}</td>
                  <td>{proof.reason || '-'}</td>
                  <td>{proof.email || '-'}</td>
                  <td>{proof.timestamp ? new Date(proof.timestamp).toLocaleString() : '-'}</td>
                  <td>
                    {proof.screenshot ? (
                      <a
                        href={`http://localhost:5000${proof.screenshot}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to view full image"
                      >
                        <img
                          src={`http://localhost:5000${proof.screenshot}?v=${Date.now()}`}
                          alt="Proof Screenshot"
                          width="100"
                          style={{ borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
                        />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteDonationProof(proof.key)}
                      style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDonate;