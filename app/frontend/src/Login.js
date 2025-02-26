// Updated Login.js with Google Sign-In placed under 'Forgot Password?'
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';
import Header from './Header';
import Footer from './Footer';

const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth Client ID

const Login = () => {
  const handleGoogleSuccess = (response) => {
    console.log('Google Sign-In Success:', response);
    // Handle user authentication with the response.tokenId
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failure:', error);
  };

  return (
    <>
    <Header />
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <p className="forgot-password">Forgot Password?</p>
        <div className="google-login-container">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </GoogleOAuthProvider>
        </div>
        <p className="toggle-text">
          Don't have an account?
          <span className="toggle-link">Sign Up</span>
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
