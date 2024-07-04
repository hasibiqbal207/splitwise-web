import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";

import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Profile from "./components/profile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard/userProfile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
