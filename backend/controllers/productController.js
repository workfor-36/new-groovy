import Product from "../models/productModel.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { productName, category, size, color, price } = req.body;

    const product = new Product({
      productName,
      category,
      size,
      color,
      price,
      createdAt: new Date(),
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
