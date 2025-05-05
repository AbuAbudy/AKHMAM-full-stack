import React from 'react';
import heroImage from '../assets/banner.jpg';
import bank1Logo from '../../src/assets/logo/bank1.jpg';
import bank2Logo from '../../src/assets/logo/bank2.png';
import bank3Logo from '../../src/assets/logo/bank3.jpg';
import '../styles/Donate.css';

function Donate() {
  return (
    <div className="donate-page">
      <section
        className="donate-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1>Support AKHMAM</h1>
        <p>“The best of people are those who are most beneficial to others.” — Prophet Muhammad (ﷺ)</p>
      </section>

      <section className="bank-info">
        <h2>Donate via Bank Transfer</h2>
        <ul>
          <li>
            <img src={bank1Logo} alt="CBE" />
            <div>
              <h3>Commercial Bank of Ethiopia</h3>
              <p>Account Name: AKHMAM Foundation</p>
              <p>Account Number: 100023456789</p>
            </div>
          </li>
          <li>
            <img src={bank2Logo} alt="Bank of Abyssinia" />
            <div>
              <h3>Bank of Abyssinia</h3>
              <p>Account Name: AKHMAM Foundation</p>
              <p>Account Number: 200045678901</p>
            </div>
          </li>
          <li>
            <img src={bank3Logo} alt="Dashen Bank" />
            <div>
              <h3>Dashen Bank</h3>
              <p>Account Name: AKHMAM Foundation</p>
              <p>Account Number: 300056789012</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="donation-form-section">
        <h2> Donation Details</h2>
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

      <section className="donate-cta">
        <h3>Your generosity makes a difference</h3>
        <p>
          Every birr you give supports dawah, education, and those in need.
          May Allah reward you abundantly.
        </p>
      </section>
    </div>
  );
}

export default Donate;