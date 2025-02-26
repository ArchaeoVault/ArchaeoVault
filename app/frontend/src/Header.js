import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
    {/* Header Section */}
      <Link to="/">ArchaeoVault</Link>
      <nav className="nav-links">
        <a href="#artifacts">Artifacts</a>
        <a href="#timeline">Timeline</a>
        <a href="#contact">Contact</a>
        <a href="#about">About Us</a>
        <Link to="/login"><button>Login</button></Link>
        <a href="#search" className="search-button">Search</a>
      </nav>
    </header>
  );
};

export default Header;
