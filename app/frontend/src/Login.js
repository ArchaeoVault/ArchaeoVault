import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Header from './Header';
import Footer from './Footer';


const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login successful!');
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
