import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String, // Or use ObjectId if you have a Category model
    required: true,
  },
  size: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "-",
  },
  price: {
  type: Number,
  required: true,
},

  createdAt: {
    type: Date,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
