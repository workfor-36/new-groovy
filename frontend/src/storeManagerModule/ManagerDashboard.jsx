import DataTable from 'react-data-table-component';
import React from 'react';
// Sample dashboard data (replace with backend data)
const dashboardData = {
  totalBillsToday: 42,
  totalItemsSold: 138,
  cashCollected: "₹ 10,200",
  topSellingProducts: [
    { name: "T-Shirt", sold: 38 },
    { name: "Sneakers", sold: 24 },
    { name: "Cap", sold: 19 },
  ],
  lowSoldProducts: [
    { name: "T-Shirt", sold: 38 },
    { name: "Sneakers", sold: 24 },
    { name: "Cap", sold: 19 },
  ],
};

function ManagerDashBoard() {
   const { totalBillsToday, totalItemsSold, cashCollected, topSellingProducts, lowSoldProducts } = dashboardData;

   const productColumns = [
    {
      name: "Product Name",
      selector: row => row.name
    },
    {
      name: "Units Sold",
      selector: row => row.sold
    }
  ];
  return (
    <div className="px-4 py-6 lg:px-12">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-gray-600 text-sm mb-1">Total Bills Today</h3>
          <p className="text-2xl font-semibold text-blue-600">{totalBillsToday}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-gray-600 text-sm mb-1">Total Items Sold</h3>
          <p className="text-2xl font-semibold text-green-600">{totalItemsSold}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-gray-600 text-sm mb-1">Total Cash Collected Today</h3>
          <p className="text-2xl font-semibold text-yellow-600">{cashCollected}</p>
        </div>

        
      </div>

      {/* Top Sold Products Table */}
      <div className="bg-white rounded-lg shadow-md p-6 m-1">
        <h3 className="text-lg font-semibold mb-4">Top Sold Products Today</h3>
        <DataTable
        columns={productColumns}
        data={topSellingProducts}
        pagination
        highlightOnHover
        />
      </div>

        <div className="bg-white rounded-lg shadow-md p-6 m-1">
        <h3 className="text-lg font-semibold mb-4">Low Sold Products Today</h3>
        <DataTable
        columns={productColumns}
        data={lowSoldProducts}
        />
      </div>
    </div>
  )
}

export default ManagerDashBoard
