import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";

// components
import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
