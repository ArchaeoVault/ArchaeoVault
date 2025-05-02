import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*const [userName, setUserName] = useState('');*/
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    /*const name = localStorage.getItem('userName');*/
    setIsLoggedIn(auth);
    /*setUserName(name || '');*/
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setHamburgerOpen(false); // Automatically close the hamburger menu on larger screens
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    setIsLoggedIn(false);
    /*setUserName('');*/
    navigate('/login');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`header ${hamburgerOpen ? 'blur' : ''}`}>
      <Link to="/" className="logo">ArchaeoVault</Link>
      <div className="hamburger" onClick={toggleHamburger}>
        {hamburgerOpen ? (
          <div className="close-btn">✕</div> /* Close button */
        ) : (
          <>
            <div className="line"></div>
            <div className="line"></div>
          </>
        )}
      </div>

      <nav className={`nav-links-mobile ${hamburgerOpen ? 'open' : ''}`}>
        <Link to="/Artifacts" onClick={toggleHamburger}>Artifacts</Link>
        <Link to="/Artifacts2" onClick={toggleHamburger}>3D Scans</Link>
        <Link to="/About" onClick={toggleHamburger}>About Us</Link>

        {!isLoggedIn ? (
          <Link to="/Login" className="login-link" onClick={toggleHamburger}>Login</Link>
        ) : (
          <div className="account-section" ref={dropdownRef}>
            <div className="account-bubble" onClick={toggleDropdown}>
              <img src="/profile_bubble.jpg" alt="Profile" className="profile-img" />
            </div>
            {dropdownOpen && (
              <div className="account-dropdown">
                <p>Welcome!</p>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <nav className="nav-links">
        <Link to="/Artifacts">Artifacts</Link>
        <Link to="/Artifacts2">3D Scans</Link>
        <Link to="/About">About Us</Link>

        {!isLoggedIn ? (
          <Link to="/Login" className="login-link">Login</Link>
        ) : (
          <div className="account-section" ref={dropdownRef}>
            <div className="account-bubble" onClick={toggleDropdown}>
              <img src="/profile_bubble.jpg" alt="Profile" className="profile-img" />
            </div>
            {dropdownOpen && (
              <div className="account-dropdown">
                <p>Welcome!</p>
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
