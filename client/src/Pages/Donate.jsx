import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Donate.css';

function Donate() {
  const [donateData, setDonateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/donate')
      .then((response) => {
        setDonateData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching donate data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!donateData) return <p>Failed to load content.</p>;

  const { hero, bankInfo, cta } = donateData;

  return (
    <div className="donate-page">
      {/* Hero Section */}
      <section
        className="donate-hero"
        style={{
          backgroundImage: `url(${hero.background_image})`,
        }}
      >
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </section>

      {/* Bank Info Section */}
      <section className="bank-info">
        <h2>Donate via Bank Transfer</h2>
        <ul>
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <img
                src={bankInfo[`bank_${i}_logo`]}
                alt={bankInfo[`bank_${i}_name`]}
              />
              <div>
                <h3>{bankInfo[`bank_${i}_name`]}</h3>
                <p>Account Name: {bankInfo[`bank_${i}_account_name`]}</p>
                <p>Account Number: {bankInfo[`bank_${i}_account_number`]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Donation Form (static) */}
      <section className="donation-form-section">
        <h2>Donation Details</h2>
        <form className="donation-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Name<span>*</span></label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>Amount Donated (ETB)<span>*</span></label>
            <input type="number" name="amount" required />
          </div>
          <div className="form-group">
            <label>Reason / Purpose of Donation<span>*</span></label>
            <textarea name="reason" required />
          </div>
          <div className="form-group">
            <label>Email (optional)</label>
            <input type="email" name="email" />
          </div>
          <button type="submit">Submit</button>
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
