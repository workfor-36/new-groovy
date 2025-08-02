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
console.log("Password match result:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(manager._id, "Manager");
console.log("JWT_SECRET used in login route:", process.env.JWT_SECRET);

  // ✅ Set as HTTP-only cookie
  res
  .cookie("manager_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .json({
    message: "Login successful",
    storeId: manager.storeId,
    role: "Manager",
    token, // ✅ include token in body for Postman/manual testing
  });

};






export const loginCashier = async (req, res) => {
  const { email, password } = req.body;

  const cashier = await Cashier.findOne({ email });

  if (!cashier) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  console.log({
  entered: password,
  storedHash: cashier.password,
  match: await bcrypt.compare(password, cashier.password),
});

  
const isMatch = await bcrypt.compare(password, cashier.password);

console.log("Password match result:", isMatch);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(cashier._id, "Cashier");

console.log("JWT_SECRET used in login route:", process.env.JWT_SECRET);

  // ✅ Set as HTTP-only cookie
  res
  .cookie("cashier_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .json({
    message: "Login successful",
    cashier_storeId: cashier.storeId,
    role: "Cashier",
    token, // ✅ include token in body for Postman/manual testing
  });

};