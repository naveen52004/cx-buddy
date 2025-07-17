import React from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left Side - Dashboard Title with priority space */}
      <div className="flex-shrink-0 min-w-[100px] mr-2">
        <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
          Dashboard
        </h2>
      </div>

      {/* Right Side - Icons and Controls with flexible space */}
      <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4 overflow-hidden">
        {/* Notification Bell with Badge */}
        <div className="relative hidden sm:block flex-shrink-0">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            X
          </span>
        </div>

        {/* Status Toggle - Compact on mobile */}
        <div className="flex-shrink-0 flex items-center bg-gray-100 rounded-full px-2 py-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="ml-1 text-xs md:text-sm text-gray-600 hidden sm:inline">
            Not Available
          </span>
          <span className="ml-1 text-xs md:text-sm text-gray-600 sm:hidden">
            Off
          </span>
        </div>

        {/* User/Company Name - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-1 cursor-pointer flex-shrink-0">
          <span className="text-sm font-medium text-gray-800 truncate max-w-[100px]">
            Snapdeal
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>

        {/* Hamburger Menu - Always visible */}
        <Menu className="w-5 h-5 text-gray-600 cursor-pointer flex-shrink-0" />
      </div>
    </div>
  );
};

export default Topbar;
