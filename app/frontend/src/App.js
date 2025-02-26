import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";


const App = () => {

  return (
    <Router> {/* Wrap the entire app in Router */}
      <div>
        <Header /> {/* Include the Header to have the logo with navigation */}
        <Routes> 
          {/* Define the routes for each page */}
          <Route path="/" element={<HomePage/>} />  {/* Homepage route */}
          <Route path="/login" element={<Login />} /> {/* Login page route */}
        </Routes>
      </div>
    </Router>
  );

};

export default App;
