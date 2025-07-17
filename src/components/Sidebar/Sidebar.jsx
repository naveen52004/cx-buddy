import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed sm:relative z-10 left-0 h-screen w-16 bg-[rgb(0,23,43)] text-white shadow-md flex flex-col px-2 py-4">
      {/* Top Section with manual padding */}
      <div className="mt-18 space-y-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center rounded-lg hover:bg-[#db3700] cursor-pointer p-2"
        >
          <img src="/dashboard.png" alt="dashboard" className="w-6 h-6" />
        </button>

        {/* <div className="flex items-center justify-center rounded-lg hover:bg-[#db3700] pl-4 cursor-pointer w-6 h-6">
          <ChatBubbleOutlineIcon  />
        </div> */}
      </div>

      {/* Spacer to push Bottom Section */}
      <div className="flex-grow"></div>

      {/* Bottom Section */}
      <div className="space-y-2 mb-4">
        {/* <SidebarItem icon={<SettingsIcon fontSize="small" />} /> */}

        {/* Kapture Logo with Tooltip */}
        <div className="relative group flex justify-center items-center">
          <img src="/kapImg.svg" alt="kap logo" className="w-auto" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Kapture-CX
          </span>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon }) => (
  <div className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer">
    {icon}
  </div>
);

export default Sidebar;
