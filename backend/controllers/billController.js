import Bill from "../models/billModel.js";
import Product from "../models/productModel.js";
import Tax from "../models/taxModel.js";
import Inventory from "../models/inventoryModel.js"; // ✅ Import inventory model
import { v4 as uuidv4 } from "uuid";

// POST /api/bills
export const createBill = async (req, res) => {
  try {
    const {
      items, // [{ productId, quantity }]
      cashierId,
      storeId,
      customerName,
      customerPhone,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in bill" });
    }

    let subtotal = 0;
    const detailedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      const price = product.price;
      const total = price * quantity;
      subtotal += total;

      detailedItems.push({
        productId: product._id,
        productName: product.productName,
        quantity,
        price,
        total,
      });
    }

    // 🔍 Fetch all active taxes
    const activeTaxes = await Tax.find({ isActive: true });

    // 🧮 Calculate tax amounts
    let totalTaxAmount = 0;
    const taxBreakdown = [];

    activeTaxes.forEach((tax) => {
      const taxAmount = (subtotal * tax.taxPercentage) / 100;
      totalTaxAmount += taxAmount;
      taxBreakdown.push({
        taxName: tax.taxName,
        taxPercentage: tax.taxPercentage,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
      });
    });

    const totalAmount = parseFloat((subtotal + totalTaxAmount).toFixed(2));

    const bill = new Bill({
      billId: uuidv4(),
      items: detailedItems,
      totalAmount,
      cashier: cashierId,
      store: storeId,
      customerName,
      customerPhone,
      taxBreakdown, // optional field added in schema
    });

    await bill.save();

    // ✅ Deduct stock from inventory per item sold
    for (const item of detailedItems) {
      await Inventory.findOneAndUpdate(
        { store: storeId, product: item.productId },
        {
          $inc: { quantity: -item.quantity },
          $set: { lastUpdated: new Date() }
        },
        { new: true }
      );
    }

    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
