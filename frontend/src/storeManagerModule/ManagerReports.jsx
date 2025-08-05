import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // ✅ NEW: to read cookies

const ManagerReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const storeId = Cookies.get("storeId"); // ✅ Get storeId from cookie
      if (!storeId) {
        setError("Store ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching report for storeId:", storeId);
        const res = await axios.get(
          `http://localhost:4001/api/reports/store/${storeId}`,
          { withCredentials: true }
        );
        console.log("Fetched report successfully:", res.data);
        setReport(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch report:", err);
        if (err.response) {
          console.error("🔴 Server responded with:", err.response.data);
        } else if (err.request) {
          console.error("🟠 No response received. Request sent:", err.request);
        } else {
          console.error("🟡 Error setting up request:", err.message);
        }
        setError("Failed to load report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-600">Loading store report...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">No report data available.</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Store Report</h2>

      <div className="bg-white p-5 rounded-lg shadow">
        

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Daily Sales</p>
            <p className="text-lg font-bold text-blue-600">{report.dailySales.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Weekly Sales</p>
            <p className="text-lg font-bold text-blue-600">{report.weeklySales.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Monthly Sales</p>
            <p className="text-lg font-bold text-blue-600">{report.monthlySales.toLocaleString()}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Daily Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{report.dailyRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Weekly Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{report.weeklyRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Monthly Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{report.monthlyRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">GST Collected</p>
            <p className="text-lg font-bold text-orange-600">₹{report.gstCollected.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">GST Pending</p>
            <p className="text-lg font-bold text-red-600">₹{report.gstPending.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
