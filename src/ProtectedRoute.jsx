import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, status } = useAuth();

  // Only redirect if user is not loaded and status inactive
  if (!user && status !== "Active") return <Navigate to="/" />; 

  // If role is required, check role
  if (role && user?.role !== role) return <Navigate to="/" />; 

  return children;
};

export default ProtectedRoute;
