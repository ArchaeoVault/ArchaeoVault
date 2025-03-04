import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Signup from './Signup';


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
   <Router>
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/" element={showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />} />
     </Routes>
   </Router>
  );
};

export default App;
