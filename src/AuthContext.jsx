import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

//  Create Context
const AuthContext = createContext();

//  Hook for easy usage
export const useAuth = () => useContext(AuthContext);

//  AuthProvider
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [expiry, setExpiry] = useState(localStorage.getItem("token_expiry") || null);

  // Load user data if token exists
  useEffect(() => {
    if (token) {
      fetchUser();
      setupAutoLogout();
    }
  }, [token, expiry]);

  // Fetch user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      logout(); // invalid token → logout
    }
  };

  // Login function
  const login = (token, userData, expiresAt) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);

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
    setExpiry(null);
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
  };

  // Auto logout setup
  const setupAutoLogout = (expiryTime) => {
    const expiryDate = expiryTime ? new Date(expiryTime) : new Date(expiry);
    const timeout = expiryDate - new Date();

    if (timeout > 0) {
      setTimeout(() => {
        logout();
        alert("Session expired. Please login again.");

          // Auto logout setup
  const setupAutoLogout = (expiryTime) => {
    const expiryDate = expiryTime ? new Date(expiryTime) : new Date(expiry);
    const timeout = expiryDate - new Date();

    if (timeout > 0) {
      setTimeout(() => {
        logout(); // already expired
        alert("Session expired. Please login again.");
      }, timeout);
    } else {
      logout();// already expired
       navigate("/"); // redirect to login 
    }
  };

      }, timeout);
    } else {
      logout();// already expired
       navigate("/"); // redirect to login 
    }
  };
  

  // Provide context
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
