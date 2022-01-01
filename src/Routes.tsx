import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./views/Login";
import Users from "./views/Users";
import Dashboard from "./views/Dashboard";
import Companies from "./views/Companies";
import Packages from "./views/Packages";
import Channels from "./views/Channels";
import Customers from "./views/Customers";
import { StoreState } from "./actions/types";

type Props = Record<string, never>;

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: StoreState) => state.authReducer);
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

const AppRoutes: React.FC<Props> = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route
        path="/companies"
        element={
          <RequireAuth>
            <Companies />
          </RequireAuth>
        }
      />
      <Route
        path="/packages"
        element={
          <RequireAuth>
            <Packages />
          </RequireAuth>
        }
      />
      <Route
        path="/channels"
        element={
          <RequireAuth>
            <Channels />
          </RequireAuth>
        }
      />
      <Route
        path="/customers"
        element={
          <RequireAuth>
            <Customers />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
