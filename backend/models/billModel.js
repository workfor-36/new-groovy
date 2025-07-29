import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true, // cache for quick access at time of billing
      },
      quantity: {
        type: Number,
        required: true, // how many units were sold
      },
      price: {
        type: Number,
        required: true, // price per unit
      },
      total: {
        type: Number,
        required: true, // price * quantity
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cashier",
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },

  taxPercentage: {
  type: Number,
  default: 0,
},
taxAmount: {
  type: Number,
  default: 0,
},
grandTotal: {
  type: Number,
  required: true, // totalAmount + taxAmount
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
