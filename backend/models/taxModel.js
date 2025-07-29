import mongoose from "mongoose";

const taxSchema = new mongoose.Schema({
  taxName: {
    type: String,
    required: true,
    default: "GST",
  },
  taxPercentage: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tax = mongoose.model("Tax", taxSchema);
export default Tax;
