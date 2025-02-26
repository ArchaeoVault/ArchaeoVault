import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Homepage";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  // return (
  //   <div>
  //     {showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />}
  //   </div>
  // );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
