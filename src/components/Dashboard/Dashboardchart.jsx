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
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiResponse) return;

    const agentMap = apiResponse.agentIdtoAgentDetailMap;
    const fieldMap = apiResponse.agentIdtoFieldToFieldValueMap;

    const labels = [];
    const ticketsCreated = [];
    const ticketsPending = [];
    const ticketsResolved = [];
    const tableRows = [];

    // Process individual agents (skip "-20" which is the total)
    for (const agentId in fieldMap) {
      if (agentId === "-20") continue; // Skip total for individual agents

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

      // Only include agents with ticket activity
      if (created > 0 || pending > 0 || resolved > 0) {
        labels.push(agentName);
        ticketsCreated.push(created);
        ticketsPending.push(pending);
        ticketsResolved.push(resolved);

        // Prepare table data
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

    // Get total values for pie chart (from "-20")
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

  // Show loading state if no data
  // if (!apiResponse) {
  //   return (
  //     <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
  //       {/* Mobile Sidebar */}
  //       <div className="flex md:flex-col w-full md:w-20 bg-white shadow-lg p-2 justify-between md:justify-start">
  //         <button className="px-3 py-2 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition">
  //           d1
  //         </button>
  //         <button
  //           onClick={() => navigate("/chat")}
  //           className="px-3 py-2 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition w-12 h-12"
  //         >
  //           <ChatBubbleOutlineIcon />
  //         </button>
  //       </div>

  //       {/* Loading Content */}
  //       <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //           <p className="text-gray-600 text-sm md:text-base">
  //             Loading dashboard data...
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      {/* Mobile Top Bar / Desktop Sidebar */}
      <div className="flex md:flex-col w-full md:w-20 bg-white shadow-lg p-2 justify-between md:justify-start">
        <button className="px-3 py-2 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition text-sm md:text-base">
          d1
        </button>
        <button
          onClick={() => navigate("/chat")}
          className="px-3 py-2 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
        >
          <ChatBubbleOutlineIcon fontSize="small" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">
            Agent Performance Dashboard
          </h1>

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

          {/* Table Section - Mobile Cards / Desktop Table */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
              Agent Performance Details
            </h2>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
              {tableData.map((row) => (
                <div
                  key={row.agentId}
                  className="border rounded-lg p-3 bg-gray-50"
                >
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
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
