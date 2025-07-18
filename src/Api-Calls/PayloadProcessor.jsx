import React, { useEffect, useState, useRef } from "react";
import DashboardCharts from "../components/Dashboard/Dashboardchart";

const PayloadProcessor = ({ payload }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Prevent multiple calls

  useEffect(() => {
    if (!payload || hasFetched.current) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        hasFetched.current = true; // Mark as fetched

        // Get today's date timestamps
        const today = new Date();
        const startOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const endOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        );

        // Create enhanced payload with filter
        const enhancedPayload = {
          ...payload,
          filter: {
            startDate: startOfDay.getTime(), // Start of today in timestamp
            endDate: endOfDay.getTime(), // End of today in timestamp
            notFetchEmpData: false,
          },
        };

        console.log("Making API call with enhanced payload:", enhancedPayload);

        const res = await fetch(
          "https://democrm.kapturecrm.com/ms/dashboard/performance-dashboard",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic ZGVtb2NybTpEZW1vY3JtJDMyMQ==",
            },
            body: JSON.stringify(enhancedPayload),
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("API Response received:", data);
        setResult(data);
      } catch (err) {
        console.error("Failed to process payload", err);
        setError(err.message);
        setResult({ error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [payload]);

  // Reset when payload changes
  useEffect(() => {
    if (payload) {
      hasFetched.current = false;
      setResult(null);
      setError(null);
    }
  }, [payload]);

  if (!payload) return null;

  return (
    <div>
      {loading && <div>Loading dashboard data...</div>}
      {error && <div>Error: {error}</div>}
      {result && !loading && (
        <div>
          <DashboardCharts apiResponse={result} />
        </div>
      )}
    </div>
  );
};

export default PayloadProcessor;
