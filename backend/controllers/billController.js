import Bill from "../models/billModel.js";
import Product from "../models/productModel.js";
import Tax from "../models/taxModel.js";
import Inventory from "../models/inventoryModel.js";
import { v4 as uuidv4 } from "uuid";

// @desc   Create a new bill and update inventory accordingly
// @route  POST /api/bills
// @access Protected (Cashier only)


// @desc   Get all bills of a specific store
// @route  GET /api/bills/store/:storeId
// @access Protected (Cashier only)

export const getBillsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const bills = await Bill.find({ store: storeId })
      .sort({ createdAt: -1 }) // Optional: latest bills first
      .populate("store", "storeName")
      .populate("items.productName")
      
      // Optional: populate store details
      .exec();

    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: "No bills found for this store" });
    }

    res.status(200).json({ bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};








export const createBill = async (req, res) => {
  try {
    const {
      items,
      storeId,
      customerName,
      customerPhone,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in bill" });
    }

    let subtotal = 0;
    const detailedItems = [];
    let totalTaxAmount = 0;
    const taxBreakdown = [];

    for (const item of items) {
      const { productId, quantity = 1 } = item;

      const product = await Product.findById(productId).populate("category");
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      const inventory = await Inventory.findOne({
        store: storeId,
        product: productId,
        category: product.category._id,
      });

      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({
          message: `Product '${product.productName}' is not available in required quantity in inventory`,
        });
      }

      const price = product.price;
      const total = price * quantity;
      subtotal += total;

      const applicableTaxes = await Tax.find({
        category: product.category._id,
        isActive: true,
      });

      let itemTaxAmount = 0;
      const itemTaxDetails = [];

      for (const tax of applicableTaxes) {
        const taxAmt =
          tax.type === "percentage" ? (total * tax.value) / 100 : tax.value;

        itemTaxAmount += taxAmt;

        const existingTax = taxBreakdown.find((t) => t.taxName === tax.name);
        if (existingTax) {
          existingTax.taxAmount += taxAmt;
        } else {
          taxBreakdown.push({
            taxName: tax.name,
            taxPercentage: tax.type === "percentage" ? tax.value : 0,
            taxAmount: taxAmt,
          });
        }

        itemTaxDetails.push({
          taxName: tax.name,
          taxPercentage: tax.type === "percentage" ? tax.value : 0,
          taxAmount: parseFloat(taxAmt.toFixed(2)),
        });
      }

      totalTaxAmount += itemTaxAmount;

      detailedItems.push({
        productId: product._id,
        productName: product.productName,
        quantity,
        price,
        total,
        taxes: itemTaxDetails,
      });

      inventory.quantity -= quantity;
      inventory.lastUpdated = new Date();
      await inventory.save();
    }

    taxBreakdown.forEach((t) => {
      t.taxAmount = parseFloat(t.taxAmount.toFixed(2));
    });

    const totalAmount = parseFloat((subtotal + totalTaxAmount).toFixed(2));

    const bill = new Bill({
      billId: uuidv4(),
      items: detailedItems,
      totalAmount,
      grandTotal: totalAmount,
      taxAmount: totalTaxAmount,
      store: storeId,
      customerName,
      customerPhone,
      taxBreakdown,
    });

    await bill.save();

    return res.status(201).json({
      message: "Bill created successfully",
      bill,
    });

  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
