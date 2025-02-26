import React, { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
>>>>>>> 63ddfaa7eadd65eb8152e7b29aa1f77b8bd7264d
import './Login.css';
import Header from './Header';
import Footer from './Footer';


const clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with your actual Google Client ID

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log(isLogin ? "Logging in..." : "Signing up...");
=======
    if (isSignup) {
      alert('Sign up successful!');
    } else {
      alert('Login successful!');
    }
  };

  const handleGoogleSuccess = (response) => {
    console.log('Google Sign-In Success:', response);
    // Handle user authentication with response.credential or response.tokenId
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failure:', error);
>>>>>>> 63ddfaa7eadd65eb8152e7b29aa1f77b8bd7264d
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
                <input type="email" placeholder="Email" required />
              </>
            )}
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
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
                id="googleSignInButton"
                style={{ display: 'none' }}
              />
            </GoogleOAuthProvider>
          </div>

          <div className="toggle-text">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <span className="toggle-link" onClick={handleToggle}>
              {isSignup ? 'Log In' : 'Sign Up'}
            </span>
<<<<<<< HEAD
          </p>
          {isLogin && (
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          )}
=======
          </div>
>>>>>>> 63ddfaa7eadd65eb8152e7b29aa1f77b8bd7264d
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;