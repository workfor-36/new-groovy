import React, { useState, useEffect, useRef } from "react";
import jsPDF  from "jspdf";
import autoTable from 'jspdf-autotable';
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

   const generatePDF = (dataRef, dataType = "cart") => {
  const doc = new jsPDF();
  const title = dataType === "cart" ? "Invoice" : "Groovy Bills";

  doc.setFontSize(18);
  doc.text(title, 14, 15);

  if (dataType === "cart") {
    doc.setFontSize(12);
    doc.text(`Customer: ${customerName}`, 14, 25);
    doc.text(`Phone: ${customerPhone}`, 14, 32);

    const tableData = cart.map((item) => {
      const price = item.product?.price || 0;
      const subtotal = price * item.quantity;
      const tax = calculateTaxAmount(item);
      const total = subtotal + tax;
      return [
        item.product?.productName?.productName || item.product?.name || "N/A",
        item.quantity,
        `₹${price}`,
        `₹${tax.toFixed(2)}`,
        `₹${total.toFixed(2)}`,
      ];
    });

    autoTable(doc,{
      head: [["Product", "Qty", "Price", "Tax", "Total"]],
      body: tableData,
      startY: 40,
    });

    doc.text(
      `Grand Total: ₹${calculateTotalWithTax().toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
  } else if (dataType === "past" && selectedBill) {
    doc.setFontSize(12);
    doc.text(`Customer: ${selectedBill.customerName}`, 14, 25);
    doc.text(`Phone: ${selectedBill.customerPhone}`, 14, 32);
    doc.text(
      `Date: ${new Date(selectedBill.createdAt).toLocaleString()}`,
      14,
      39
    );

    const tableData = selectedBill.items.map((item) => {
      const taxAmount = item.taxes.reduce((acc, t) => acc + t.taxAmount, 0);
      return [
        item.productName?.productName || "Unnamed Product",
        item.quantity,
        `₹${item.price}`,
        `₹${taxAmount}`,
        `₹${item.total + taxAmount}`,
      ];
    });

   autoTable(doc, {
  head: [["Product", "Qty", "Price", "Tax", "Total"]],
  body: tableData, // make sure this does NOT have index
  startY: 45,
  // Add this to ensure no extra column is shown
  showHead: 'everyPage',
  styles: { halign: 'center' },
  theme: 'grid'
});


    doc.text(
      `Grand Total: ₹${selectedBill.grandTotal}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
  }

  doc.save(`${title}.pdf`);
};



  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
  alert("Please enter customer name and phone number.");
  return;
}

if (!/^\d{10}$/.test(customerPhone)) {
  alert("Customer phone number must be exactly 10 digits.");
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
      }, 700);

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    } catch (error) {
      console.error("Checkout error:", error.message);
      alert("Checkout error: " + error.message);
    }
  };

  return (
    <div className="p-">
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
  maxLength={10}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomerPhone(value.slice(0, 10)); // ensures max 10 digits
    }
  }}
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
          className="bg-teal-950 hover:bg-teal-900 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>

<div
  ref={cartInvoiceRef}
  style={{ color: "#000", backgroundColor: "#fff" }}
  className="bg-white p-6 shadow rounded"
>
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
{item.product?.productName?.productName || item.product?.name || "Unnamed Product"}
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
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="bg-teal-950 hover:bg-teal-900 text-white px-6 py-2 rounded "
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
<div
  ref={pastBillRef}
  style={{ color: "#000", backgroundColor: "#fff" }}
  className="bg-white p-6 mt-6 shadow rounded"
>
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
            onClick={() => generatePDF(null,"past")}
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
