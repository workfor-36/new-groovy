import express from "express";
import {
  getAllInventory,
  adjustStock,
  transferStock,
  getManagerInventory,
} from "../controllers/inventoryController.js";




import { protectCashierOrManager,  } from "../middleware/authMiddleware.js";

// Optionally add protect middleware if you want role-based protection
// import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Routes
router.get("/", getAllInventory);               // GET /api/inventory
router.post("/adjust", adjustStock);            // POST /api/inventory/adjust
router.post("/transfer", transferStock);        // POST /api/inventory/transfer

// Manager Route
router.get("/manager",protectCashierOrManager, getManagerInventory);    // GET /api/inventory/manager

export default router;
