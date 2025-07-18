import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardCharts = ({ apiResponse }) => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [savedDashboards, setSavedDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  const navigate = useNavigate();

  // Load saved dashboards from localStorage
  useEffect(() => {
    const loadSavedDashboards = () => {
      const saved = [];
      for (let i = 1; i <= 10; i++) { // Support up to 10 dashboards
        const dashboardData = localStorage.getItem(`savedDashboard_d${i}`);
        if (dashboardData) {
          try {
            const parsed = JSON.parse(dashboardData);
            saved.push({
              id: `d${i}`,
              label: `d${i}`,
              ...parsed
            });
          } catch (error) {
            console.error(`Error parsing saved dashboard d${i}:`, error);
          }
        }
      }
      setSavedDashboards(saved);
    };

    loadSavedDashboards();
  }, []);

  // Load dashboard data from props or localStorage
  useEffect(() => {
    let dataToProcess = apiResponse;

    // If no apiResponse provided, try to load from localStorage or URL
    if (!dataToProcess) {
      // Check URL parameters for dashboard ID
      const urlParams = new URLSearchParams(window.location.search);
      const dashboardId = urlParams.get('dashboard');
      
      if (dashboardId) {
        const savedData = localStorage.getItem(`savedDashboard_${dashboardId}`);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setActiveDashboard(dashboardId);
            // If it's a saved dashboard, we need to fetch the data using the payload
            if (parsed.payload && parsed.apiResponse) {
              dataToProcess = parsed.apiResponse;
            }
          } catch (error) {
            console.error('Error loading saved dashboard:', error);
          }
        }
      }
    }

    if (!dataToProcess) return;

    // Process the data (your existing logic)
    const agentMap = dataToProcess.agentIdtoAgentDetailMap;
    const fieldMap = dataToProcess.agentIdtoFieldToFieldValueMap;
    const labels = [];
    const ticketsCreated = [];
    const ticketsPending = [];
    const ticketsResolved = [];
    const tableRows = [];

    // Process individual agents (skip "-20" which is the total)
    for (const agentId in fieldMap) {
      if (agentId === "-20") continue;

      const agentName = agentMap[agentId]?.name || `Agent ${agentId}`;
      const agentTicketDetails = fieldMap[agentId]?.AgentTicketDetails;

      if (!agentTicketDetails) continue;

      const created = parseInt(
        agentTicketDetails.TOTAL_TICKETS_CREATED?.value || "0"
      );
      const pending = parseInt(
        agentTicketDetails.TOTAL_TICKETS_PENDING?.value || "0"
      );
      const resolved = parseInt(
        agentTicketDetails.TOTAL_TICKETS_RESOLVED?.value || "0"
      );

      if (created > 0 || pending > 0 || resolved > 0) {
        labels.push(agentName);
        ticketsCreated.push(created);
        ticketsPending.push(pending);
        ticketsResolved.push(resolved);

        tableRows.push({
          agentId,
          agentName,
          ticketsCreated: created,
          ticketsPending: pending,
          ticketsResolved: resolved,
          resolutionRate:
            created > 0 ? ((resolved / created) * 100).toFixed(2) : "0.00",
        });
      }
    }

    tableRows.sort((a, b) => b.ticketsCreated - a.ticketsCreated);
    setTableData(tableRows);

    // Set bar chart data
    setBarChartData({
      labels,
      datasets: [
        {
          label: "Tickets Created",
          data: ticketsCreated,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Tickets Pending",
          data: ticketsPending,
          backgroundColor: "rgba(255, 206, 86, 0.6)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Tickets Resolved",
          data: ticketsResolved,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });

    // Get total values for pie chart
    const totalData = fieldMap["-20"]?.AgentTicketDetails;
    if (totalData) {
      const totalCreated = parseInt(
        totalData.TOTAL_TICKETS_CREATED?.value || "0"
      );
      const totalPending = parseInt(
        totalData.TOTAL_TICKETS_PENDING?.value || "0"
      );
      const totalResolved = parseInt(
        totalData.TOTAL_TICKETS_RESOLVED?.value || "0"
      );

      setPieChartData({
        labels: ["Total Created", "Total Pending", "Total Resolved"],
        datasets: [
          {
            label: "Ticket Distribution",
            data: [totalCreated, totalPending, totalResolved],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(54, 162, 235, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(54, 162, 235, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [apiResponse]);

  const handleDashboardClick = (dashboardId) => {
    navigate(`/dashboard?dashboard=${dashboardId}`);
    window.location.reload(); // Reload to show the selected dashboard
  };

  const deleteDashboard = (dashboardId, event) => {
    event.stopPropagation();
    localStorage.removeItem(`savedDashboard_${dashboardId}`);
    setSavedDashboards(prev => prev.filter(d => d.id !== dashboardId));
    
    // If we're currently viewing the deleted dashboard, redirect to main dashboard
    if (activeDashboard === dashboardId) {
      navigate('/dashboard');
      window.location.reload();
    }
  };

  const ChartContent = () => (
    <div className="flex-1 p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
            Agent Performance Dashboard
            {activeDashboard && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {activeDashboard}
              </span>
            )}
          </h1>
          
          {!apiResponse && !activeDashboard && (
            <div className="text-gray-600 text-center">
              <p>No dashboard data available. Create a dashboard from the chat interface.</p>
            </div>
          )}
        </div>

        {/* Show charts only if we have data */}
        {(barChartData || pieChartData || tableData.length > 0) && (
          <>
            {/* Bar Chart */}
            {barChartData && (
              <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
                  Agent Ticket Statistics
                </h2>
                <div className="h-64 md:h-auto">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            boxWidth: 12,
                            fontSize: 10,
                            padding: 10,
                          },
                        },
                        title: {
                          display: true,
                          text: "Tickets Created, Pending, and Resolved by Agent",
                          font: {
                            size: window.innerWidth < 768 ? 12 : 14,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                              size: window.innerWidth < 768 ? 9 : 11,
                            },
                          },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            font: {
                              size: window.innerWidth < 768 ? 9 : 11,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Table Section */}
            {tableData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
                  Agent Performance Details
                </h2>
                
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3">
                  {tableData.map((row) => (
                    <div key={row.agentId} className="border rounded-lg p-3 bg-gray-50">
                      <div className="font-medium text-gray-900 mb-2">
                        {row.agentName}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span className="font-medium">{row.ticketsCreated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pending:</span>
                          <span className="font-medium">{row.ticketsPending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Resolved:</span>
                          <span className="font-medium">{row.ticketsResolved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate:</span>
                          <span className="font-medium">{row.resolutionRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets Pending
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets Resolved
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resolution Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tableData.map((row) => (
                        <tr key={row.agentId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.agentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.ticketsCreated}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.ticketsPending}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.ticketsResolved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.resolutionRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {pieChartData && (
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
                  Overall Ticket Distribution
                </h2>
                <div className="w-full max-w-xs md:max-w-md mx-auto">
                  <div className="h-64 md:h-80">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              boxWidth: 12,
                              fontSize: window.innerWidth < 768 ? 10 : 12,
                              padding: 10,
                            },
                          },
                          title: {
                            display: true,
                            text: "Total Tickets Overview",
                            font: {
                              size: window.innerWidth < 768 ? 12 : 14,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      {!window.location.pathname.includes("/chat") && (
        <div className="flex md:flex-col w-full md:w-20 bg-white shadow-lg p-2 justify-between md:justify-start space-y-2">
          {/* Saved Dashboards */}
          {savedDashboards.map((dashboard) => (
            <div key={dashboard.id} className="relative group">
              <button
                onClick={() => handleDashboardClick(dashboard.id)}
                className={`px-3 py-2 text-white rounded-full font-semibold transition text-sm md:text-base w-full ${
                  activeDashboard === dashboard.id
                    ? "bg-[#db3700]"
                    : "bg-[rgb(0,23,43)] hover:bg-[#db3700]"
                }`}
              >
                {dashboard.label}
              </button>
              
              {/* Delete button */}
              <button
                onClick={(e) => deleteDashboard(dashboard.id, e)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                title="Delete dashboard"
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Chat Button */}
          <button
            onClick={() => navigate("/chat")}
            className="px-3 py-2 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
          >
            <ChatBubbleOutlineIcon fontSize="small" />
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <ChartContent />
    </div>
  );
};

export default DashboardCharts;
