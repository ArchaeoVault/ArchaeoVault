import React, { useState } from 'react';
import './ForgotPassword.css';
import Header from "./Header";
import Footer from "./Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset for:", email);
  };

  return (
    <>
      <Header />
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2>Reset Password</h2>
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
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Save Password</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;