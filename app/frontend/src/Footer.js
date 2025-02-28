import React from 'react';
import './Footer.css';

const Footer = ({ setShowLogin }) => {
  return (
    <div className="footer">
      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>ArchaeoVault</h2>
            <address>
              320 Washington Street<br />
              North Easton, MA 02357
            </address>
            <a href="mailto:email@example.com">email@example.com</a>
            <br />
            <a href="tel:+15555555555">(555) 555-5555</a>
          </div>
          <div className="footer-section">
            <h3>Hours</h3>
            <p>Monday – Friday</p>
            <p>9am – 5pm</p>
          </div>
          <div className="footer-section">
            <h3>Follow</h3>
            <a href="#">Facebook</a>
            <br />
            <a href="#">Instagram</a>
            <br />
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
