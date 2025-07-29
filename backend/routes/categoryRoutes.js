import express from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);      // Add new category
router.get("/", getAllCategories);     // Get all
router.delete("/:id", deleteCategory); // Optional: delete a category

export default router;
