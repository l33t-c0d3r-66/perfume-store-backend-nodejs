const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Perfume",
        },
        price: { type: String, required: true },
        quantity: { type: String },
        typeof: { type: String, required: true },
        feellike: { type: String, required: true },
        brandname: { type: String, required: true },
        scentfamily: [{ type: String, required: true }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
