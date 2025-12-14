import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role=[], children }) => {
  const { user, token, status } = useAuth();

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Not logged in or role mismatch
  if (!user || role.length > 0 && !role.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
