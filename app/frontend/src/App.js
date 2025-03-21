import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Signup from './Signup';
import Artifacts2 from './Artifacts2';
import List from './list';


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
   <Router>
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/artifacts" element={<List />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/" element={showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />} />
     </Routes>
   </Router>
  );
};

export default App;
