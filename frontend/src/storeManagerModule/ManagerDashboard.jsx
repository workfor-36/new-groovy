import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ManagerDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const storeId = Cookies.get("storeId");
      if (!storeId) {
        setError("Store ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4001/api/reports/store/${storeId}`,
          { withCredentials: true }
        );
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load dashboard report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading manager dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  if (!report) {
    return <div className="p-6 text-red-600 font-semibold">No data found.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, Manager!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm text-gray-500">Bills Today</p>
          <p className="text-2xl font-bold text-blue-600">{report.dailySales}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm text-gray-500">Cash Collected Today</p>
          <p className="text-2xl font-bold text-green-600">₹{report.dailyRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm text-gray-500">GST Collected</p>
          <p className="text-2xl font-bold text-orange-600">₹{report.gstCollected.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
