import Manager from "../models/managerModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import Cashier from "../models/cashierModel.js";



export const loginManager = async (req, res) => {
  const { email, password } = req.body;

  const manager = await Manager.findOne({ email });

  if (!manager) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, manager.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(manager._id, "manager");

  res.json({
    token,
    storeId: manager.storeId,
    role: "manager",
  });
};





export const loginCashier = async (req, res) => {
  const { email, password } = req.body;

  const cashier = await Cashier.findOne({ email });

  if (!cashier) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, cashier.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(cashier._id, "cashier");

  res.json({
    token,
    storeId: cashier.storeId,
    role: "cashier",
  });
};
