import express from "express";
import { createBill,getBillsByStore } from "../controllers/billController.js";
import { protectCashier,  } from "../middleware/authMiddleware.js";


const router = express.Router();

// POST /api/bills
router.post("/checkout", protectCashier, createBill);
router.get("/store/:storeId", protectCashier, getBillsByStore);

export default router;
