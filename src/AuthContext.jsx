import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { attachInterceptor } from "./Api"; // Api.jsx connected

// AuthProvider: manages current user, token storage, session expiry and automatic logout
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [expiry, setExpiry] = useState(null);
  const [status, setStatus] = useState("Inactive");

  const logoutTimeout = useRef(null);

  // Attach interceptor for 401 auto logout
  useEffect(() => {
    if (token) attachInterceptor(logout);
  }, [token]);

  // Load saved session on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("token_expiry");

    if (storedUser && storedToken && storedExpiry) {
      const expiryDate = new Date(storedExpiry);
      const now = new Date();

      // Only restore if token not expired
      if (expiryDate > now) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setExpiry(expiryDate);
        setStatus("Active");
        setupAutoLogout(expiryDate);
      } else {
        // Remove old expired data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_expiry");
      }
    }
  }, []);

  // Fetch user from backend
  const fetchUser = async () => {
    try {
      const res = await api.get("/user"); // token auto attach
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      logout(); // token expired or invalid
    }
  };

  // Login
  const login = (authToken, userData, expiresAt) => {
    setToken(authToken);
    setUser(userData);
    setStatus("Active");

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      setExpiry(expiryDate);
      localStorage.setItem("token_expiry", expiryDate.toString());
      setupAutoLogout(expiryDate);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setStatus("Inactive");
    setExpiry(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");

    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    navigate("/"); // redirect to login
  };

  // Auto logout timer
  const setupAutoLogout = (expiryDate) => {
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    const timeLeft = expiryDate - new Date();
    console.log("Session expires in ms:", timeLeft); // debug timer

    if (timeLeft <= 0) return logout();

    // Safety margin of 1 second
    const safeTime = timeLeft - 1000 > 0 ? timeLeft - 1000 : 0;

    logoutTimeout.current = setTimeout(() => {
      alert("Session expired, please login again.");
      logout();
    }, safeTime);
  };

  return (
    <AuthContext.Provider value={{ user, token, status, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
