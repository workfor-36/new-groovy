import Inventory from "../models/inventoryModel.js";
import Product from "../models/productModel.js";
import Store from "../models/storeModel.js";
import AuditLog from "../models/auditLogModel.js";
import ProductName from "../models/productNameModel.js";
// GET /api/inventory
export const getAllInventory = async (req, res) => {
  try {
    const inventories = await Inventory.find()
      .populate({
        path: "product",
        populate: {
          path: "productName", // this comes from your productModel
          model: "ProductName",
        },
      })
      .populate("store")
      .populate("category");

    res.json(inventories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};


// POST /api/inventory/adjust
export const adjustStock = async (req, res) => {
  try {
    const { storeId, productId, quantityChange, reason } = req.body;

    const updatedInventory = await Inventory.findOneAndUpdate(
      { store: storeId, product: productId },
      { $inc: { quantity: quantityChange }, $set: { lastUpdated: new Date() } },
      { new: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    await AuditLog.create({
      action: "Adjust Stock",
      details: `Changed ${quantityChange} units for product ${productId} at store ${storeId}. Reason: ${reason}`,
    });

    res.json({ message: "Stock adjusted successfully", updatedInventory });
  } catch (error) {
    res.status(500).json({ message: "Failed to adjust stock" });
  }
};

// POST /api/inventory/transfer
export const transferStock = async (req, res) => {
  try {
    const { fromStoreId, toStoreId, productId, quantity } = req.body;

    // Deduct from source store
    const fromInventory = await Inventory.findOneAndUpdate(
      { store: fromStoreId, product: productId },
      { $inc: { quantity: -quantity }, $set: { lastUpdated: new Date() } }
    );

    if (!fromInventory) {
      return res.status(404).json({ message: "Source inventory not found" });
    }

    // Add to destination store
    const toInventory = await Inventory.findOneAndUpdate(
      { store: toStoreId, product: productId },
      { $inc: { quantity: quantity }, $set: { lastUpdated: new Date() } },
      { upsert: true, new: true }
    );

    // Log the transfer
    await AuditLog.create({
      action: "Transfer Stock",
      details: `Transferred ${quantity} units of product ${productId} from store ${fromStoreId} to store ${toStoreId}`,
    });

    res.json({ message: "Stock transferred successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to transfer stock" });
  }
};



// GET /api/inventory/manager
export const getManagerInventory = async (req, res) => {
  try {
    const manager = req.user;
    const storeId = manager.store?._id || manager.storeId;

    if (!storeId) {
      return res.status(400).json({ message: "Store ID not found for manager." });
    }

    const inventory = await Inventory.find({ store: storeId })
      .populate({
        path: "product",
        select: "productName price size color",
        populate: [
          { path: "productName", model: "ProductName" },
          { path: "size", model: "Size" },
          { path: "color", model: "Color" },
        ],
      })
      .populate("category", "categoryName");

    res.json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ message: "Server error" });
  }
};
