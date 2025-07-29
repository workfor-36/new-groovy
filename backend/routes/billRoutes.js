import express from "express";
import { createBill } from "../controllers/billController.js";
import { protectCashier } from "../middleware/authMiddleware.js";


const router = express.Router();

// POST /api/bills
router.post("/checkout", protectCashier, createBill);
export default router;
