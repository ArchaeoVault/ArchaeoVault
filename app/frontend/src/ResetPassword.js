import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPassword.css';
import Header from "./Header";
import Footer from "./Footer";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
  
    const getEmailFromToken = async () => {
      try {
        const response = await fetch(`${backend_url}get_email_from_token/${uidb64}/${token}/`);
  
        const data = await response.json();
        setEmail(data.email);
  
      } catch (error) {
        console.error('Failed to fetch email:', error);
      }
    };
  
    getEmailFromToken();
  }, []);
  
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(backend_url+'get_csrf_token/', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are included
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const response = await fetch(backend_url+`change_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ email: email, newPassword: newPassword, confirmPassword: confirmPassword }),
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