import React, { useState } from 'react';
import './ForgotPassword.css';
import Header from "./Header";
import Footer from "./Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/password_reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage('A password reset link has been sent to your email.');
    } else {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2>Forgot Your Password?</h2>

          <p>Enter your email address below and we'll send you a link to reset your password.</p>
          <br />
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Link</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;