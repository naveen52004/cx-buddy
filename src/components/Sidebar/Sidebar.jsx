import React from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back button
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-[rgb(0,23,43)] text-white shadow-lg z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 sm:translate-x-0 sm:relative sm:w-16 flex flex-col px-4 py-6`}
      >
        {/* Back Button - Mobile Only */}
        <div className="flex justify-start sm:hidden mb-4">
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 text-white hover:text-[#db3700] transition"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Top Section */}
        <div className="space-y-4">
          <SidebarButton
            onClick={() => navigate("/dashboard")}
            icon={<img src="/dashboard.png" alt="Dashboard" className="w-6 h-6" />}
          />
          <SidebarButton
            onClick={() => navigate("/chat")}
            icon={<ChatBubbleOutlineIcon />}
          />
          <SidebarButton icon={<HelpOutlineIcon />} />
          <SidebarButton icon={<HistoryIcon />} />
        </div>

        <div className="flex-grow"></div>

        {/* Bottom Section */}
        <div className="space-y-2">
          <SidebarButton icon={<SettingsIcon />} />
          <div className="relative group flex justify-center items-center">
            <img src="/kapImg.svg" alt="kap logo" className="w-8 h-8" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Kapture-CX
            </span>
          </div>
        </div>
      </div>

      {/* Backdrop - Mobile Only */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
        />
      )}
    </>
  );
};

const SidebarButton = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center rounded-lg hover:bg-[#db3700] cursor-pointer p-2 w-full"
  >
    {icon}
  </button>
);

export default Sidebar;
