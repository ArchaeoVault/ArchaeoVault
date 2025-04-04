import React, { useState, useEffect } from "react";
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
import AdminPage from "./AdminPage"

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  // Move PrivateRoute component inside Router to ensure useLocation() works properly
  const PrivateRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Check authentication state
    const location = useLocation(); // Move useLocation inside PrivateRoute

    // useEffect(() => {
    //   if (!isAuthenticated && location.pathname !== '/login') {
    //     setRedirectPath(location.pathname);  // Keep track of the attempted location
    //   }
    // }, [location]);  // Only depend on location

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* Login route with redirectPath */}
        {/* <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} redirectPath={redirectPath} />} /> */}

        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Other routes */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/artifacts" element={<Artifacts />} />
        <Route path="/Artifacts2" element={<Artifacts2 />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:uidb64/:token" element={<ResetPassword />} />
        
        {/* Private routes with authentication check */}
        <Route path="/newport-artifacts" element={<PrivateRoute element={<NewportArtifacts />} />} />
        <Route path="/portsmouth-artifacts" element={<PrivateRoute element={<PortsmouthArtifacts />} />} />
        <Route path="/adminpage" element={<PrivateRoute element={<AdminPage />} />} />
        
        {/* Default route: show login or homepage */}
        {/* <Route path="/" element={showLogin ? <Login setIsAuthenticated={setIsAuthenticated} /> : <HomePage setShowLogin={setShowLogin} />} /> */}

        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;


