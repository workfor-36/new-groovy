import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Cookies from "js-cookie";

const CashierBilling = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [taxMap, setTaxMap] = useState({});
  const [bills, setBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const cartInvoiceRef = useRef();
  const pastBillRef = useRef();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          "http://localhost:4001/api/inventory/manager/",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    const fetchBills = async () => {
      try {
        const storeId = Cookies.get("cashier_storeId");

        const res = await fetch(
          `http://localhost:4001/api/bills/store/${storeId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            // body: JSON.stringify({ storeId }),
          }
        );

        const data = await res.json();
        setBills(data?.bills || []);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      }
    };

    fetchInventory();
    fetchBills();
  }, []);

  const fetchTaxByCategory = async (categoryId) => {
    if (!categoryId || taxMap[categoryId]) return;
    try {
      const res = await fetch(
        `http://localhost:4001/api/tax/category/${categoryId}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setTaxMap((prev) => ({ ...prev, [categoryId]: data[0] }));
      }
    } catch (error) {
      console.error("Failed to fetch tax:", error);
    }
  };

  const addToCart = async () => {
    const selected = inventory.find((item) => item._id === selectedProductId);
    if (!selected) return;

    await fetchTaxByCategory(selected.category?._id);

    const product = selected.product;
    const existingIndex = cart.findIndex(
      (item) =>
        item._id === selected._id &&
        item.product?.size?._id === product?.size?._id &&
        item.product?.color?._id === product?.color?._id
    );

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...selected, quantity }]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const calculateTaxAmount = (item) => {
    const categoryId = item.category?._id;
    const tax = taxMap[categoryId];
    if (!tax || tax.type !== "percentage") return 0;

    const price = item.product?.price || 0;
    const total = price * item.quantity;
    return (total * tax.value) / 100;
  };

  const calculateTotalWithTax = () => {
    return cart.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const subtotal = price * item.quantity;
      const taxAmount = calculateTaxAmount(item);
      return acc + subtotal + taxAmount;
    }, 0);
  };

  const generatePDF = (ref) => {
    const input = ref?.current;
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      alert("Please enter customer name and phone number.");
      return;
    }

    try {
      const storeId = Cookies.get("cashier_storeId");
      const role = Cookies.get("role");

      if (!storeId || role !== "Cashier") {
        alert("Invalid session or role. Please log in.");
        return;
      }

      const enrichedCart = cart.map((item) => ({
        productId: item.product?._id,
        quantity: item.quantity,
      }));

      const billingPayload = {
        items: enrichedCart,
        storeId,
        customerName,
        customerPhone,
      };

      const response = await fetch("http://localhost:4001/api/bills/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(billingPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Checkout failed: " + error.message);
        return;
      }

      await response.json();
      alert("Bill created successfully!");

      setTimeout(() => {
        generatePDF(cartInvoiceRef);
      }, 300);

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    } catch (error) {
      console.error("Checkout error:", error.message);
      alert("Checkout error: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Billing System</h1>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 w-full md:w-1/3"
        />
        <input
          type="tel"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="border p-2 w-full md:w-1/3"
        />
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select a product</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {(item.product?.productName?.productName ||
                item.product?.name ||
                "Unnamed")}{" "}
              | {(item.category?.categoryName || "No Category")} |{" "}
              {(item.product?.size?.sizeName || "No Size")} |{" "}
              {(item.product?.color?.colorName || "No Color")}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border p-2 w-20"
        />

        <button
          onClick={addToCart}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>

      <div ref={cartInvoiceRef} className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Invoice</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Tax</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => {
              const price = item.product?.price || 0;
              const subtotal = price * item.quantity;
              const taxAmount = calculateTaxAmount(item);
              return (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {item.productName || "Unnamed Product"} |{" "}
                    {item.category?.categoryName || "No Category"}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">₹{price}</td>
                  <td className="border px-4 py-2">₹{taxAmount.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    ₹{(subtotal + taxAmount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right mt-4 font-bold text-lg">
          Grand Total (with tax): ₹{calculateTotalWithTax().toFixed(2)}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => generatePDF(cartInvoiceRef)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate Invoice
        </button>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Checkout
        </button>
      </div>

      {/* Dropdown to view old bills */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-2">View Previous Bills</h2>
        <select
          value={selectedBillId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedBillId(id);
            const bill = bills.find((b) => b._id === id);
            setSelectedBill(bill || null);
          }}
          className="border p-2 w-full md:w-1/2"
        >
          <option value="">Select a bill</option>
          {bills.map((bill) => (
            <option key={bill._id} value={bill._id}>
              {bill.billId} — {bill.customerName} — ₹{bill.totalAmount}
            </option>
          ))}
        </select>
      </div>

      {/* Current Invoice */}

      {/* Past Bill View */}
      {selectedBill && (
        <div ref={pastBillRef} className="bg-white p-6 mt-6 shadow rounded">
          <h3 className="text-lg font-bold mb-2">Bill Details</h3>
          <p>
            <strong>Customer:</strong> {selectedBill.customerName}
          </p>
          <p>
            <strong>Phone:</strong> {selectedBill.customerPhone}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedBill.createdAt).toLocaleString()}
          </p>

          <table className="w-full table-auto border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Tax</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    {item.productName?.productName || "Unnamed Product"}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">₹{item.price}</td>
                  <td className="border px-4 py-2">
                    {item.taxes.map((t, j) => (
                      <div key={j}>
                        {t.taxName}: ₹{t.taxAmount}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    ₹
                    {item.total +
                      item.taxes.reduce((acc, t) => acc + t.taxAmount, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 font-bold text-lg">
            Grand Total: ₹{selectedBill.grandTotal}
          </div>

          <button
            onClick={() => generatePDF(pastBillRef)}
            className="bg-blue-600 mt-4 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CashierBilling;
