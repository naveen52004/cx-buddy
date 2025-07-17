import React from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import UpdateIcon from "@mui/icons-material/Update";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

// ... your existing imports ...
import DashboardCharts from "../Dashboard/Dashboardchart";

const Main = () => {
  const [activeTab, setActiveTab] = useState("actions"); // 'actions' or 'dashboard'

  return (
    <div className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto flex flex-col justify-between min-h-screen">
      {/* Top Header - unchanged */}
      <div>
        <div className="flex justify-between items-center mb-10 relative">
          <h1 className="text-3xl font-bold text-gray-800 text-center w-full">
            CX Buddy
          </h1>
          <div className="absolute right-0">
            <AccountCircleIcon className="text-gray-600" fontSize="large" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-4 py-2 rounded-l-lg ${
              activeTab === "actions"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Quick Actions
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-r-lg ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "actions" ? (
          <>
            {/* Greeting Section */}
            <div className="text-center mb-12">
              <p className="text-2xl text-gray-700 mb-1">
                Hello, <span className="font-semibold">Dev</span>
              </p>
              <p className="text-lg text-gray-500">How can I help you today?</p>
            </div>

            {/* Horizontal Action Cards */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <ActionCard
                title="Add/Delete Employee"
                icon={<PersonAddAlt1Icon className="text-blue-600" />}
              />
              <ActionCard
                title="View Pending Tickets"
                icon={<PendingActionsIcon className="text-orange-500" />}
              />
              <ActionCard
                title="Update Employee Data"
                icon={<UpdateIcon className="text-green-600" />}
              />
              <ActionCard
                title="Assign/Reassign Tickets"
                icon={<AssignmentIndIcon className="text-purple-600" />}
              />
            </div>
          </>
        ) : (
          <DashboardCharts />
        )}
      </div>

      {/* Prompt Bar - unchanged */}
      <div className="mt-6 w-full">
        {/* ... existing prompt bar code ... */}
      </div>
    </div>
  );
};

const ActionCard = ({ title, icon }) => (
  <div className="flex items-center justify-between p-5 w-64 bg-gray-50 rounded-2xl hover:shadow-md transition-all cursor-pointer border">
    <p className="text-gray-800 font-medium text-sm w-40">{title}</p>
    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-sm">
      {icon}
    </div>
  </div>
);

export default Main;
