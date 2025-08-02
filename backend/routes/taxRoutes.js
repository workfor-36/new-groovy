import express from "express";
import { addTax, getAllTaxes, getTaxByCategory } from "../controllers/taxController.js";

const router = express.Router();

// POST: Add a new tax for a category
router.post("/", addTax);

// GET: Get all tax records
router.get("/", getAllTaxes);

// GET: Get tax by category ID
router.get("/category/:categoryId", getTaxByCategory);

export default router;
