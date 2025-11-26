import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create Context
const AuthContext = createContext();

// Hook
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [expiry, setExpiry] = useState(localStorage.getItem("token_expiry") || null);
    const [status, setStatus] = useState("Inactive"); //  add status state

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("token_expiry");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setExpiry(storedExpiry);
       setStatus("Active"); // set status on load
      setupAutoLogout(storedExpiry);
      fetchUser(storedToken);
    }
  }, []);

  // Fetch user data from backend
  const fetchUser = async (authToken) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Fetch user error:", error);
      logout();
    }
  };

  // Login function
  const login = (authToken, userData, expiresAt) => {
    setToken(authToken);
    setUser(userData);
    setStatus("Active");  //  login → active
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    if (expiresAt) {
      setExpiry(expiresAt);
      localStorage.setItem("token_expiry", expiresAt);
      setupAutoLogout(expiresAt);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setStatus("Inactive"); // logout → inactive
    setExpiry(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
    navigate("/"); // redirect to login page
  };

  // Auto logout
  const setupAutoLogout = (expiryTime) => {
    const expiryDate = expiryTime ? new Date(expiryTime) : null;
    if (!expiryDate) return;

    const timeout = expiryDate - new Date();
    if (timeout <= 0) {
      logout(); // already expired
      return;
    }

    setTimeout(() => {
      alert("Session expired. Please login again.");
      logout();
    }, timeout);
  };

  return (
    <AuthContext.Provider value={{ user, token, status,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
