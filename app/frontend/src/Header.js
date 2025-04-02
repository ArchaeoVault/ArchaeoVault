import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const name = localStorage.getItem('userName');
    setIsLoggedIn(auth);
    setUserName(name || '');
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo">ArchaeoVault</Link>
      <nav className="nav-links">
        <Link to="/Artifacts">Artifacts</Link>
        <Link to="/Artifacts2">3D Scans</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/About">About Us</Link>

        {!isLoggedIn ? (
          <Link to="/Login" className="login-link">Login</Link>
        ) : (
          <div className="account-section" ref={dropdownRef}>
            <div className="account-bubble" onClick={toggleDropdown}>
              {userName.charAt(0).toUpperCase()}
            </div>
            {dropdownOpen && (
              <div className="account-dropdown">
                <p>Hi, {userName}!</p>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
