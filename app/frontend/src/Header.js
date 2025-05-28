import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.DJANGO_ALLOWED_HOST_1}/api/`;}
else{ backend_url = 'http://localhost:8000/api/';}

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [permission, setPermission] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsLoggedIn(auth);

    const fetchPermission = async () => {
      try {
        const response = await fetch(backend_url + 'user_permission/', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user permission');
        }

        const data = await response.json();
        const userPermission = data.upermission || 0; // Assuming the API returns { upermission: 1 }
        setPermission(userPermission);
      } catch (error) {
        console.error(error);
        setPermission(0); // Default to 0 if there's an error
      }
    };

    if (auth) {
      fetchPermission();
    }
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
    setPermission(0);
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
        {permission === 1 && (
          <Link to="/admin-page" onClick={toggleHamburger} className="admin-link">
            Admin Page
          </Link>
        )}
      </nav>

      <nav className="nav-links">
        <Link to="/Artifacts">Artifacts</Link>
        <Link to="/Artifacts2">3D Scans</Link>
        <Link to="/About">About Us</Link>
        {permission === 1 && (
          <Link to="/admin-page" onClick={toggleHamburger} className="admin-link">
            Admin Page
          </Link>
        )}
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
