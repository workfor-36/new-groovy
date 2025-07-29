import React, { useState } from "react";

const AdminAction = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Amit Singh", email: "amit@groovybills.com", role: "Manager", store: "" },
    { id: 2, name: "Priya Patel", email: "priya@groovybills.com", role: "Cashier", store: "" },
  ]);

  const [formData, setFormData] = useState({ name: "", email: "", role: "Cashier" });
  const [editId, setEditId] = useState(null);

  const stores = ["Store A", "Store B", "Store C"]; // Dummy store list

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, ...formData } : u));
      setEditId(null);
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        store: "",
      };
      setUsers([...users, newUser]);
    }
    setFormData({ name: "", email: "", role: "Cashier" });
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAssignStore = (userId, storeName) => {
    setUsers(users.map(u => u.id === userId ? { ...u, store: storeName } : u));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin - Manage Users & Assign Stores</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleAddOrUpdate} className="bg-white p-4 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          {editId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Assigned Store</th>
              <th className="py-2 px-4 text-left">Assign</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.store || <span className="text-gray-400">Not Assigned</span>}</td>
                <td className="py-2 px-4">
                  <select
                    className="border rounded px-2 py-1"
                    value={user.store}
                    onChange={(e) => handleAssignStore(user.id, e.target.value)}
                  >
                    <option value="">-- Select Store --</option>
                    {stores.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAction;
