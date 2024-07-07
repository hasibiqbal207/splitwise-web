import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import configData from "./config/config.json";

import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Profile from "./components/profile";
import Group from "./components/groups";
import CreateGroup from "./components/groups/CreateGroup.jsx";
import ViewGroup from "./components/groups/viewGroup/index.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard/userProfile" element={<Profile />} />
        <Route path={configData.USER_GROUPS_URL} element={<Group />} />
        <Route path={configData.CREATE_GROUP_URL} element={<CreateGroup />} />
        <Route path={configData.VIEW_GROUP_ROUTER_URL} element={<ViewGroup />} />
      
      </Routes>
    </Router>
  );
};

export default AppRoutes;
