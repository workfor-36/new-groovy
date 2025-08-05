import express from "express";
import { getStoreReport, getAllStoreReports } from "../controllers/reportController.js";
import { protectAdmin,protectManager } from "../middleware/authMiddleware.js";

const router = express.Router();
// Route for manager (per store)
router.get("/store/:storeId",protectManager,  getStoreReport);

// Route for admin (all stores)
router.get("/all", getAllStoreReports);

export default router;
