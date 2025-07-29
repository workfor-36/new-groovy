import Store from "../models/storeModel.js";
import Cashier from "../models/cashierModel.js";
import Manager from "../models/managerModel.js";

// Create New Store
export const createStore = async (req, res) => {
  try {
    const { storeId, storeName, location } = req.body;

    const existing = await Store.findOne({ storeId });
    if (existing) return res.status(400).json({ message: "Store ID already exists" });

    const store = new Store({ storeId, storeName, location });
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: "Error creating store", error: err.message });
  }
};

// Get All Stores (for Store List)
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("cashier.email", "email")
      .populate("manager.email", "email");
    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores", error: err.message });
  }
};

// Assign Cashier to Store
export const assignCashier = async (req, res) => {
  try {
    const { storeId, cashierId } = req.body;

    const cashier = await Cashier.findById(cashierId);
    const store = await Store.findOne({ storeId });

    if (!cashier || !store) return res.status(404).json({ message: "Invalid data" });

    // Update cashier’s store reference
    cashier.storeId = store._id;
    cashier.storeName = store.storeName;
    await cashier.save();

    // Update store with cashier reference
    store.cashier = { name: cashier.name, email: cashier._id };
    await store.save();

    res.status(200).json({ message: "Cashier assigned to store successfully", store });
  } catch (err) {
    res.status(500).json({ message: "Error assigning cashier", error: err.message });
  }
};

// Assign Manager to Store
export const assignManager = async (req, res) => {
  try {
    const { storeId, managerId } = req.body;

    const manager = await Manager.findById(managerId);
    const store = await Store.findOne({ storeId });

    if (!manager || !store) return res.status(404).json({ message: "Invalid data" });

    manager.storeId = store._id;
    manager.storeName = store.storeName;
    await manager.save();

    store.manager = { name: manager.name, email: manager._id };
    await store.save();

    res.status(200).json({ message: "Manager assigned to store successfully", store });
  } catch (err) {
    res.status(500).json({ message: "Error assigning manager", error: err.message });
  }
};
