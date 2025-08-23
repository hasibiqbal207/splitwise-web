import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import configData from "./config/config.json";

import LogoOnlyLayout from "./components/layouts/LogoOnlyLayout";

//Pages
import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Page404 from "./components/Page404.jsx";
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
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path={configData.USER_DELETED_URL} element={<UserDeleted />} />
        </Route>
        <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/userProfile" element={<Profile />} />
          <Route path="/dashboard/groups" element={<Group />} />
          
          <Route path="/dashboard/addExpense/:groupId" element={<AddExpense />} />
          <Route path="/dashboard/editExpense/:expenseId" element={<EditExpense />} />
          <Route path="/dashboard/viewExpense/:expenseId" element={<ViewExpense />} />

          <Route path="/dashboard/createGroup" element={<CreateGroup />} />
          <Route path="/dashboard/groups/view/:groupId" element={<ViewGroup />} />
          <Route path="/dashboard/groups/edit/:groupId" element={<EditGroup />} />

        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
