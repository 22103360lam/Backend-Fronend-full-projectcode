import React, { useState } from 'react'
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#6C5CE7] font-bold text-[#ffffff] hover:bg-[#5949D5]"
      : "font-semibold text-[#000000] hover:bg-[#5949D5]";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Toggle Button (Only for small screens) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 bg-[#083885] text-white p-2 rounded-md md:hidden z-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#ffffff] border-r z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:transform-none`}>

        {/* Close Button (only for mobile) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-[#083885] text-2xl font-bold hover:text-red-600">
          ✕
        </button>

        {/* PMS Logo Section (match manager nav) */}
        <div className="flex items-center justify-start px-5 text-[#083885] font-bold text-lg border-b bg-[#ffffff]" style={{height: '68px'}}>
          <div className="flex-shrink-0 flex items-center justify-center px-2">
            <img
              src="/asset/pms_Image_3t8ovs3t8ovs3t8o-removebg-preview.png"
              alt="PMS Logo"
              className="h-16 w-auto object-contain max-w-none"
              style={{maxHeight: '60px'}}
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4 text-[#374151] text-base overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/sdashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/sdashboard")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-dashboard-svgrepo-com.svg" alt="Dashboard" className="w-5 h-5" />
            </div>
            <span>Dashboard</span>
          </Link>

          {/* Raw Materials */}
          <Link
            to="/amaterial"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/smaterial")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-box-minimalistic-svgrepo-com.svg" alt="Raw Materials" className="w-5 h-5" />
            </div>
            <span>Raw Materials</span>
          </Link>

          {/* Production */}
          <Link
            to="/aproduction"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/aproduction")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-production-factory-svgrepo-com.svg" alt="Production" className="w-5 h-5" />
            </div>
            <span>Production</span>
          </Link>

          {/* Inventory */}
          <Link
            to="/ainventory"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/ainventory")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-inventor-1-svgrepo-com.svg" alt="Inventory" className="w-5 h-5" />
            </div>
            <span>Inventory</span>
          </Link>

          {/* Alerts */}
          <Link
            to="/aalert"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/aalert")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-ring-svgrepo-com.svg" alt="Alerts" className="w-5 h-5" />
            </div>
            <span>Alerts</span>
          </Link>
        </nav>
      </aside>
    </div>
  )
}
