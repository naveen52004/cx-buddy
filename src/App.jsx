import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import Dashboard from "./components/Dashboard/Dashboardchart";
import Topbar from "./components/Topbar";
import Chat from "./components/Chat";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar fixed at the top */}
          <Topbar />
          {/* Scrollable content below Topbar */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
