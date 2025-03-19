import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // Add a state to store the search input
  const [searchQuery, setSearchQuery] = useState('');

  // Handle change in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle form submission for the search
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Add your search logic here (e.g., redirect to search results page or filter data)
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">ArchaeoVault</Link>
      <nav className="nav-links">
        <Link to="/Artifacts">Artifacts</Link>
        <a href="#timeline">Timeline</a>
        <a href="#contact">Contact</a>
        <Link to="/About">About Us</Link>
        <Link to="/Login">Login</Link>
        
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search..." 
            className="search-input" 
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </nav>
    </header>
  );
};

export default Header;

