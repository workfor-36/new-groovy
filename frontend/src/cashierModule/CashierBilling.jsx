import React, { useState } from "react";
import { jsPDF } from "jspdf";

const products = [
  { id: 1, name: "Toothpaste", price: 50 },
  { id: 2, name: "Shampoo", price: 120 },
  { id: 3, name: "Soap", price: 30 },
  { id: 4, name: "Oil", price: 180 },
];

const GST_RATE = 0.18; // 18%

const CashierBilling = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearch(""); // Clear search after adding
  };

  const updateQuantity = (id, quantity) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("GroovyBills Invoice", 20, 20);
    let y = 30;
    cart.forEach((item) => {
      doc.text(`${item.name} x${item.quantity} - ₹${item.price * item.quantity}`, 20, y);
      y += 10;
    });
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 20, y + 10);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, y + 20);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, y + 30);
    doc.save("invoice.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">POS - Billing System</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {search && (
        <div className="mb-4">
          {products
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p) => (
              <div
                key={p.id}
                className="cursor-pointer p-2 border-b hover:bg-gray-100"
                onClick={() => addToCart(p)}
              >
                {p.name} - ₹{p.price}
              </div>
            ))}
        </div>
      )}

      <table className="w-full bg-white border rounded shadow mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Qty</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">₹{item.price}</td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 border p-1 rounded"
                />
              </td>
              <td className="py-2 px-4">₹{(item.price * item.quantity).toFixed(2)}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {cart.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                Cart is empty.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
          <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={cart.length === 0}
          className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default CashierBilling;
