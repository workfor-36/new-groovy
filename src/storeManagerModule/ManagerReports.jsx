import React from "react";

const dummyReports = [
  {
    id: "STR001",
    name: "Store A",
    location: "Mumbai",
    manager: "Amit Singh",
    cashiers: ["Priya", "Rohit"],
    report: {
      sales: { daily: 12000, weekly: 84000, monthly: 342000 },
      revenue: { daily: 11500, weekly: 82000, monthly: 336000 },
      gstCollected: 3200,
      gstPending: 800,
      topProducts: ["Soap", "Shampoo", "Chips"],
    },
  },
  {
    id: "STR002",
    name: "Store B",
    location: "Pune",
    manager: "Nisha Mehra",
    cashiers: ["Karan"],
    report: {
      sales: { daily: 9500, weekly: 60500, monthly: 228000 },
      revenue: { daily: 9100, weekly: 59000, monthly: 223000 },
      gstCollected: 2800,
      gstPending: 500,
      topProducts: ["Toothpaste", "Oil", "Milk"],
    },
  },
];

// You can dynamically set this based on login later
const loggedInManager = "Nisha Mehra"; // hardcoded for now

const ManagerReports = () => {
  const store = dummyReports.find((s) => s.manager === loggedInManager);

  if (!store) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">No assigned store found.</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Store Report - {store.name}</h2>

      <div className="bg-white p-5 rounded-lg shadow">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-teal-700">{store.name}</h3>
          <p className="text-gray-600">{store.location}</p>
          <p className="text-sm text-gray-500">Store ID: {store.id}</p>
        </div>

        <div className="mb-2">
          <p><strong>Manager:</strong> {store.manager}</p>
          <p><strong>Cashiers:</strong> {store.cashiers.join(", ")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Daily Sales</p>
            <p className="text-lg font-bold text-blue-600">₹{store.report.sales.daily.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Weekly Sales</p>
            <p className="text-lg font-bold text-blue-600">₹{store.report.sales.weekly.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Monthly Sales</p>
            <p className="text-lg font-bold text-blue-600">₹{store.report.sales.monthly.toLocaleString()}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Daily Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{store.report.revenue.daily.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Weekly Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{store.report.revenue.weekly.toLocaleString()}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">Monthly Revenue</p>
            <p className="text-lg font-bold text-green-600">₹{store.report.revenue.monthly.toLocaleString()}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">GST Collected</p>
            <p className="text-lg font-bold text-orange-600">₹{store.report.gstCollected}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-600">GST Pending</p>
            <p className="text-lg font-bold text-red-600">₹{store.report.gstPending}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Top Products:</p>
          <ul className="list-disc ml-5 text-gray-700 text-sm">
            {store.report.topProducts.map((product, idx) => (
              <li key={idx}>{product}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
