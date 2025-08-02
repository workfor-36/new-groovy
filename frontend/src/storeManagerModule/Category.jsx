import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState("");

  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("");

  const [productNames, setProductNames] = useState([]);
  const [newProductName, setNewProductName] = useState("");

  const fetchAttributes = async () => {
    try {
      const [catRes, sizeRes, colorRes, productNameRes] = await Promise.all([
        axios.get("http://localhost:4001/api/attributes/category"),
        axios.get("http://localhost:4001/api/attributes/size"),
        axios.get("http://localhost:4001/api/attributes/color"),
        axios.get("http://localhost:4001/api/attributes/product-name"),
      ]);
      setCategories(catRes.data);
      setSizes(sizeRes.data);
      setColors(colorRes.data);
      setProductNames(productNameRes.data);
    } catch (err) {
      console.error("Failed to fetch attributes:", err);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post("http://localhost:4001/api/attributes/category", {
        categoryName: newCategory,
      });
      setCategories([...categories, res.data.category]);
      setNewCategory("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const addSize = async () => {
    if (!newSize.trim()) return;
    try {
      const res = await axios.post("http://localhost:4001/api/attributes/size", {
        sizeName: newSize,
      });
      setSizes([...sizes, res.data.size]);
      setNewSize("");
    } catch (err) {
      console.error("Failed to add size:", err);
    }
  };

  const addColor = async () => {
    if (!newColor.trim()) return;
    try {
      const res = await axios.post("http://localhost:4001/api/attributes/color", {
        colorName: newColor,
      });
      setColors([...colors, res.data.color]);
      setNewColor("");
    } catch (err) {
      console.error("Failed to add color:", err);
    }
  };

  const addProductName = async () => {
    if (!newProductName.trim()) return;
    try {
      const res = await axios.post("http://localhost:4001/api/attributes/product-name", {
        productName: newProductName,
      });
      setProductNames([...productNames, res.data.productName]);
      setNewProductName("");
    } catch (err) {
      console.error("Failed to add product name:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/attributes/category/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const deleteSize = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/attributes/size/${id}`);
      setSizes(sizes.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete size:", err);
    }
  };

  const deleteColor = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/attributes/color/${id}`);
      setColors(colors.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete color:", err);
    }
  };

  const deleteProductName = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/attributes/${id}`);
      setProductNames(productNames.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product name:", err);
    }
  };

  const handleAdd = (type) => {
    if (type === "category") addCategory();
    else if (type === "size") addSize();
    else if (type === "color") addColor();
    else if (type === "product-name") addProductName();
  };

  const handleDelete = (type, item) => {
    if (type === "category") deleteCategory(item._id);
    else if (type === "size") deleteSize(item._id);
    else if (type === "color") deleteColor(item._id);
    else if (type === "product-name") deleteProductName(item._id);
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const renderSection = (title, items, input, setInput, type, fieldKey) => (
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
        {items.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b py-1">
            {item[fieldKey]}
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
      <div className="flex flex-col md:flex-row md:flex-wrap gap-6">
        {renderSection("Product Categories", categories, newCategory, setNewCategory, "category", "categoryName")}
        {renderSection("Product Sizes", sizes, newSize, setNewSize, "size", "sizeName")}
        {renderSection("Product Colors", colors, newColor, setNewColor, "color", "colorName")}
        {renderSection("Product Names", productNames, newProductName, setNewProductName, "product-name", "productName")}
      </div>
    </div>
  );
};

export default Category;
