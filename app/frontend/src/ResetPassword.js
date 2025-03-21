import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPassword.css';
import Header from "./Header";
import Footer from "./Footer";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const response = await fetch(`/reset/${uidb64}/${token}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_password: newPassword }),
    });
    if (response.ok) {
      setMessage('Your password has been reset successfully.');
    } else {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <>
      <Header />
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h2>Set New Password</h2>
          <form onSubmit={handleSubmit}>
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
          {message && <p>{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;