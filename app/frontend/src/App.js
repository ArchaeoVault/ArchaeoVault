import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  const PrivateRoute = ({ element }) => {
    const location = useLocation();
    if (!isAuthenticated) {
      setRedirectPath(location.pathname);
      return <Navigate to="/login" />;
    }
    return element;
    // return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
   <Router>
     <Routes>
       <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} redirectPath={redirectPath} />} />
       <Route path="/about" element={<AboutUs />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/artifacts" element={<Artifacts />} />
       <Route path="/Artifacts2" element={<Artifacts2 />} />
       <Route path="/list" element={<ListPage />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset/:uidb64/:token" element={<ResetPassword />} />
       <Route path="/newport-artifacts" element={<PrivateRoute element={<NewportArtifacts />} />} />
       <Route path="/portsmouth-artifacts" element={<PrivateRoute element={<PortsmouthArtifacts />} />} />
       <Route path="/" element={showLogin ? <Login setIsAuthenticated={setIsAuthenticated} /> : <HomePage setShowLogin={setShowLogin} />} />
     </Routes>
   </Router>
  );
};

export default App;