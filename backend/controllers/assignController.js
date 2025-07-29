import Cashier from "../models/cashierModel.js";
import Manager from "../models/managerModel.js";

import bcrypt from "bcryptjs";

// Create Cashier or Manager
export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!["Cashier", "Manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const defaultPassword = role === "Cashier"
      ? process.env.DEFAULT_CASHIER_PASSWORD
      : process.env.DEFAULT_MANAGER_PASSWORD;

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    if (role === "Cashier") {
      const existing = await Cashier.findOne({ email });
      if (existing) return res.status(400).json({ message: "Cashier already exists" });

      const newCashier = new Cashier({
        name,
        email,
        password: hashedPassword,
        storeId: null,
        storeName: "",
      });

      await newCashier.save();
      return res.status(201).json({ message: "Cashier created successfully" });
    }

    if (role === "Manager") {
      const existing = await Manager.findOne({ email });
      if (existing) return res.status(400).json({ message: "Manager already exists" });

      const newManager = new Manager({
        name,
        email,
        password: hashedPassword,
        storeId: null,
        storeName: "",
      });

      await newManager.save();
      return res.status(201).json({ message: "Manager created successfully" });
    }

  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users (cashiers + managers) for Assign page
export const getAllUsers = async (req, res) => {
  try {
    const cashiers = await Cashier.find({}, "name email storeName");
    const managers = await Manager.find({}, "name email storeName");

    const allUsers = [
      ...managers.map((user) => ({ ...user.toObject(), role: "Manager" })),
      ...cashiers.map((user) => ({ ...user.toObject(), role: "Cashier" })),
    ];

    res.json(allUsers);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
