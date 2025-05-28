import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './ResetPassword.css';
import Header from "./Header";
import Footer from "./Footer";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.DJANGO_ALLOWED_HOST_1}/api/`;} else {
  backend_url = 'http://localhost:8000/api/';
}
const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState('');
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

  useEffect(() => {
    if (!csrfToken) return;
    const getEmailFromToken = async () => {
      try {
        const response = await fetch(`${backend_url}get_email_from_token/${uidb64}/${token}/`, {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include the CSRF token in the request header
          },
        });
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Failed to fetch email, response not OK');
        }
        
        const data = await response.json();
        console.log('Email retrieved from token:', data.email); // Log to check the response
    
        if (data.email) {
          setEmail(data.email);
        } else {
          throw new Error('Email not found in the response');
        }
      } catch (error) {
        console.error('Failed to fetch email:', error);
        setMessage('Invalid or expired token. Please try again.');
      }
    };
    
  
    getEmailFromToken();
  }, [csrfToken, token, uidb64]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // const response = await fetch(backend_url+`change_password/`, {
      const response = await fetch(backend_url+`change_password/${uidb64}/${token}/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ email: email, newPassword: newPassword, confirmPassword: confirmPassword }),
    });
    if (response.ok) {
      alert('Your password has been reset successfully.');
      setRedirectToLogin(true);
    } else {
      const data = await response.json();
      setMessage(data.error || 'Failed to reset password.');
      }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }
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