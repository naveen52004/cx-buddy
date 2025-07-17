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
  const [activeView, setActiveView] = useState("Live View");
  const navigate = useNavigate();

  useEffect(() => {
    // Hardcoded response data
    const data = {
      agentIdtoFieldToFieldValueMap: {
        120040: {
          CreateAssign: {
            TICKETS_CREATED: {
              value: "45",
              onClickArgument: "",
            },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: {
              value: "46",
              onClickArgument: "",
            },
            REOPENED_COUNT: {
              value: "0",
              onClickArgument: "",
            },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: {
              value: "1",
              onClickArgument: "",
            },
          },
        },
        196801: {
          CreateAssign: {
            TICKETS_CREATED: {
              value: "4",
              onClickArgument: "",
            },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: {
              value: "4",
              onClickArgument: "",
            },
            REOPENED_COUNT: {
              value: "0",
              onClickArgument: "",
            },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: {
              value: "2",
              onClickArgument: "",
            },
          },
        },
        "-20": {
          CreateAssign: {
            TICKETS_CREATED: {
              value: "105",
              onClickArgument: "",
            },
          },
          AgentTicketDetails: {
            TOTAL_TICKETS_CREATED: {
              value: "143",
              onClickArgument: "",
            },
            REOPENED_COUNT: {
              value: "0",
              onClickArgument: "",
            },
          },
          Disposed: {
            TOTAL_DISPOSED_AS_RESOLED: {
              value: "45",
              onClickArgument: "",
            },
          },
        },
      },
      agentIdtoAgentDetailMap: {
        0: {
          name: "UnAssigned",
          reportingToName: null,
          active: false,
        },
        196801: {
          name: "Anjali Sharma",
          reportingToName: null,
          active: false,
        },
        120040: {
          name: "Ankit Tiwari",
          reportingToName: null,
          active: false,
        },
        190286: {
          name: "Rohan Shah",
          reportingToName: null,
          active: false,
        },
        190287: {
          name: "Sourav Kumar",
          reportingToName: null,
          active: false,
        },
        154934: {
          name: "Manisha Malhotra",
          reportingToName: null,
          active: false,
        },
        154936: {
          name: "Pooja Das",
          reportingToName: null,
          active: false,
        },
      },
    };

    const agentMap = data.agentIdtoAgentDetailMap;
    const fieldMap = data.agentIdtoFieldToFieldValueMap;

    const labels = [];
    const ticketsCreated = [];
    const disposedTickets = [];
    const tableRows = [];

    for (const agentId in fieldMap) {
      if (agentId === "-20") continue; // Skip total for individual agents
      const agentName = agentMap[agentId]?.name || `Agent ${agentId}`;
      labels.push(agentName);

      const created =
        fieldMap[agentId]?.CreateAssign?.TICKETS_CREATED?.value || "0";
      const disposed =
        fieldMap[agentId]?.Disposed?.TOTAL_DISPOSED_AS_RESOLED?.value || "0";

      ticketsCreated.push(parseInt(created));
      disposedTickets.push(parseInt(disposed));

      // Prepare table data
      tableRows.push({
        agentId,
        agentName,
        ticketsCreated: parseInt(created),
        ticketsDisposed: parseInt(disposed),
        resolutionRate:
          disposed > 0 ? ((disposed / created) * 100).toFixed(2) : "0.00",
      });
    }

    // Sort table data by tickets created (descending)
    tableRows.sort((a, b) => b.ticketsCreated - a.ticketsCreated);
    setTableData(tableRows);

    // Total value for pie chart (from -20)
    const totalCreated =
      fieldMap["-20"]?.CreateAssign?.TICKETS_CREATED?.value || "0";
    const totalDisposed =
      fieldMap["-20"]?.Disposed?.TOTAL_DISPOSED_AS_RESOLED?.value || "0";

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
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <div className="w-20 bg-white shadow-lg ">
        <button className="px-3 py-2 p-2 ml-3 mt-8 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition justify-center">
          d1
        </button>
        <button onClick={() => navigate("/chat")} className="px-3 py-2 p-2 ml-3 mt-6 bg-[rgb(0,23,43)] text-white rounded-full font-semibold hover:bg-[#db3700] transition justify-center w-12 h-12"
        >
          <ChatBubbleOutlineIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Dynamic Dashboard Charts
          </h1>

          {barChartData && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tickets Created per Agent
              </h2>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Agent Performance
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Disposed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row) => (
                  <tr key={row.agentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.agentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.ticketsCreated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.ticketsDisposed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.resolutionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pieChartData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Total Overview
              </h2>
              <div className="max-w-md mx-auto">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
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
