import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import Header from './Header';
import Footer from './Footer';
import Cookies from 'js-cookie'; 

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.REACT_APP_URL}/api/`;} else {
  backend_url = 'http://localhost:8000/api/';
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(backend_url + 'get_csrf_token/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.csrfToken) {
          Cookies.set('csrftoken', data.csrfToken);
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = Cookies.get('csrftoken');
    if (!token) {
      alert('CSRF token is missing. Please try again.');
      return;
    }
  
    const { firstName, lastName, email, password, confirmPassword } = formData;
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    if (password.toLowerCase() === "password") {
      alert('Password cannot be "password".');
      return;
    }
  
    if (/^\d+$/.test(password)) {
      alert('Password cannot be all numbers.');
      return;
    }
  
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
  
    if (password.toLowerCase() === firstName.toLowerCase()) {
      alert('Password cannot be the same as your first name.');
      return;
    }
  
    try {
      const response = await fetch(backend_url + 'create_user/', {
        method: 'POST',
        credentials: 'include',
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
      });
  
      if (response.ok) {
        alert('Sign up successful! Please log in.');
        navigate('/login');  // 🔄 redirect to login
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

          {/* Password Requirements Box */}
          <div className="password-rules">
            <h4>Password Requirements</h4>
            <ul>
              <li>Must be at least 8 characters</li>
              <li>Cannot be "password"</li>
              <li>Cannot be all numbers</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="First Name" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              maxLength={50} 
              required 
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              maxLength={50} 
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
              maxLength={50}
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              maxLength={50}
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
