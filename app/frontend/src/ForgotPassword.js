import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import Header from "./Header";
import Footer from "./Footer";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token when the component loads
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
    const response = await fetch(backend_url+'resend_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
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