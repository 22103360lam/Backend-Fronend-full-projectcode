import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, token, status } = useAuth();

  // Still loading state → don't redirect yet
  if (token && !user) {
    return <div>Loading...</div>; // or a spinner UI
  }

  // No user → redirect login
  if (!user) return <Navigate to="/" />;

  // Role check (if role provided)
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
