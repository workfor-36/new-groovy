import jwt from "jsonwebtoken";
import Cashier from "../models/cashierModel.js";
import Manager from "../models/managerModel.js";
import Admin from "../models/adminModel.js";

// Protect Cashier Route
export const protectCashier = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "cashier") {
      return res.status(403).json({ message: "Access denied: Cashiers only" });
    }

    const cashier = await Cashier.findById(decoded.id).select("-password");
    if (!cashier) {
      return res.status(401).json({ message: "Cashier not found" });
    }

    req.user = cashier;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protect Manager Route
export const protectManager = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "manager") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    const manager = await Manager.findById(decoded.id).select("-password");
    if (!manager) {
      return res.status(401).json({ message: "Manager not found" });
    }

    req.user = manager;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protect Admin Route
export const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
