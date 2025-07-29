import React from "react";

const dummyInventory = [
  { id: 1, name: "Dairy Milk", category: "Snacks", quantity: 3, threshold: 5 },
  { id: 2, name: "Toothpaste", category: "Daily Use", quantity: 12, threshold: 5 },
  { id: 3, name: "Cooking Oil", category: "Grocery", quantity: 1, threshold: 5 },
  { id: 4, name: "Bread", category: "Bakery", quantity: 10, threshold: 5 },
];

const ManagerInventory = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Store Inventory</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyInventory.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">
                  {item.quantity <= item.threshold ? (
                    <span className="text-red-600 font-semibold">Low Stock</span>
                  ) : (
                    <span className="text-green-600">Sufficient</span>
                  )}
                </td>
              </tr>
            ))}
            {dummyInventory.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No inventory data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerInventory;
