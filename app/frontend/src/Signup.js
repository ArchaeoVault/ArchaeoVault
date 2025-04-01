import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import Header from './Header';
import Footer from './Footer';
import Cookies from 'js-cookie'; 

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

const Signup = () => {
  const navigate = useNavigate(); // React Router's hook for navigation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [csrfToken, setCsrfToken] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if CSRF token is in cookies :)
    let token = Cookies.get('csrftoken');
    console.log('Initial CSRF Token:', token);

    // If token isn't in cookies, fetch it from the server
    if (!token) {
      try {
        const response = await fetch(backend_url+'get_csrf_token/');
        const data = await response.json();
        token = data.csrfToken;
        console.log('Fetched CSRF Token from server:', token); 
        Cookies.set('csrftoken', token);  // Set CSRF token in cookies
        setCsrfToken(token);  // Set CSRF token in component state
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        alert('Error fetching CSRF token');
        return;
      }
    } else {
      // If CSRF token is found in cookies, set it in state
      setCsrfToken(token);
    }

    // Proceed with form submission if token is available
    if (!csrfToken && !token) {
      alert('CSRF token is not available. Please try again.');
      return;
    }

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
      const response = await fetch(backend_url+'create_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': token,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: confirmPassword
        }),
        credentials: 'include',
      });
    
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
    
        const fullName = `${formData.firstName} ${formData.lastName}`;
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userName', fullName);
    
        alert('Sign up successful!');
        navigate('/artifacts'); // Force redirect so header updates properly
      } else {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        alert('Error: ' + errorText);
      }
    } catch (error) {
      console.error('There was an error during sign up:', error);
      alert('Error: Something went wrong.');
    }
    
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
