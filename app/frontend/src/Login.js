import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';
import Header from './Header';
import Footer from './Footer';

const clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with actual Google Client ID

const Login = ({ setIsAuthenticated, redirectPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    navigate(redirectPath || '/'); // Redirect to home page after successful login
    alert('Login successful!');
  };

  const handleGoogleSuccess = (response) => {
    console.log('Google Sign-In Success:', response);
    setIsAuthenticated(true);
    navigate(redirectPath || '/'); // Redirect to home page after successful login
    alert('Google Sign-In successful!');
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
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
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
