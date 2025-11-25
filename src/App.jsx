import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./AuthContext"; // AuthProvider import
import ProtectedRoute from "./ProtectedRoute";  //  ProtectedRoute import

// LoginPage
import LoginPage from "./component/Login/LoginPage"; 

// Admin components
import Nav from "./component/Admin/Nav";
import Header from "./component/Admin/Header";

// Manager components
import Mnav from "./component/manager/Mnav";
import Mheader from "./component/manager/Mheader";  

// Staff components
import Snav from "./component/Staff/Snav";
import Sheader from "./component/Staff/Sheader";

// Admin pages
import Adashboard from "./pages/Admin/Adashboard";
import Ausermanage from "./pages/Admin/Ausermanage";
import Amaterial from "./pages/Admin/Amaterial";
import Asupplier from "./pages/Admin/Asupplier";
import Ainventory from "./pages/Admin/Ainventory";
import Aproduction from "./pages/Admin/Aproduction";
import Areport from "./pages/Admin/Areport";
import Aalert from "./pages/Admin/Aalert";

// Manager pages
import Mdashboard from "./pages/Manager/Mdashboard";
import Mmaterial from "./pages/Manager/Mmaterial";
import Mproduction from "./pages/Manager/Mproduction";
import Minventory from "./pages/Manager/Minventory";
import Mreport from "./pages/Manager/Mreport";
import Malert from "./pages/Manager/Malert";

// Staff pages
import Sdashboard from "./pages/Staff/Sdashboard";
import Smaterial from "./pages/Staff/Smaterial";  
import Sproduction from "./pages/Staff/Sproduction";
import Sinventory from "./pages/Staff/Sinventory";
import Salert from "./pages/Staff/Salert";

function App() {

  // Admin Layout
  function Admin({ children }) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans relative">
        <Nav />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          {children}
        </main>
      </div>
    );
  }

  // Manager Layout
  function Manager({ children }) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans relative">
        <Mnav />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Mheader />
          {children}
        </main>
      </div>
    );
  } 

  // Staff Layout
  function Staff({ children }) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans relative">
        <Snav />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Sheader />
          {children}
        </main>
      </div>
    );
  } 

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public/Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Admin Pages */}
          <Route
            path="/adashboard"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Adashboard /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ausermanage"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Ausermanage /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/amaterial"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Amaterial /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/asupplier"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Asupplier /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ainventory"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Ainventory /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aproduction"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Aproduction /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/areport"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Areport /></Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aalert"
            element={
              <ProtectedRoute role="Admin">
                <Admin><Aalert /></Admin>
              </ProtectedRoute>
            }
          />

          {/* Manager Pages */}
          <Route
            path="/mdashboard"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Mdashboard /></Manager>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mmaterial"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Mmaterial /></Manager>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mproduction"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Mproduction /></Manager>
              </ProtectedRoute>
            }
          />
          <Route
            path="/minventory"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Minventory /></Manager>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mreport"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Mreport /></Manager>
              </ProtectedRoute>
            }
          />
          <Route
            path="/malert"
            element={
              <ProtectedRoute role="Manager">
                <Manager><Malert /></Manager>
              </ProtectedRoute>
            }
          />

          {/* Staff Pages */}
          <Route
            path="/sdashboard"
            element={
              <ProtectedRoute role="Staff">
                <Staff><Sdashboard /></Staff>
              </ProtectedRoute>
            }
          />
          <Route
            path="/smaterial"
            element={
              <ProtectedRoute role="Staff">
                <Staff><Smaterial /></Staff>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sproduction"
            element={
              <ProtectedRoute role="Staff">
                <Staff><Sproduction /></Staff>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sinventory"
            element={
              <ProtectedRoute role="Staff">
                <Staff><Sinventory /></Staff>
              </ProtectedRoute>
            }
          />
          <Route
            path="/salert"
            element={
              <ProtectedRoute role="Staff">
                <Staff><Salert /></Staff>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
