import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Signup.css';
import Header from './Header';
import Footer from './Footer';
import Cookies from 'js-cookie'; 

const clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with actual Google Client ID

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [csrfToken, setCsrfToken] = useState(null); 

  useEffect(() => {
    // Attempt to fetch CSRF token if not present in cookies
    let token = Cookies.get('csrftoken');
    console.log('Initial CSRF Token:', token);
    if (!token) {
      fetch('http://127.0.0.1:8000/get-csrf-token/')
        .then((response) => response.json())
        .then((data) => {
          token = data.csrfToken;
          console.log('Fetched CSRF Token from server:', token); 
          Cookies.set('csrftoken', token); 
          setCsrfToken(token);
        })
        .catch((error) => console.error('Error fetching CSRF token:', error));
    } else {
      setCsrfToken(token);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Basic client-side validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/create_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,  // Pass CSRF token in headers
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        confirm_password: confirmPassword
      }),
      credentials: 'include',  // Ensure cookies are sent with the request
    });

    if (response.ok) {
      alert('Sign up successful!');
    } else {
      const errorData = await response.json();
      alert('Error: ' + (errorData.error || 'Something went wrong.'));
    }
  } catch (error) {
    console.error('There was an error during sign up:', error);
    alert('Error: Something went wrong.');
  }
};

  const handleGoogleSuccess = (response) => {
    console.log('Google Sign-In Success:', response);
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failure:', error);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
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
                text="signup_with"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="toggle-text">
            Already have an account?{' '}
            <Link to="/login" className="toggle-link">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
