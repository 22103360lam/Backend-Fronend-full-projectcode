import React, { useState } from 'react'
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation();
    // sidebar khola ase kina 
  const [sidebarOpen, setSidebarOpen] = useState(false); 

   //  current path pai 
  const isActive = (path) =>
    location.pathname === path ? "bg-[#6C5CE7] font-bold text-[#ffffff] hover:bg-[#5949D5]  " : "font-semibold text-[#000000] hover:bg-[#5949D5] hover:text-[#ffffff]";
  
//  sidebar on off task
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Mobile Toggle Button - Outside sidebar */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#083885] text-white p-2 rounded-md shadow-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-[#ffffff] border-r transform transition-transform duration-300 ease-in-out flex flex-col z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:transform-none`}>
        
        {/* Close Button (only for mobile) - Inside sidebar */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-[#083885] text-2xl font-bold hover:text-red-600">
          ✕
        </button>
        
             <div className="flex items-center justify-start px-5 text-[#083885] font-bold text-lg border-b bg-[#ffffff]" style={{height: '68px'}}>
  {/* Logo Section */}
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
            to="/adashboard" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/adashboard")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-dashboard-svgrepo-com.svg" alt="Dashboard" className="w-5 h-5"/>
            </div>
            <span>Dashboard</span>
          </Link>
          
          {/* User Management */}
          <Link 
            to="/ausermanage" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/ausermanage")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-users-group-rounded-svgrepo-com.svg" alt="User Management" className="w-5 h-5"/>
            </div>
            <span>User Management</span>
          </Link>
          
          {/* Raw Materials */}
          <Link 
            to="/amaterial" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/amaterial")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-box-minimalistic-svgrepo-com.svg" alt="Raw Materials" className="w-5 h-5"/>
            </div>
            <span>Raw Materials</span>
          </Link>
          
          {/* Suppliers */}
          <Link 
            to="/asupplier" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/asupplier")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-supplier-buy-cart-ecommerce-svgrepo-com.svg" alt="Suppliers" className="w-5 h-5"/>
            </div>
            <span>Suppliers</span>
          </Link>
          
          {/* Production */}
          <Link 
            to="/aproduction" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/aproduction")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-production-factory-svgrepo-com.svg" alt="Production" className="w-5 h-5"/>
            </div>
            <span>Production</span>
          </Link>
          
          {/* Inventory */}
          <Link 
            to="/ainventory" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/ainventory")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-inventor-1-svgrepo-com.svg" alt="Inventory" className="w-5 h-5"/>
            </div>
            <span>Inventory</span>
          </Link>
          
          {/* Reports */}
          <Link 
            to="/areport" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/areport")}`}>
            <div className="w-5 h-5">
              <img src="/asset/nav-report-list-svgrepo-com.svg" alt="Reports" className="w-5 h-5"/>
            </div>
            <span>Reports</span>
          </Link>
          
          {/* Alerts */}
          <Link 
            to="/aalert" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md  ${isActive("/aalert")}`}>
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
