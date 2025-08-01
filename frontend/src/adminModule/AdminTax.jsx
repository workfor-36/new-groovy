import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTax = () => {
  const [taxes, setTaxes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: "",
    isDefault: false,
    category: "",
  });

  useEffect(() => {
    // Fetch categories
    axios.get("http://localhost:4001/api/attributes/category")
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      });

    // Fetch taxes
    axios.get("http://localhost:4001/api/tax/")
      .then((res) => {
        setTaxes(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load taxes", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4001/api/tax/", {
        ...formData,
      });

      setTaxes([...taxes, response.data]);
      setFormData({
        name: "",
        type: "percentage",
        value: "",
        isDefault: false,
        category: "",
      });
    } catch (error) {
      console.error("Failed to add tax", error);
      alert("Error adding tax");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Tax Configuration</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
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

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
  {cat.categoryName}
</option>

          ))}
        </select>

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

      {/* Tax List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Value</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax._id || tax.name} className="border-t">
                <td className="py-2 px-4">{tax.name}</td>
                <td className="py-2 px-4 capitalize">{tax.type}</td>
                <td className="py-2 px-4">
                  {tax.value}
                  {tax.type === "percentage" ? "%" : " ₹"}
                </td>
<td>{tax.category?.categoryName}</td> // ✅
                <td className="py-2 px-4">{tax.isDefault ? "✅" : "❌"}</td>
              </tr>
            ))}
            {taxes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
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
