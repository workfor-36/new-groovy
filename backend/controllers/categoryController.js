import Category from "../models/categoryModel.js";

// POST /api/category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, sizes, colors } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ categoryName });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      sizes: sizes || [],
      colors: colors || [],
    });

    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// DELETE /api/category/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};
