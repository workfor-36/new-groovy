import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "", // Will be set using process.env.DEFAULT_MANAGER_PASSWORD
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
