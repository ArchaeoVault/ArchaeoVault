import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';
import Header from './Header';
import Footer from './Footer';
import Cookies from 'js-cookie';

const clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with actual Google Client ID

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();    
  
    // Check if CSRF token is in cookies
    let token = Cookies.get('csrftoken');
    console.log('Initial CSRF Token:', token);
  
    // If token isn't in cookies, fetch it from the server
    if (!token) {
      try {
        const response = await fetch('http://localhost:8000/get-csrf-token/');
        const data = await response.json();
        token = data.csrfToken;
        console.log('Fetched CSRF Token from server:', token); 
        Cookies.set('csrftoken', token);  // Set CSRF token in cookies
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        alert('Error fetching CSRF token');
        return;
      }
    }
  
    // If CSRF token is not found at this point, show alert
    if (!token) {
      alert('CSRF token is not available.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': token, // Pass CSRF token directly from cookies
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensure cookies are sent with the request
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        window.location.href = '/home'; // Redirect to home page or desired URL
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in.');
    }
  };
  

  const handleGoogleSuccess = (response) => {
    console.log('Google Sign-In Success:', response);
    // Here you can send the Google response to your backend for authentication
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failure:', error);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
          </form>

          <div className="google-login-container">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                width="100%"
                size="medium"
                theme="outline"
                type="standard"
                logo_alignment="left"
                shape="pill"
                text="signin_with"
              />
            </GoogleOAuthProvider>
          </div>

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

