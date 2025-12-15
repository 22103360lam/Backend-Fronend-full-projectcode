import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";  // AuthContext use

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); //  AuthContext login function and logoout function  

  // Validation function
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?8801|01)[3-9]\d{8}$/;

    if (!identifier) {
      errors.identifier = "Email or phone is required.";
    } else if (
      !emailRegex.test(identifier) &&
      !phoneRegex.test(identifier) &&
      isNaN(identifier) === false &&
      identifier.length < 6
    ) {
      errors.identifier = "Enter a valid email or Bangladeshi phone number.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { identifier, password },
        { withCredentials: true }
      );

      console.log("Login success:", response.data);

      //  Save token + user + expires_at to AuthContext
      login(response.data.token, response.data.user, response.data.expires_at);

      // Role-based redirect
      const role = response.data.role;
      if (role === "Admin") navigate("/adashboard");
      else if (role === "Manager") navigate("/adashboard");
      else if (role === "Staff") navigate("/adashboard");
      else alert("Role not recognized");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to your account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Identifier Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Email or Phone
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.identifier ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="you@example.com or 017xxxxxxx"
              required
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="••••••••"
              required
              minLength={8}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}