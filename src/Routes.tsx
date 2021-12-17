import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Users from "./views/Users";
import Dashboard from "./views/Dashboard";
import Companies from "./views/Companies";
import Packages from "./views/Packages";
import Channels from "./views/Channels";
import Customers from "./views/Customers";

type Props = Record<string, never>;

const AppRoutes: React.FC<Props> = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/channels" element={<Channels />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
};

export default AppRoutes;
