import React, { useEffect, useState } from "react";
import DashboardCharts from "../components/Dashboard/Dashboardchart";

const PayloadProcessor = ({ payload }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!payload) return;

    const fetchResult = async () => {
      try {
        const res = await fetch(
          "https://democrm.kapturecrm.com/ms/dashboard/performance-dashboard",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic ZGVtb2NybTpEZW1vY3JtJDMyMQ==",
            },
            body: JSON.stringify(payload),
            credentials: "include", // ✅ Tells browser to send existing cookies
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Failed to process payload", err);
        setResult({ error: err.message });
      }
    };

    fetchResult();
  }, [payload]);

  if (!payload) return null;

  return <div>{result && <DashboardCharts apiResponse={result} />}</div>;
};

export default PayloadProcessor;
