import express from "express";
import { getStoreReport, getAllStoreReports } from "../controllers/reportController.js";
const router = express.Router();

// Route for manager (per store)
router.get("/store/:storeId", getStoreReport);

// Route for admin (all stores)
router.get("/all", getAllStoreReports);

export default router;
