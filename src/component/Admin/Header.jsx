import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.name || user?.email || 'User';
  const roleLabel = user?.role || 'User';
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <header className="flex items-center justify-end px-4 md:px-6 py-3.5 bg-[#ffffff] relative">
        {/* User and Notifications */}
        <div className="flex items-center space-x-4 md:space-x-6">

        

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-800">{displayName}</div>
                <div className="text-sm font-semibold text-gray-500">{roleLabel}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
