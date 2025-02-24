import React from "react";
import './Homepage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
        <div className="logo">ArchaeoVault</div>
        <nav className="nav-links">
          <a href="#artifacts">Artifacts</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
          <a href="#about">About Us</a>
          <a href="#login">Login</a>
          <a href="#search" className="search-button">Search</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image">
          <img
            src="/placeholder.jpg"
            alt="Artifact Display"
          />
        </div>
        <div className="hero-content">
          <h1>Explore the World of Archaeology</h1>
          <p>
            Discover the hidden treasures of Portsmouth and Newport, RI! Explore detailed 3D models of archaeological artifacts and dive into their rich history, origins, and craftsmanship. Unearth the past and let history come to life at your fingertips.
          </p>
          <button className="learn-more">Learn more</button>
        </div>
      </section>

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

export default HomePage;