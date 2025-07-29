import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cashier: {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cashier",
      default: null,
    },
  },
  manager: {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
