import React, { useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Parle-G Biscuit",
    category: "Snacks",
    size: "100g",
    color: null,
    price: 10,
  },
  {
    id: 2,
    name: "Dairy Milk",
    category: "Chocolates",
    size: "50g",
    color: null,
    price: 20,
  },
];

const ManagerProductManager = () => {
  const [products, setProducts] = useState(initialProducts);
  const [formData, setFormData] = useState({ name: "", category: "", size: "", color: "", price: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setProducts(products.map(p => (p.id === editId ? { ...p, ...formData } : p)));
      setEditId(null);
    } else {
      const newProduct = { ...formData, id: Date.now() };
      setProducts([...products, newProduct]);
    }

    setFormData({ name: "", category: "", size: "", color: "", price: "" });
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 bg-white p-4 rounded shadow">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="size" placeholder="Size (e.g., 1L, 100g)" value={formData.size} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="color" placeholder="Color (if any)" value={formData.color} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Size</th>
              <th className="py-2 px-4">Color</th>
              <th className="py-2 px-4">Price (₹)</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.size}</td>
                <td className="py-2 px-4">{product.color || "-"}</td>
                <td className="py-2 px-4">₹{product.price}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerProductManager;
