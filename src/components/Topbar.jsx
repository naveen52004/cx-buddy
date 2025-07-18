// Topbar.jsx
import React from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left: Button + Title */}
      <div className="flex items-center space-x-2">
        {/* Back Button - Mobile Only */}
        <button
          onClick={() => navigate(-1)} // Navigate back
          className="sm:hidden flex items-center justify-center rounded-md p-1 text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeftIcon fontSize="small" />
        </button>



        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        {/* Bell Icon */}
        <div className="relative hidden sm:block">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            X
          </span>
        </div>

        {/* User Dropdown */}
        <div className="hidden md:flex items-center space-x-1">
          <span className="text-sm text-gray-800">Snapdeal</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;