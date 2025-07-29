import React, { useState } from "react";

// Dummy inventory data
const dummyStores = [
  {
    id: "STR001",
    name: "Store A",
    location: "Mumbai",
    inventory: [
      { id: 1, name: "Dairy Milk", quantity: 4, threshold: 5 },
      { id: 2, name: "Bread", quantity: 10, threshold: 5 },
    ],
  },
  {
    id: "STR002",
    name: "Store B",
    location: "Pune",
    inventory: [
      { id: 3, name: "Cooking Oil", quantity: 2, threshold: 5 },
      { id: 4, name: "Toothpaste", quantity: 12, threshold: 5 },
    ],
  },
];

// Reusable Modal Wrapper
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  </div>
);

const AdminInventoryDashboard = () => {
  const [selectedStore, setSelectedStore] = useState("ALL");
  const [showAdjust, setShowAdjust] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const filteredStores =
    selectedStore === "ALL"
      ? dummyStores
      : dummyStores.filter((s) => s.id === selectedStore);

  const handleOpenModal = (modalType, storeId, item) => {
    setSelectedItem(item);
    setSelectedStoreId(storeId);
    if (modalType === "adjust") setShowAdjust(true);
    if (modalType === "transfer") setShowTransfer(true);
    if (modalType === "audit") setShowAuditLog(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Inventory Dashboard</h2>

      <div className="mb-6">
        <label className="font-medium mr-2">Filter by Store:</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ALL">All Stores</option>
          {dummyStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.location}
            </option>
          ))}
        </select>
      </div>

      {filteredStores.map((store) => (
        <div key={store.id} className="mb-8">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">
            {store.name} ({store.location})
          </h3>
          <table className="w-full bg-white border rounded shadow mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.inventory.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
                    {item.quantity <= item.threshold ? (
                      <span className="text-red-600 font-semibold">Low Stock</span>
                    ) : (
                      <span className="text-green-600">Sufficient</span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleOpenModal("adjust", store.id, item)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Adjust
                    </button>
                    <button
                      onClick={() => handleOpenModal("transfer", store.id, item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => handleOpenModal("audit", store.id, item)}
                      className="text-sm underline text-gray-500 hover:text-gray-700"
                    >
                      Audit Log
                    </button>
                  </td>
                </tr>
              ))}
              {store.inventory.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No inventory in this store.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* Adjust Stock Modal */}
      {showAdjust && selectedItem && (
        <Modal title={`Adjust Stock - ${selectedItem.name}`} onClose={() => setShowAdjust(false)}>
          <p>Store: {selectedStoreId}</p>
          <p>Product: {selectedItem.name}</p>
          <input
            type="number"
            placeholder="Enter adjustment (+/-)"
            className="border mt-3 p-2 rounded w-full"
          />
          <textarea
            placeholder="Reason (e.g. expired, damage)"
            className="border mt-3 p-2 rounded w-full"
          ></textarea>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Submit Adjustment
          </button>
        </Modal>
      )}

      {/* Transfer Stock Modal */}
      {showTransfer && selectedItem && (
        <Modal title={`Transfer Stock - ${selectedItem.name}`} onClose={() => setShowTransfer(false)}>
          <p>From Store: {selectedStoreId}</p>
          <p>Product: {selectedItem.name}</p>
          <select className="border p-2 mt-3 w-full rounded">
            {dummyStores
              .filter((s) => s.id !== selectedStoreId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            placeholder="Quantity to transfer"
            className="border mt-3 p-2 rounded w-full"
          />
          <button className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded">
            Transfer
          </button>
        </Modal>
      )}

      {/* Audit Log Modal */}
      {showAuditLog && selectedItem && (
        <Modal title={`Audit Log - ${selectedItem.name}`} onClose={() => setShowAuditLog(false)}>
          <ul className="text-sm space-y-2">
            <li><strong>[+5]</strong> by Admin - 27 July - Reason: Stock Refill</li>
            <li><strong>[-2]</strong> by Admin - 22 July - Reason: Damaged</li>
            <li><strong>[+3]</strong> by Admin - 15 July - Reason: Transfer</li>
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default AdminInventoryDashboard;
