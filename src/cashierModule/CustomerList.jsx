import React, { useState } from "react";

const dummyCustomers = [
  {
    id: 1,
    name: "Riya Sharma",
    phone: "9876543210",
    totalSpent: 2350,
    history: [
      { date: "2025-07-25", amount: 850, items: ["Milk", "Bread", "Butter"] },
      { date: "2025-07-10", amount: 1500, items: ["Shampoo", "Toothpaste"] },
    ],
  },
  {
    id: 2,
    name: "Arjun Mehta",
    phone: "9123456780",
    totalSpent: 4100,
    history: [
      { date: "2025-07-20", amount: 2000, items: ["Cooking Oil", "Dal", "Rice"] },
      { date: "2025-07-01", amount: 2100, items: ["Snacks", "Soap"] },
    ],
  },
];

const CustomerList = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = dummyCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

      <input
        type="text"
        placeholder="Search by name or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full max-w-sm mb-4"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Total Spent</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cust) => (
              <tr key={cust.id} className="border-t">
                <td className="py-2 px-4">{cust.name}</td>
                <td className="py-2 px-4">{cust.phone}</td>
                <td className="py-2 px-4">₹{cust.totalSpent.toLocaleString()}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="text-blue-600 hover:underline"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No matching customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedCustomer.name}'s Purchase History
            </h3>
            <ul className="space-y-3 text-sm">
              {selectedCustomer.history.map((bill, idx) => (
                <li key={idx} className="border p-3 rounded">
                  <p><strong>Date:</strong> {bill.date}</p>
                  <p><strong>Amount:</strong> ₹{bill.amount}</p>
                  <p><strong>Items:</strong> {bill.items.join(", ")}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
