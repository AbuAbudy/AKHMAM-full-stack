import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Donate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Donate() {
  const [donateData, setDonateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    reason: '',
    email: '',
    screenshot: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/donate`)
      .then(res => {
        setDonateData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error('Failed to load donation data.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'screenshot' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.name || !formData.amount || !formData.reason) {
      toast.error('Please fill all required fields.');
      setSubmitting(false);
      return;
    }

    const postData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) postData.append(key, val);
    });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/donate/submit-proof`, postData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message);
      setFormData({ name: '', amount: '', reason: '', email: '', screenshot: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!donateData) return <p>Failed to load content.</p>;

  const { hero = {}, bankInfo = {}, cta = {}, donationProof = {} } = donateData;

  const parsedBanks = Object.entries(bankInfo).reduce((acc, [key, value]) => {
    const match = key.match(/^bank_(\d+)_(name|account_name|account_number|logo)$/);
    if (match) {
      const [_, id, field] = match;
      if (!acc[id]) acc[id] = {};
      acc[id][field] = value;
    }
    return acc;
  }, {});

  return (
    <div className="donate-page">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Hero Section */}
      <section
        className="donate-hero"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_API_URL}${hero.background_image}?v=${Date.now()})`
        }}
      >
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </section>

      {/* Bank Info */}
      <section className="bank-info">
        <h2>Donate via Bank Transfer</h2>
        <ul>
          {Object.entries(parsedBanks).map(([id, bank]) => (
            <li key={id}>
              {bank.logo && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${bank.logo}?v=${Date.now()}`}
                  alt={bank.name}
                  width={60}
                />
              )}
              <div>
                <h3>{bank.name}</h3>
                <p>Account Name: {bank.account_name}</p>
                <p>Account Number: {bank.account_number}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Donation Form */}
      <section className="donation-form-section">
        <h2>Donation Details</h2>
        {donationProof.instructions && (
          <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>{donationProof.instructions}</p>
        )}

        <form className="donation-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Name <span>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Amount Donated (ETB) <span>*</span></label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Reason / Purpose <span>*</span></label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Upload Screenshot (optional)</label>
            <input
              type="file"
              name="screenshot"
              accept="image/*"
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>

      {/* CTA Section */}
      <section className="donate-cta">
        <h3>{cta.heading}</h3>
        <p>{cta.paragraph}</p>
      </section>
    </div>
  );
}

export default Donate;