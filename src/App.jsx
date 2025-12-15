import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RoleLayout from "./RoleLayout";

// Login Page
import LoginPage from "./component/Login/LoginPage";

// Pages (Admin)
import Adashboard from "./pages/Admin/Adashboard";
import Ausermanage from "./pages/Admin/Ausermanage";
import Amaterial from "./pages/Admin/Amaterial";
import Asupplier from "./pages/Admin/Asupplier";
import Ainventory from "./pages/Admin/Ainventory";
import Aproduction from "./pages/Admin/Aproduction";
import Areport from "./pages/Admin/Areport";
import Aalert from "./pages/Admin/Aalert";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LoginPage />} />

          <Route path="/adashboard" element={<ProtectedRoute role={["Admin","Manager","Staff"]}><RoleLayout allowedRoles={["Admin","Manager","Staff"]}><Adashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/ausermanage" element={<ProtectedRoute role={["Admin"]}><RoleLayout allowedRoles={["Admin"]}><Ausermanage /></RoleLayout></ProtectedRoute>} />
          <Route path="/amaterial" element={<ProtectedRoute role={["Admin","Manager","Staff"]}><RoleLayout allowedRoles={["Admin","Manager","Staff"]}><Amaterial /></RoleLayout></ProtectedRoute>} />
          <Route path="/asupplier" element={<ProtectedRoute role={["Admin"]}><RoleLayout allowedRoles={["Admin"]}><Asupplier /></RoleLayout></ProtectedRoute>} />
          <Route path="/aproduction" element={<ProtectedRoute role={["Admin","Manager","Staff"]}><RoleLayout allowedRoles={["Admin","Manager","Staff"]}><Aproduction /></RoleLayout></ProtectedRoute>} />
          <Route path="/ainventory" element={<ProtectedRoute role={["Admin","Manager","Staff"]}><RoleLayout allowedRoles={["Admin","Manager","Staff"]}><Ainventory /></RoleLayout></ProtectedRoute>} />
          <Route path="/areport" element={<ProtectedRoute role={["Admin","Manager"]}><RoleLayout allowedRoles={["Admin","Manager"]}><Areport /></RoleLayout></ProtectedRoute>} />
          <Route path="/aalert" element={<ProtectedRoute role={["Admin","Manager","Staff"]}><RoleLayout allowedRoles={["Admin","Manager","Staff"]}><Aalert /></RoleLayout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
