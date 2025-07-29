import React from "react";

const AdminStoreList = () => {
  // Dummy store data
  const stores = [
    {
      id: "STR001",
      name: "Store A",
      location: "Mumbai",
      manager: "Amit Singh",
      cashiers: ["Priya Patel", "Rohit Gupta"],
    },
    {
      id: "STR002",
      name: "Store B",
      location: "Pune",
      manager: "Nisha Mehra",
      cashiers: ["Karan Patel"],
    },
    {
      id: "STR003",
      name: "Store C",
      location: "Delhi",
      manager: "Anuj Kumar",
      cashiers: [],
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin - Store List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Store ID</th>
              <th className="py-2 px-4 text-left">Store Name</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Manager</th>
              <th className="py-2 px-4 text-left">Cashier(s)</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="py-2 px-4">{store.id}</td>
                <td className="py-2 px-4">{store.name}</td>
                <td className="py-2 px-4">{store.location}</td>
                <td className="py-2 px-4">{store.manager}</td>
                <td className="py-2 px-4">
                  {store.cashiers.length > 0 ? (
                    store.cashiers.join(", ")
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStoreList;
