import React from 'react';
import './Header.css';

const Header = ({ setShowLogin }) => {
  return (
    <div className="header">
      {/* Header Section */}
      <header className="header">
        <div className="logo">ArchaeoVault</div>
        <nav className="nav-links">
          <a href="#artifacts">Artifacts</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
          <a href="#about">About Us</a>
          <button onClick={() => setShowLogin(true)}>Login</button>
          <a href="#search" className="search-button">Search</a>
        </nav>
      </header>
    </div>
  );
};

export default Header;
