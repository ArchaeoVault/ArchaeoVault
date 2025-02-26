import React, { useState } from 'react';
import './Login.css';
import Header from "./Header";
import Footer from "./Footer";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Insert your authentication logic here
    console.log(isLogin ? "Logging in..." : "Signing up...");
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input type="text" placeholder="Full Name" required />
            )}
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            {!isLogin && (
              <input type="password" placeholder="Confirm Password" required />
            )}
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span className="toggle-link" onClick={toggleMode}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
          <p className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Login;
