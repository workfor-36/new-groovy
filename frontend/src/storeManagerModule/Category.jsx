import React, { useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState(["Snacks", "Beverages"]);
  const [sizes, setSizes] = useState(["100g", "1L"]);
  const [colors, setColors] = useState(["Red", "Blue"]);

  const [newCategory, setNewCategory] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const handleAdd = (type) => {
    if (type === "category" && newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    } else if (type === "size" && newSize.trim()) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    } else if (type === "color" && newColor.trim()) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const handleDelete = (type, item) => {
    if (type === "category") setCategories(categories.filter(c => c !== item));
    if (type === "size") setSizes(sizes.filter(s => s !== item));
    if (type === "color") setColors(colors.filter(c => c !== item));
  };

  const renderSection = (title, items, input, setInput, type) => (
    <div className="bg-white p-4 rounded shadow w-full md:w-1/3">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add ${type}`}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => handleAdd(type)}
          className="bg-teal-600 text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="text-sm text-gray-700">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between items-center border-b py-1">
            {item}
            <button
              onClick={() => handleDelete(type, item)}
              className="text-red-500 text-xs hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-gray-400">No entries</li>}
      </ul>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Attribute Management</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {renderSection("Product Categories", categories, newCategory, setNewCategory, "category")}
        {renderSection("Product Sizes", sizes, newSize, setNewSize, "size")}
        {renderSection("Product Colors", colors, newColor, setNewColor, "color")}
      </div>
    </div>
  );
};

export default Category;
