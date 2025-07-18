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

const DashboardCharts = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Hardcoded response data
    const data = {
      agentIdtoFieldToFieldValueMap: {
        120040: {
          CreateAssign: {
            TICKETS_CREATED: { value: "45", onClickArgument: "" },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: { value: "46", onClickArgument: "" },
            REOPENED_COUNT: { value: "0", onClickArgument: "" },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: { value: "1", onClickArgument: "" },
          },
        },
        196801: {
          CreateAssign: {
            TICKETS_CREATED: { value: "4", onClickArgument: "" },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: { value: "4", onClickArgument: "" },
            REOPENED_COUNT: { value: "0", onClickArgument: "" },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: { value: "2", onClickArgument: "" },
          },
        },
        "-20": {
          CreateAssign: {
            TICKETS_CREATED: { value: "105", onClickArgument: "" },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: { value: "143", onClickArgument: "" },
            REOPENED_COUNT: { value: "0", onClickArgument: "" },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: { value: "45", onClickArgument: "" },
          },
        },
      },
      agentIdtoAgentDetailMap: {
        0: { name: "UnAssigned", reportingToName: null, active: false },
        196801: { name: "Anjali Sharma", reportingToName: null, active: false },
        120040: { name: "Ankit Tiwari", reportingToName: null, active: false },
      },
    };

    const agentMap = data.agentIdtoAgentDetailMap;
    const fieldMap = data.agentIdtoFieldToFieldValueMap;

    const labels = [];
    const ticketsCreated = [];
    const disposedTickets = [];
    const tableRows = [];

    for (const agentId in fieldMap) {
      if (agentId === "-20") continue;
      const agentName = agentMap[agentId]?.name || `Agent ${agentId}`;
      labels.push(agentName);

      const created = fieldMap[agentId]?.CreateAssign?.TICKETS_CREATED?.value || "0";
      const disposed = fieldMap[agentId]?.Disposed?.TOTAL_DISPOSED_AS_RESOLED?.value || "0";

      ticketsCreated.push(parseInt(created));
      disposedTickets.push(parseInt(disposed));

      tableRows.push({
        agentId,
        agentName,
        ticketsCreated: parseInt(created),
        ticketsDisposed: parseInt(disposed),
        resolutionRate: disposed > 0 ? ((disposed / created) * 100).toFixed(2) : "0.00",
      });
    }

    tableRows.sort((a, b) => b.ticketsCreated - a.ticketsCreated);
    setTableData(tableRows);

    const totalCreated = fieldMap["-20"]?.CreateAssign?.TICKETS_CREATED?.value || "0";
    const totalDisposed = fieldMap["-20"]?.Disposed?.TOTAL_DISPOSED_AS_RESOLED?.value || "0";

    setBarChartData({
      labels,
      datasets: [
        {
          label: "Tickets Created",
          data: ticketsCreated,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Disposed Tickets",
          data: disposedTickets,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    });

    setPieChartData({
      labels: ["Total Tickets Created", "Total Disposed Tickets"],
      datasets: [
        {
          label: "Totals",
          data: [parseInt(totalCreated), parseInt(totalDisposed)],
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <div className="flex md:flex-col w-full md:w-20 bg-white shadow-lg p-2 justify-between md:justify-start">
        <button className="px-3 py-2 ml-2 md:ml-3 mt-2 md:mt-8 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition">
          d1
        </button>
        <button
          onClick={() => navigate("/chat")}
          className="px-3 py-2 ml-2 md:ml-3 mt-2 md:mt-6 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition w-12 h-12"
        >
          <ChatBubbleOutlineIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Dynamic Dashboard Charts
          </h1>

          {barChartData && (
            <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Tickets Created per Agent
              </h2>
              <div className="w-full">
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 overflow-x-auto">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              Agent Performance
            </h2>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Agent</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Created</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Disposed</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData.map((row) => (
                  <tr key={row.agentId}>
                    <td className="px-3 py-2">{row.agentName}</td>
                    <td className="px-3 py-2">{row.ticketsCreated}</td>
                    <td className="px-3 py-2">{row.ticketsDisposed}</td>
                    <td className="px-3 py-2">{row.resolutionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pieChartData && (
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Total Overview
              </h2>
              <div className="w-full max-w-md mx-auto">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
