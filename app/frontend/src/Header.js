import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // Add a state to store the search input
  const [isOpen, setIsOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('blur', !isOpen);
  };

  // // Handle change in the search input
  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  // // Handle form submission for the search
  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   // Add your search logic here (e.g., redirect to search results page or filter data)
  //   alert(`Searching for: ${searchQuery}`);
  // };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
        document.body.classList.remove('blur');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <header className="header">
      <Link to="/" className="logo">ArchaeoVault</Link>
      <nav className={`nav-links ${isOpen ? 'nav-links-mobile open' : ''}`}>
      <span className="close-btn" onClick={toggleMenu}>&times;</span>
      {/* <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search..." 
            className="search-input" 
          />
          <button type="submit" className="search-button">Search</button>
        </form> */}
        
        <Link to="/Artifacts">Artifacts</Link>
        <Link to="/Artifacts2" className="Artifacts2">3D Scans</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/About">About Us</Link>
        <Link to="/Login" className="login-link">Login</Link>
        {/* <Link to="/list" className="list">List/Filter</Link> */}
      </nav>
        
        {/* Search bar */}
        {/* <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search..." 
            className="search-input" 
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </nav> */}
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default Header;

