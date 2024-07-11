import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import configData from "./config/config.json";

import LogoOnlyLayout from "./components/layouts/LogoOnlyLayout";

//Pages
import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Page404 from "./components/Page404";
import DashboardLayout from "./components/layouts/index.jsx";
import Profile from "./components/profile";
import UserDeleted from "./components/profile/UserDeleted";
import Group from "./components/groups";
import CreateGroup from "./components/groups/CreateGroup.jsx";
import ViewGroup from "./components/groups/viewGroup/index.jsx";
import AddExpense from "./components/expense/AddExpense";
import Dashboard from "./components/dashboard";
import { ViewExpense } from "./components/expense/ViewExpense";
import EditExpense from "./components/expense/EditExpense";
import { EditGroup } from "./components/groups/EditGroup";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogoOnlyLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path={configData.USER_DELETED_URL} element={<UserDeleted />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard/app" element={<Dashboard />} />
          <Route path="/dashboard/userProfile" element={<Profile />} />
          <Route path="/dashboard/groups" element={<Group />} />
          
          <Route path="/dashboard/addExpense/:groupId" element={<AddExpense />} />
          <Route path="/dashboard/editExpense/:expenseId" element={<EditExpense />} />
          <Route path="/dashboard/viewExpense/:expenseId" element={<ViewExpense />} />

          <Route path="/dashboard/createGroup" element={<CreateGroup />} />
          <Route path="/dashboard/groups/view/:groupId" element={<ViewGroup />} />
          <Route path="/dashboard/groups/edit/:groupId" element={<EditGroup />} />

          <Route path="/dashboard/userProfile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
