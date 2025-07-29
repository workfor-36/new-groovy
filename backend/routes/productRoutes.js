import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);         // POST /api/products
router.get("/", getAllProducts);         // GET /api/products
router.put("/:id", updateProduct);       // PUT /api/products/:id
router.delete("/:id", deleteProduct);    // DELETE /api/products/:id

export default router;
