import React from 'react'

export default function Header() {
  return (
    <div>
       <header className="flex items-center justify-end px-4 md:px-6 py-3.5 bg-[#8acff9]">

      {/* User and Notifications */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <button className="text-[#ffffff] hover:text-gray-800 relative">
          <img src="asset/notifications_24dp_1E40AF_FILL0_wght400_GRAD0_opsz24 (1).svg" alt="Bell Icon" className="h-6 w-6 md:h-8 md:w-8"/>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 items-center justify-center text-white text-[9px]">1</span>
          </span>
        </button>

        <button className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">AD</div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">Admin User</div>
            <div className="text-xs text-[#374151]">Administrator</div>
          </div>
        </button>
      </div>
    </header>
    </div>
  )
}
