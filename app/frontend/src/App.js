import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import Login from "./Login";
import Signup from './Signup';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import NewportArtifacts from './NewportArtifacts';
import PortsmouthArtifacts from './PortsmouthArtifacts';
import Artifacts from './Artifacts';
import Artifacts2 from './Artifacts2';
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import ListPage from "./list";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
   <Router>
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/about" element={<AboutUs />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/artifacts" element={<Artifacts />} />
       <Route path="/Artifacts2" element={<Artifacts2 />} />
       <Route path="/list" element={<ListPage />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset/:uidb64/:token" element={<ResetPassword />} />
       <Route path="/newport-artifacts" element={<NewportArtifacts />} />
       <Route path="/portsmouth-artifacts" element={<PortsmouthArtifacts />} />
       <Route path="/" element={showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />} />
     </Routes>
   </Router>
  );
};

export default App;