import React from 'react';
import './Footer.css';

const Footer = () => {
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
            <a href="mailto:auhl@stonehill.edu">auhl@stonehill.edu</a>
            <br />
          </div>
          <div className="footer-section">
            <h3>Hours</h3>
            <p>Monday – Friday</p>
            <p>9am – 5pm</p>
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Footer;
