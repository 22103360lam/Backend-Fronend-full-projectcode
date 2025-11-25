import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/" replace />; // Not logged in
  if (role && user.role !== role) return <Navigate to="/" replace />; // Wrong role

  return children;
}
