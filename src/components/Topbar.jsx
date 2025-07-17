import React from "react";
import { Bell, Menu, ChevronDown, Shield } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-white shadow-sm px-4 py-5 flex items-center justify-between">
      {/* Left Side - Dashboard Title */}
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      {/* Right Side - Icons and Controls */}
      <div className="flex items-center space-x-4">
        {/* KM Portal */}
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-800">KM Portal</span>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            X
          </span>
        </div>

        {/* Status Toggle - Not Available */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Not Av...</span>
        </div>

        {/* User/Company Name with Dropdown */}
        <div className="flex items-center space-x-1 cursor-pointer">
          <span className="text-sm font-medium text-gray-800">Snapdeal</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>

        {/* Hamburger Menu */}
        <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Topbar;
