import React, { useState } from "react";

const AdminTax = () => {
  const [taxes, setTaxes] = useState([
    { id: 1, name: "GST", type: "percentage", value: 18, isDefault: true },
    { id: 2, name: "Local Tax", type: "percentage", value: 2, isDefault: false }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: "",
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTax = {
      ...formData,
      id: Date.now()
    };
    setTaxes([...taxes, newTax]);
    setFormData({ name: "", type: "percentage", value: "", isDefault: false });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Tax Configuration</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Tax Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input
          type="number"
          name="value"
          placeholder="Value"
          value={formData.value}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          Default
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-full md:col-span-1"
        >
          Add Tax
        </button>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Value</th>
              <th className="py-2 px-4 text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax.id} className="border-t">
                <td className="py-2 px-4">{tax.name}</td>
                <td className="py-2 px-4 capitalize">{tax.type}</td>
                <td className="py-2 px-4">{tax.value}{tax.type === 'percentage' ? '%' : ' ₹'}</td>
                <td className="py-2 px-4">{tax.isDefault ? "✅" : "❌"}</td>
              </tr>
            ))}
            {taxes.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No tax rules added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTax;
