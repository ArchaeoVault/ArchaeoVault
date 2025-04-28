import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import Header from './Header';
import Footer from './Footer';

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const Login = () => {
  //const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate(); // React Router's hook for navigation
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Redirect to the page user was trying to access before login, or default to '/'

  // Fetch CSRF token when the component loads
  /*useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(backend_url+'get_csrf_token/', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are included
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.elements[0].value;
    const password = form.elements[1].value;
    const csrfToken = getCookie('csrftoken');
    try {
      const response = await fetch(backend_url+'login/', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 'ok') {
        alert('Login successful!');
        
        localStorage.setItem('isAuthenticated', true); // Store authentication status
        /*localStorage.setItem('isAdmin', email === 'archaeovault77@gmail.com'); // Check if the user is an admin*/
        console.log(result.user.upermission);
        navigate('/artifacts'); // Redirect to the homepage
      } else {
        alert(result.message); // Show error message from the backend
      }
    } catch (error) {
      //console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Log In</button>
          </form>
          <div className="toggle-text">
            Don't have an account?{' '}
            <Link to="/signup" className="toggle-link">
              Sign Up
            </Link>
          </div>
          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Login;